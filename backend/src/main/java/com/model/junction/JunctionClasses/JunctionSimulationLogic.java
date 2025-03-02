package com.model.junction.JunctionClasses;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Queue;
import java.util.Random;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

// THE VARIABLES THAT HAVE BEEN NOTED AS "KEY" ARE THE CONFIGURABLE PARAMETERS THAT THE USER CAN CHANGE

class JunctionSimulationLogic {
  // all longs and integers have been replaced with AtomicInteger and AtomicLong because this allows us to update them in the threads
  // safely without race conditions being a thing because otherwise the variables might be overwritten
  private static final AtomicInteger carsEntered = new AtomicInteger(0); // Counts the number of cars that have entered a junction quarter
  private static final AtomicInteger quarterCarsExited = new AtomicInteger(0);
  private static final AtomicLong averageWaitTime = new AtomicLong(0);
  private static final AtomicLong maximumWaitingTime = new AtomicLong(0);
  private static final AtomicInteger maximumQueueLength = new AtomicInteger(0);
  private static final Random random = new Random(); // Random number generator
  private static double interArrivalTime = 0; // Inter-arrival time in seconds
  private static long exponentialTimeInterval = 0; // Exponential time interval
  private static long simulationStartTime = System.nanoTime(); // Start time of the simulation
  private static final AtomicInteger totalCarsExited = new AtomicInteger(0); /* count car exitings */

  // MODIFICATIONS
  enum LaneType {
    FORWARD_ONLY, RIGHT_ONLY, LEFT_ONLY, ALL_DIRECTIONS, LEFT_FORWARD, RIGHT_FORWARD
  }
  /* Bus lane modification */
  private static final AtomicBoolean leftLane = new AtomicBoolean(false);
  private static final AtomicBoolean busCycleLane = new AtomicBoolean(false);
  /* Bus lane modification END */

  private static Queue<Long>[] outboundCars;
  private static List<LaneType> laneTypes= Collections.synchronizedList(new ArrayList<>());
  
