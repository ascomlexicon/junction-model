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

    // PRIORITIESED TRAFFIC FLOW: To implement this, we need to give each of the lanes a priority from 0-4 and this will determine the green light
    // length for each lane. Below are the times (time is done in real life seconds, not simulation seconds)
    /* 0 -> 5 seconds
     * 1 -> 10 seconds
     * 2 -> 20 seconds
     * 3 -> 30 seconds
     * 4 -> 45 seconds
     */
    // On top of that, the priority will determine the initial sequencing order for the traffic lights so for example if the current arrangement
    // of priorities is North 1, East 0, South 4, West 2, then the order will be South, West, North, East

    int directionIndex = 0; // index for the direction of the lane where North = 0, East = 1, South = 2, West = 3
    int greenLightOnTime = 0; // The time the green light is on for the lane in seconds
    long priorityArray[] = {0, 3, 4, 2}; // priority array for the lanes where indexes are North, East, South, West

    switch ((int) priorityArray[directionIndex]) {
      case 0:
        greenLightOnTime = 5;
        break;
      case 1:
        greenLightOnTime = 10;
        break;
      case 2:
        greenLightOnTime = 20;
        break;
      case 3:
        greenLightOnTime = 30;
        break;
      case 4:
        greenLightOnTime = 45;
        break;
    }

    long trafficLightCycle = 0; // The total duration of the traffic light cycle in seconds

    // Calculate the total duration of the traffic light cycle as well as converting priorities into times
    for (int i = 0; i < priorityArray.length; i++) {
      switch ((int) priorityArray[i]) {
        case 0:
          priorityArray[i] = 5L * 1_000_000_000 / 240; // Convert to nanoseconds and simulation time, need to do long calculations to avoid overflow
          break;
        case 1:
          priorityArray[i] = 10L * 1_000_000_000 / 240;
          break;
        case 2:
          priorityArray[i] = 20L * 1_000_000_000 / 240;
          break;
        case 3:
          priorityArray[i] = 30L * 1_000_000_000 / 240;
          break;
        case 4:
          priorityArray[i] = 45L * 1_000_000_000 / 240;
          break;
      }
      System.out.println("Priority for direction " + i + " is " + priorityArray[i] + " nanoseconds");
      trafficLightCycle += priorityArray[i];
    }

    System.out.println("Total traffic cycle = " + trafficLightCycle + " nanoseconds");

    final long trafficLightCycleFinal = trafficLightCycle; // final variable for the traffic light cycle
    final int greenLightOnTimeFinal = greenLightOnTime; // final variable for the green light on time

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

            // assuming 2 cars leave per second
            int carsLeaving = greenLightOnTimeFinal * 2;

            // Schedule 40 cars to exit over {the priority time} seconds
            for (int i = 0; i < carsLeaving; i++) {
              final int carIndex = i;
              carsExiting.schedule(
                  () -> {
                    exitQueue(outboundCars[0].poll());
                    exitQueue(outboundCars[1].poll());
                    exitQueue(outboundCars[2].poll());
                  },
                  (long) (carIndex * (priorityArray[directionIndex] / carsLeaving)),
                  TimeUnit.NANOSECONDS); // spread car exits over the green light's duration in nanoseconds stored in priorityArray[directionIndex]
            }
            
            long actualGreenLightTime = System.nanoTime() - threadStartTime;

            // reschedule the next greenlight after 300 milliseconds but also take into account the traffic light green time
            carsExiting.schedule(this, trafficLightCycleFinal - actualGreenLightTime, TimeUnit.NANOSECONDS);
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