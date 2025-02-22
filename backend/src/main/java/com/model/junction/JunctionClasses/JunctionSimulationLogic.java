package com.model.junction.JunctionClasses;

import java.util.LinkedList;
import java.util.Queue;
import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

class JunctionSimulationLogic {
  // all longs and integers have been replaced with AtomicInteger and AtomicLong because this allows us to update them in the threads
  // safely without race conditions being a thing because otherwise the variables might be overwritten
  private static final AtomicInteger count = new AtomicInteger(0); // Counts the number of cars that have entered a junction quarter
  private static final AtomicInteger quarterCarsExited = new AtomicInteger(0);
  private static final AtomicLong averageWaitTime = new AtomicLong(0);
  private static final AtomicLong maximumWaitingTime = new AtomicLong(0);
  private static final AtomicInteger maximumQueueLength = new AtomicInteger(0);
  private static final Random random = new Random(); // Random number generator
  private static double interArrivalTime = 0; // Inter-arrival time in seconds
  private static long exponentialTimeInterval = 0; // Exponential time interval

  public static void main(String[] args) {
    int northboundVph = 600; // vph for northbound traffic
    int exitingNorth = 350; // cars exiting north
    int exitingEast = 150; // cars exiting east
    int exitingWest = 100; // cars exiting west

    int simulationTime = 1; // simulation time in hours (15 seconds real time per hour)

    Queue<Long>[] outboundCars = new Queue[3];
    for (int i = 0; i < outboundCars.length; i++) {
      outboundCars[i] = new LinkedList<>();
    }

    // our scheduled executor services
    ScheduledExecutorService carsEntering = Executors.newScheduledThreadPool(1);
    ScheduledExecutorService carsExiting = Executors.newScheduledThreadPool(1);

    Runnable enterCarsTask =
        new Runnable() {
          @Override
          public void run() {
            if (carsEntering.isShutdown()) {
              return;
            }

            // Add cars to each lane
            for (int i = 0; i < exitingEast / 64; i++) {
              outboundCars[0].add(System.nanoTime());
              count.incrementAndGet();
              maximumQueueLength.updateAndGet(
                  currentMax -> Math.max(currentMax, outboundCars[0].size()));
            }

            for (int i = 0; i < exitingNorth / 64; i++) {
              if (outboundCars[1].size() > outboundCars[2].size() && outboundCars[1].size() > 30) {
                outboundCars[2].add(System.nanoTime());
                count.incrementAndGet();
                maximumQueueLength.updateAndGet(
                    currentMax -> Math.max(currentMax, outboundCars[2].size()));
              } else {
                outboundCars[1].add(System.nanoTime());
                count.incrementAndGet();
                maximumQueueLength.updateAndGet(
                    currentMax -> Math.max(currentMax, outboundCars[1].size()));
              }
            }

            for (int i = 0; i < exitingWest / 64; i++) {
              outboundCars[2].add(System.nanoTime());
              count.incrementAndGet();
              maximumQueueLength.updateAndGet(
                  currentMax -> Math.max(currentMax, outboundCars[2].size()));
            }

            // Generate the next arrival time (negative Exponential Distribution)
            interArrivalTime = -Math.log(1.0 - random.nextDouble()) / ((3600.0 / northboundVph));
            exponentialTimeInterval = (long) (interArrivalTime * 1000);  // Reduced delay

            // Reschedule the next entry with shorter delay
            carsEntering.schedule(this, exponentialTimeInterval, TimeUnit.MILLISECONDS);
          }
        };

    // runnable for exiting cars
    Runnable exitCarsTask =
        new Runnable() {
          @Override
          public void run() {
            if (carsExiting.isShutdown()) {
              return;
            }

            long threadStartTime = System.nanoTime();

            // Schedule 40 cars to exit over 75 milliseconds
            for (int i = 0; i < 40; i++) {
              final int carIndex = i;
              carsExiting.schedule(
                  () -> {
                    exitQueue(outboundCars[0].poll());
                    exitQueue(outboundCars[1].poll());
                    exitQueue(outboundCars[2].poll());
                  },
                  (long) (carIndex * (75.0 / 40)),
                  TimeUnit.MILLISECONDS); // spread car exits over 75 ms
            }
            
            long actualGreenLightTime = System.nanoTime() - threadStartTime;

            // reschedule the next greenlight after 300 milliseconds but also take into account the traffic light green time
            carsExiting.schedule(this, 300000000 - actualGreenLightTime, TimeUnit.NANOSECONDS);
          }
        };

    // start entering and exiting cars
    carsEntering.schedule(enterCarsTask, 0, TimeUnit.MILLISECONDS);
    carsExiting.schedule(exitCarsTask, 75, TimeUnit.MILLISECONDS);  // Reduced initial delay

    // scheduling shutdown of carsEntering
    carsEntering.schedule(
        () -> {
          System.out.println("Shutting down carsEntering. Total cars entered: " + count.get());
          System.out.println(
              "Average Wait Time = "
                  + averageWaitTime.get() / 1000000
                  + "ms, Maximum Queue Length = "
                  + maximumQueueLength.get()
                  + ", Maximum Wait Time = "
                  + maximumWaitingTime.get() / 1000000
                  + "ms");
          carsEntering.shutdown();
        },
        simulationTime * 15,
        TimeUnit.SECONDS);

    // scheduling the shutdown of carsExiting
    carsExiting.schedule(
        () -> {
          System.out.println("Shutting down carsExiting");
          carsExiting.shutdown();
        },
        simulationTime * 15,
        TimeUnit.SECONDS);
  }

  // updates our metrics when cars exit the queue
  public static void exitQueue(Long enterTime) {
    if (enterTime != null) {
      long waitingTime = System.nanoTime() - enterTime;
      maximumWaitingTime.updateAndGet(currentMax -> Math.max(currentMax, waitingTime));
      int exitedCars = quarterCarsExited.incrementAndGet();
      averageWaitTime.updateAndGet(
          currentAvg -> ((currentAvg * (exitedCars - 1)) + waitingTime) / exitedCars);
    }
  }
}