  public static void main(String[] args) {
    // "KEY"
    int exitingForward = 200; // cars exiting straight forward
    // "KEY"
    int exitingRight = 300; // cars exiting right
    // "KEY"
    int exitingLeft = 50; // cars exiting left

    int outboundVph = exitingRight + exitingForward + exitingLeft; // total vehicles per hour

    // "KEY"
    // NUMBER OF LANES: The number of lanes can be set to 1, 2, 3, 4 or 5
    int numberOfLanes = 3;

    // "KEY"
    // LEFT TURN LANE: If the left lane is enabled, the leftmost lane will be the left turn lane
    leftLane.set(false);

    
    // "KEY"
    // BUS LANE: If the bus lane is enabled, the leftmost lane will be the bus lane
    busCycleLane.set(true);

    initializeLanes(numberOfLanes);

    // PUFFIN CROSSING:
    // "KEY"
    boolean puffinCrossing = false; // Puffin crossing is enabled
    // "KEY"
    int puffinCrossingDuration = 100; // Puffin crossing time in seconds
    // "KEY"
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

    // "KEY"
    int directionIndex = 0; // index for the direction of the lane where North = 0, East = 1, South = 2, West = 3

    int greenLightOnTime = 0; // The time the green light is on for the lane in seconds
    
    // "KEY"
    long lanePriorities[] = {0, 3, 4, 1}; // priority array for the lanes where indexes are North, East, South, West

    long initialDelay = 0; // initial delay for the cars to start entering the junction
    int priority = (int) lanePriorities[directionIndex]; // priority for the lane

    // LEFT LANE: The left lane will also go when the opposite junction quarter goes
    int oppositeLane = (directionIndex + 2) % 4; // opposite lane to the current lane
    int oppositePriority = (int) lanePriorities[oppositeLane]; // priority for the opposite lane
    long leftLaneDelay = 0; // delay for the left lane

    switch ((int) lanePriorities[directionIndex]) {
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
    for (int i = 0; i < lanePriorities.length; i++) {
      int currentPriority = (int) lanePriorities[i];
      switch (currentPriority) {
        case 0:
          lanePriorities[i] = convertToSimulationTime(5);
          break;
        case 1:
          lanePriorities[i] = convertToSimulationTime(10);
          break;
        case 2:
          lanePriorities[i] = convertToSimulationTime(20);
          break;
        case 3:
          lanePriorities[i] = convertToSimulationTime(30);
          break;
        case 4:
          lanePriorities[i] = convertToSimulationTime(45);
          break;
      }

      if (currentPriority > priority)
      {
        initialDelay += lanePriorities[i];
      }

      // the left lane also goes when the opposite junction quarter goes
      if (currentPriority > oppositePriority)
      {
        leftLaneDelay += lanePriorities[i];
      }

      System.out.println("Priority for direction " + i + " is " + lanePriorities[i] + " nanoseconds");
      trafficLightCycle += lanePriorities[i];
    }

    System.out.println("Initial delay = " + initialDelay + " nanoseconds");
    System.out.println("Total traffic cycle = " + trafficLightCycle + " nanoseconds");

    final long leftLaneInitialDelay = leftLaneDelay; // final variable for the left lane initial delay
    final long initialDelayFinal = initialDelay; // final variable for the initial delay
    final long trafficLightCycleFinal = trafficLightCycle; // final variable for the traffic light cycle
    final int greenLightOnTimeFinal = greenLightOnTime; // final variable for the green light on time

    int simulationTime = 1; // simulation time in hours (15 seconds real time per hour)

    // our scheduled executor services
    ScheduledExecutorService carsEntering = Executors.newScheduledThreadPool(1);
    ScheduledExecutorService carsExiting = Executors.newScheduledThreadPool(1);
    ScheduledExecutorService leftLaneCarsExiting = Executors.newScheduledThreadPool(1);

    // The max number of vehicles that can enter the junction per hour is the northboundVPH
    final int maxVehicles = outboundVph;

    Runnable enterCarsTask =
      new Runnable() {
        @Override
        public void run() {
        if (carsEntering.isShutdown()) {
          return;
        }
        
        // Stop adding cars if we've reached the limit
        if (carsEntered.get() >= maxVehicles) {
          return;
        }

        // Generate Poisson-distributed number of cars for each lane
        int carsRight = generatePoisson((int) exitingRight / 60);
        int carsForward = generatePoisson((int) exitingForward / 60);
        int carsLeft = generatePoisson((int) exitingLeft / 60);
        
        // Compute the total generated cars for this round
        int totalCars = carsRight + carsForward + carsLeft;
        int remaining = maxVehicles - carsEntered.get();
        
        // If adding all generated cars would exceed the max, scale the numbers down
        if (totalCars > remaining && totalCars > 0) {
          double scale = remaining / (double) totalCars;
          carsRight = (int) Math.floor(carsRight * scale);
          carsForward = (int) Math.floor(carsForward * scale);
          // make sure that the total does not exceed remaining
          carsLeft = remaining - (carsRight + carsForward);
          if (carsLeft < 0) {
            carsLeft = 0;
          }
        }
        
        distributeCars(carsRight, LaneType.RIGHT_ONLY);
        distributeCars(carsForward, LaneType.FORWARD_ONLY);
        distributeCars(carsLeft, LaneType.LEFT_ONLY);

        // Generate the next arrival time (negative Exponential Distribution)
        interArrivalTime = -Math.log(1.0 - random.nextDouble()) / ((3600.0 / maxVehicles));
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
          // 1.35 buses leave per second
          int busesLeaving = (int) (greenLightOnTimeFinal * 1.35);

          // Schedule {carsLeaving} cars to exit over {the priority time} seconds
          for (int i = 0; i < carsLeaving; i++) {
            final int carIndex = i;
            final long rowIntervals = (long) ((carIndex + 1) * ((lanePriorities[directionIndex] / (double) carsLeaving))  
            * ThreadLocalRandom.current().nextDouble(0.95, 1.05)); // randomize the time a car exits
            carsExiting.schedule(
                () -> {
                  for (int j = 0; j < numberOfLanes; j++){

                    final int laneIndex = j;                   

                   /* Bus lane modification */
                   if(busCycleLane.get() && laneIndex==0){
                    if(carIndex <= busesLeaving){
                      carsExiting.schedule( () -> {
                        exitQueue(outboundCars[laneIndex].poll());
                        maximumQueueLength.updateAndGet(
                        currentMax -> Math.max(currentMax, outboundCars[laneIndex].size()));
                      },
                      ((long) ((laneIndex + 1) * ((rowIntervals / numberOfLanes)))),
                      TimeUnit.NANOSECONDS); // spread car exits over the row intervals' duration in nanoseconds 
                    }
                
                  }else{
                    carsExiting.schedule( () -> {
                      exitQueue(outboundCars[laneIndex].poll());
                      maximumQueueLength.updateAndGet(
                      currentMax -> Math.max(currentMax, outboundCars[laneIndex].size()));
                    },
                    ((long) ((laneIndex + 1) * ((rowIntervals / numberOfLanes)))),
                    TimeUnit.NANOSECONDS); // spread car exits over the row intervals' duration in nanoseconds 
                  }
                  /* Bus lane modification END */

                  } 
                },
                (rowIntervals),
                TimeUnit.NANOSECONDS); // spread car exits over the green light's duration in nanoseconds stored in lanePriorities[directionIndex]
          }
          
          long actualGreenLightTime = System.nanoTime() - threadStartTime;
          long timeToNextGreen = calculateTimeToNextGreen(trafficLightCycleFinal - actualGreenLightTime, puffinCrossing, crossingsPerHour, crossingInterval, crossingDuration);

          carsExiting.schedule(this, timeToNextGreen, TimeUnit.NANOSECONDS);
        }
      };

    Runnable leftLaneCarsExitingTask =
      new Runnable() {
        @Override
        public void run() {
          if (leftLaneCarsExiting.isShutdown()) {
            return;
          }

          long threadStartTime = System.nanoTime();

          // assuming 2 cars leave per second
          int carsLeaving = greenLightOnTimeFinal * 2;

          for (int i = 0; i < carsLeaving; i++) {
            final int carIndex = i;

            // since we are only checking one lane, there is no need to loop through the rest
            leftLaneCarsExiting.schedule(
                () -> {
                  // make the cars leave the leftmost lane
                  exitQueue(outboundCars[0].poll());
                  maximumQueueLength.updateAndGet(currentMax -> Math.max(currentMax, outboundCars[0].size()));
                },
                (long) (carIndex * (lanePriorities[oppositeLane] / carsLeaving)),
                TimeUnit.NANOSECONDS); // spread car exits over the green light's duration in nanoseconds stored in lanePriorities[directionIndex]
              }

          long actualGreenLightTime = System.nanoTime() - threadStartTime;
          long timeToNextGreen = calculateTimeToNextGreen(trafficLightCycleFinal - actualGreenLightTime, puffinCrossing, crossingsPerHour, crossingInterval, crossingDuration);

          leftLaneCarsExiting.schedule(this, timeToNextGreen, TimeUnit.NANOSECONDS);
        }
      };

    // start entering and exiting cars
    carsEntering.schedule(enterCarsTask, 0, TimeUnit.MILLISECONDS);
    carsExiting.schedule(exitCarsTask, initialDelayFinal, TimeUnit.NANOSECONDS);
    if (leftLane.get()){
      leftLaneCarsExiting.schedule(leftLaneCarsExitingTask, leftLaneInitialDelay, TimeUnit.NANOSECONDS);
    }

    // scheduling shutdown of carsEntering
    carsEntering.schedule(
        () -> {
          System.out.println("Shutting down carsEntering. Total cars entered: " + carsEntered.get());
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
          System.out.println("Total cars exisited : " + totalCarsExited.get());
          carsExiting.shutdown();
          System.out.println("Total cars exisited : "+totalCarsExited.get());
        },
        simulationTime * 15,
        TimeUnit.SECONDS);

    if (leftLane.get()){
      leftLaneCarsExiting.schedule(
          () -> {
            System.out.println("Shutting down leftLaneCarsExiting");
            leftLaneCarsExiting.shutdown();
          },
          simulationTime * 15,
          TimeUnit.SECONDS);
    }
  }

  // updates our metrics when cars exit the queue
  public static void exitQueue(Long enterTime) {
    if (enterTime != null) {
      totalCarsExited.incrementAndGet(); /* count car exiting */
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

  /* START OF SHAHAD CODE */
  //helper methode for findShortestLane
  private static boolean isLaneValidForDirection(int laneIndex, LaneType direction) {
    return laneTypes.get(laneIndex) == direction ||
    laneTypes.get(laneIndex) == LaneType.ALL_DIRECTIONS ||
    (direction == LaneType.FORWARD_ONLY && laneTypes.get(laneIndex) == LaneType.RIGHT_FORWARD) ||
    (direction == LaneType.FORWARD_ONLY && laneTypes.get(laneIndex) == LaneType.LEFT_FORWARD) ||
    (direction == LaneType.RIGHT_ONLY && laneTypes.get(laneIndex) == LaneType.RIGHT_FORWARD) ||
    (direction == LaneType.LEFT_ONLY && laneTypes.get(laneIndex) == LaneType.LEFT_FORWARD&&!(busCycleLane.get())) ; /* Bus lane modification */
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
    
    //this is will never happen as all cases are covered
    return bestLane;
  }
    
  //adding cars to shortest valid lane
  private static void distributeCars(int numCars, LaneType direction) {
    for (int i = 0; i < numCars; i++) {
      int bestLane = findShortestLane(direction);
      outboundCars[bestLane].add(System.nanoTime());
      carsEntered.incrementAndGet();
      maximumQueueLength.updateAndGet(currentMax -> Math.max(currentMax, outboundCars[bestLane].size()));  
    }
  }

  /* Bus lane modification (if conditions) */
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
        laneTypes.add((leftLane.get()||busCycleLane.get()) ? LaneType.LEFT_ONLY : LaneType.LEFT_FORWARD);
        laneTypes.add(LaneType.RIGHT_FORWARD);
      break;
      case 3:
        if (leftLane.get()||busCycleLane.get()) {
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
        if (leftLane.get()||busCycleLane.get()) {
          laneTypes.add( LaneType.LEFT_ONLY);
          laneTypes.add( LaneType.FORWARD_ONLY);
          laneTypes.add( LaneType.FORWARD_ONLY);
          laneTypes.add( LaneType.RIGHT_FORWARD);
        } else {
          laneTypes.add( LaneType.LEFT_FORWARD);
          laneTypes.add( LaneType.FORWARD_ONLY);
          laneTypes.add( LaneType.FORWARD_ONLY);
          laneTypes.add( LaneType.RIGHT_FORWARD);
        }
      break;
      case 5:
        if (leftLane.get()||busCycleLane.get()) {
          laneTypes.add(LaneType.LEFT_ONLY);
          laneTypes.add(LaneType.FORWARD_ONLY);
          laneTypes.add(LaneType.FORWARD_ONLY);
          laneTypes.add(LaneType.FORWARD_ONLY);
          laneTypes.add(LaneType.RIGHT_FORWARD);
        } else {
          laneTypes.add(LaneType.LEFT_FORWARD);
          laneTypes.add(LaneType.FORWARD_ONLY);
          laneTypes.add(LaneType.FORWARD_ONLY);
          laneTypes.add(LaneType.FORWARD_ONLY);
          laneTypes.add(LaneType.RIGHT_FORWARD);
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

/* END OF SHAHAD CODE */