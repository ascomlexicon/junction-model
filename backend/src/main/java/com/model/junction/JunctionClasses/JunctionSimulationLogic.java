package com.model.junction.JunctionClasses;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.Random;
import java.util.concurrent.ConcurrentLinkedQueue;
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
  private static long simulationStartTime = System.nanoTime(); // Start time of the simulation

  // MODIFICATIONS
  enum LaneType {
    FORWARD_ONLY, RIGHT_ONLY, LEFT_ONLY, ALL_DIRECTIONS, LEFT_FORWARD, RIGHT_FORWARD
  }
  private static boolean leftLane;
  private static Queue<Long>[] outboundCars;
  private static List<LaneType> laneTypes= Collections.synchronizedList(new ArrayList<>());

  public static void main(String[] args) {
    int northboundVph = 600; // vph for northbound traffic
    int exitingNorth = 350; // cars exiting north
    int exitingEast = 150; // cars exiting east
    int exitingWest = 100; // cars exiting west

    // NUMBER OF LANES: The number of lanes can be set to 1, 2, 3, 4 or 5
    // LEFT TURN LANE: If the left lane is enabled, the leftmost lane will be the left turn lane
    int numberOfLanes = 3;
    leftLane = false;
    initializeLanes(numberOfLanes);

    // PUFFIN CROSSING:
    boolean puffinCrossing = false; // Puffin crossing is enabled
    int puffinCrossingDuration = 100; // Puffin crossing time in seconds
    int puffinCrossingsPerHour = 6; // Number of crossings per hour

    final int crossingsPerHour = puffinCrossingsPerHour + 1; // Add 1 to crossings per hour to account for the first crossing
    final long crossingInterval = convertToSimulationTime(3600 / crossingsPerHour); // Time interval between crossings in nanoseconds
    final long crossingDuration = convertToSimulationTime(puffinCrossingDuration); // Time taken to cross the road in nanoseconds

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
    long priorityArray[] = {0, 3, 4, 1}; // priority array for the lanes where indexes are North, East, South, West
    long initialDelay = 0; // initial delay for the cars to start entering the junction
    int priority = (int) priorityArray[directionIndex]; // priority for the lane

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
      int currentPriority = (int) priorityArray[i];
      switch (currentPriority) {
        case 0:
          priorityArray[i] = convertToSimulationTime(5);
          break;
        case 1:
          priorityArray[i] = convertToSimulationTime(10);
          break;
        case 2:
          priorityArray[i] = convertToSimulationTime(20);
          break;
        case 3:
          priorityArray[i] = convertToSimulationTime(30);
          break;
        case 4:
          priorityArray[i] = convertToSimulationTime(45);
          break;
      }

      if (currentPriority > priority)
      {
        initialDelay += priorityArray[i];
      }

      System.out.println("Priority for direction " + i + " is " + priorityArray[i] + " nanoseconds");
      trafficLightCycle += priorityArray[i];
    }

    System.out.println("Initial delay = " + initialDelay + " nanoseconds");
    System.out.println("Total traffic cycle = " + trafficLightCycle + " nanoseconds");

    final long initialDelayFinal = initialDelay; // final variable for the initial delay
    final long trafficLightCycleFinal = trafficLightCycle; // final variable for the traffic light cycle
    final int greenLightOnTimeFinal = greenLightOnTime; // final variable for the green light on time

    int simulationTime = 1; // simulation time in hours (15 seconds real time per hour)

    // our scheduled executor services
    ScheduledExecutorService carsEntering = Executors.newScheduledThreadPool(1);
    ScheduledExecutorService carsExiting = Executors.newScheduledThreadPool(1);

    // The max number of vehicles that can enter the junction per hour is the northboundVPH
    final int maxVehicles = northboundVph;

    Runnable enterCarsTask =
      new Runnable() {
        @Override
        public void run() {
        if (carsEntering.isShutdown()) {
          return;
        }
        
        // Stop adding cars if we've reached the limit.
        if (count.get() >= maxVehicles) {
          return;
        }

        // Generate Poisson-distributed number of cars for each lane
        int carsEast = generatePoisson((int) exitingEast / 60);
        int carsNorth = generatePoisson((int) exitingNorth / 60);
        int carsWest = generatePoisson((int) exitingWest / 60);
        
        // Compute the total generated cars for this round
        int totalCars = carsEast + carsNorth + carsWest;
        int remaining = maxVehicles - count.get();
        
        // If adding all generated cars would exceed the max, scale the numbers down
        if (totalCars > remaining && totalCars > 0) {
          double scale = remaining / (double) totalCars;
          carsEast = (int) Math.floor(carsEast * scale);
          carsNorth = (int) Math.floor(carsNorth * scale);
          // make sure that the total does not exceed remaining
          carsWest = remaining - (carsEast + carsNorth);
          if (carsWest < 0) {
          carsWest = 0;
          }
        }
        
        distributeCars(carsEast, LaneType.RIGHT_ONLY);
        distributeCars(carsNorth, LaneType.FORWARD_ONLY);
        distributeCars(carsWest, LaneType.LEFT_ONLY);

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

            // Schedule {carsLeaving} cars to exit over {the priority time} seconds
            for (int i = 0; i < carsLeaving; i++) {
              final int carIndex = i;
              carsExiting.schedule(
                  () -> {
                    exitQueue(outboundCars[0].poll());
                    maximumQueueLength.updateAndGet(
                        currentMax -> Math.max(currentMax, outboundCars[0].size()));
                    exitQueue(outboundCars[1].poll());
                    maximumQueueLength.updateAndGet(
                        currentMax -> Math.max(currentMax, outboundCars[1].size()));
                    exitQueue(outboundCars[2].poll());
                    maximumQueueLength.updateAndGet(
                        currentMax -> Math.max(currentMax, outboundCars[2].size()));
                  },
                  (long) (carIndex * (priorityArray[directionIndex] / carsLeaving)),
                  TimeUnit.NANOSECONDS); // spread car exits over the green light's duration in nanoseconds stored in priorityArray[directionIndex]
            }
            
            long actualGreenLightTime = System.nanoTime() - threadStartTime;
            long timeToNextGreen = calculateTimeToNextGreen(trafficLightCycleFinal - actualGreenLightTime, puffinCrossing, crossingsPerHour, crossingInterval, crossingDuration);

            carsExiting.schedule(this, timeToNextGreen, TimeUnit.NANOSECONDS);
          }
        };

    // start entering and exiting cars
    carsEntering.schedule(enterCarsTask, 0, TimeUnit.MILLISECONDS);
    carsExiting.schedule(exitCarsTask, initialDelayFinal, TimeUnit.NANOSECONDS);

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

  // calculates the time to the next green light
  private static long calculateTimeToNextGreen(long currentWaitTime, boolean puffinCrossing, int crossingsPerHour, long crossingInterval, long crossingDuration){
    long nextGreenTime = System.nanoTime() + currentWaitTime;

    if (puffinCrossing){
      for (int i = 1; i < crossingsPerHour; i++){
        long intervalStart = simulationStartTime + crossingInterval * i;
        long intervalEnd = intervalStart + crossingDuration;

        // need the 100000000 because this takes into account small time differences and so acts as a buffer
        if (intervalEnd - nextGreenTime > -100000000 && nextGreenTime - intervalStart > -100000000){
          System.out.println("Puffin crossing is active");
          return currentWaitTime + crossingDuration;
        }
      }
    }
    return currentWaitTime;
  }

  // converts real time to simulation time (1 second real time = 240 seconds simulation time)
  private static long convertToSimulationTime(long realTime){
    return realTime * 1_000_000_000 / 240;
  }

  //helper methode for findShortestLane
  private static boolean isLaneValidForDirection(int laneIndex, LaneType direction) {
    return laneTypes.get(laneIndex) == direction ||
    laneTypes.get(laneIndex) == LaneType.ALL_DIRECTIONS ||
    (direction == LaneType.FORWARD_ONLY && laneTypes.get(laneIndex) == LaneType.RIGHT_FORWARD) ||
    (direction == LaneType.FORWARD_ONLY && laneTypes.get(laneIndex) == LaneType.LEFT_FORWARD) ||
    (direction == LaneType.RIGHT_ONLY && laneTypes.get(laneIndex) == LaneType.RIGHT_FORWARD) ||
    (direction == LaneType.LEFT_ONLY && laneTypes.get(laneIndex) == LaneType.LEFT_FORWARD) ;
  }
        
  private static int findShortestLane(LaneType direction) {
    int bestLane = -1;
    int minSize = Integer.MAX_VALUE;

    for (int i = 0; i < outboundCars.length; i++) {
      if (!isLaneValidForDirection(i, direction)) 
        continue;
      if (outboundCars[i].size() < minSize) {
        minSize = outboundCars[i].size();
        bestLane = i;
      }
    }
    
    //this is will never happen as all casses are covered
    return bestLane;
  }
    
  //adding cars to shortest valid lane
  private static void distributeCars(int numCars, LaneType direction) {
    for (int i = 0; i < numCars; i++) {
      int bestLane = findShortestLane(direction);
      outboundCars[bestLane].add(System.nanoTime());
      count.incrementAndGet();
      maximumQueueLength.updateAndGet(
        currentMax -> Math.max(currentMax, outboundCars[0].size()));    
    }
  }

  //create lanes based on number of lanes
  private static void initializeLanes(int numberOfLanes) {
    outboundCars = new ConcurrentLinkedQueue[numberOfLanes];

    for (int i = 0; i < numberOfLanes; i++) {
      outboundCars[i] = new ConcurrentLinkedQueue<>();
    }

    switch (numberOfLanes) {
      case 1:
        laneTypes.add(LaneType.ALL_DIRECTIONS);
      break;
      case 2:
        laneTypes.add(leftLane ? LaneType.LEFT_ONLY : LaneType.LEFT_FORWARD);
        laneTypes.add(LaneType.RIGHT_FORWARD);
      break;
      case 3:
        if (leftLane) {
          laneTypes.add(LaneType.LEFT_ONLY);
          laneTypes.add(LaneType.FORWARD_ONLY);
          laneTypes.add(LaneType.RIGHT_FORWARD);
        } else {
          laneTypes.add(LaneType.LEFT_FORWARD);
          laneTypes.add(LaneType.FORWARD_ONLY);
          laneTypes.add(LaneType.RIGHT_FORWARD);
        }
      break;
      case 4:
        if (leftLane) {
          laneTypes.add( LaneType.LEFT_ONLY);
          laneTypes.add( LaneType.FORWARD_ONLY);
          laneTypes.add( LaneType.RIGHT_FORWARD);
          laneTypes.add( LaneType.RIGHT_ONLY);
        } else {
          laneTypes.add( LaneType.LEFT_FORWARD);
          laneTypes.add( LaneType.FORWARD_ONLY);
          laneTypes.add( LaneType.RIGHT_FORWARD);
          laneTypes.add( LaneType.RIGHT_ONLY);
        }
      break;
      case 5:
        if (leftLane) {
          laneTypes.add(LaneType.LEFT_ONLY);
          laneTypes.add(LaneType.FORWARD_ONLY);
          laneTypes.add(LaneType.FORWARD_ONLY);
          laneTypes.add(LaneType.RIGHT_FORWARD);
          laneTypes.add(LaneType.RIGHT_ONLY);
        } else {
          laneTypes.add(LaneType.LEFT_FORWARD);
          laneTypes.add(LaneType.FORWARD_ONLY);
          laneTypes.add(LaneType.FORWARD_ONLY);
          laneTypes.add(LaneType.RIGHT_FORWARD);
          laneTypes.add(LaneType.RIGHT_ONLY);
        }
      break;
    }
  }

      
  // Poisson distribution generator(this algorithm proposed by D. Knuth:)
  private static int generatePoisson(int lambda) {
      double L = Math.exp(-lambda); 
      double p = 1.0;
      int k = 0;

      // Keep generating Poisson until p < L
      do {
          k++;
          p *= random.nextDouble();
      } while (p > L);

      return k - 1;
  }
}