// Thoughts
// Each quarter has its own greenElapsed variable which shows how long the green light for a certain junction has been active
// this number could have some sort of hard limit, like say 1 minute in real life.
// in this duration, keep subtracting from the queues.

// would we have some sort of priority? Like if there is one junction quarter that would be next in turn however there is another quarter suffering
// quite a bit maybe it would be best to turn that one green instead and then the one with loewr priority would be lower, so maybe we could give
// each quarter some sort of urgency weighting.

// For now this simulation logic will cover a single junction quarter with 5 lanes. Extending it should be easy enough by just doing 4 quarters instead of 1

/* 
CONFIGURABLE PARAMETER NOTE: Number of Lanes --------------------------------------------------------------------------------------------------------
 
For the number of lanes, we will have to change the for loops because currently we are assuming there's a forwards lane, right turning lane and
a left turn/forwards lane which means the configurable parameter has been set to 3. With 5 lanes there will be 3 forwards lanes, 1 left/forwards lane
and then 1 right turn lane. Maybe we could change the right turn lane so that it is also a forwards lane.
*/

/* 
CONFIGURABLE PARAMETER NOTE: Left Turn Lane ----------------------------------------------------------------------------------------------------------

We might have to change the threading here a bit and call a new thread which is solely for cars in the left turn lane exiting the junction and this
will be called when the opposing lane has a green light. 
*/

/* 
CONFIGURABLE PARAMETER NOTE: Bus/Cycle Lane ----------------------------------------------------------------------------------------------------------
The bus lane will work by essentially funcitoning as a left turn lane and if it allows buses to go forwards or to the right then cars wont't
be allowed to go left and if it allows buses to go right then cars on the right side lanes can only go right too.

*/

/* 
CONFIGURABLE PARAMETER NOTE: Pedestrian Crossing ------------------------------------------------------------------------------------------------------

See the TODO below on changing the car outflow into a runnable

*/

/* 
CONFIGURABLE PARAMETER NOTE: Prioritised traffic flow -------------------------------------------------------------------------------------------------

What I think this is is just the order in which the traffic lights will be on so we can order it so that it is N, E, S, W or if we want to prioritise traffic 
coming from the west then we could say W, N, E, S where W (west) will be the first traffic light to turn green and then north then east and finally south
*/

/* 
TODO: To further extend this solution, I believe that turning the cars exiting thread into a runnable so we can adjust the time between calls to take
into account the fact that we will have to implement a pedestrian crossing where there will not be a constant trafic light green time. So it won't be every
minute for example it will be maybe once a minute and then with the crossing, add another minute to it so that the next call takes place in two.

*/

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