// Thoughts
// Each quarter has its own greenElapsed variable which shows how long the green light for a certain junction has been active
// this number could have some sort of hard limit, like say 1 minute in real life.
// in this duration, keep subtracting from the queues.

// would we have some sort of priority? Like if there is one junction quarter that would be next in turn however there is another quarter suffering
// quite a bit maybe it would be best to turn that one green instead and then the one with loewr priority would be lower, so maybe we could give
// each quarter some sort of urgency weighting.

// For now this simulation logic will cover a single junction quarter with 5 lanes. Extending it should be easy enough by just doing 4 quarters instead of 1

import java.util.LinkedList;
import java.util.Queue;
import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

class JunctionSimulationLogic {
    private static int count = 0;
    private static boolean trafficLight = false;
    // counts the number of cars that have left a junction quarter
    private static int quarterCarsExited = 0;
    // the average wait time for a junction quarter
    // we will modify this by doing: (quarterCarsExited * averageWaitTime + (new car's wait time)) / ++quarterCarsExited
    private static long averageWaitTime = 0;
    // before removing cars check if waiting time is larger than the max
    private static long maximumWaitingTime = 0;
    // before removing cars determine max Queue
    private static int maximumQueueLength = 0;
    // variables used to calculate intervals (generated using negative exponential distribution)
    static Random random = new Random();
    private static double interArrivalTime = 0; // In seconds
    private static long exponentialTimeInterval = 0;

    public static void main(String[] args) {
        int northboundVph = 450;
        int exitingNorth = 250;
        int exitingEast = 150;
        int exitingWest = 50;

        // This is the simulation time in hours currently, an hour in the simulation will translate to 15 seconds in real time
        int simulationTime = 2;

        Queue<Long>[] outboundCars = new Queue[3];

        for (int i = 0; i < outboundCars.length; i++) {
            outboundCars[i] = new LinkedList<>();
        }

        // Create a scheduled executor service with a single thread
        ScheduledExecutorService carsEntering = Executors.newScheduledThreadPool(1);
        ScheduledExecutorService carsExiting = Executors.newScheduledThreadPool(1);

        // Car entering task using recursive scheduling
        Runnable enterCarsTask = new Runnable() {
            @Override
            public void run() {
                if (carsEntering.isShutdown()) {
                    return;
                }

                // Add cars to each lane
                for (int i = 0; i < exitingEast / 60; i++) {
                    System.out.println("Car entered lane 0 at " + System.currentTimeMillis());
                    outboundCars[0].add(System.nanoTime());
                    count++;
                }

                for (int i = 0; i < exitingNorth / 60; i++) {
                    if (outboundCars[1].size() > outboundCars[2].size() && outboundCars[1].size() > 30) {
                        System.out.println("Car entered lane 2 at " + System.currentTimeMillis());
                        outboundCars[2].add(System.nanoTime());
                        count++;
                    } else {
                        System.out.println("Car entered lane 1 at " + System.currentTimeMillis());
                        outboundCars[1].add(System.nanoTime());
                        count++;
                    }
                }

                for (int i = 0; i < exitingWest / 60; i++) {
                    System.out.println("Car entered lane 2 at " + System.currentTimeMillis());
                    outboundCars[2].add(System.nanoTime());
                    count++;
                }

                // Generate the next arrival time (negative Exponential Distribution)
                interArrivalTime = -Math.log(1.0 - random.nextDouble()) / ((3600.0 / northboundVph));
                exponentialTimeInterval = (long) (interArrivalTime * 2 * 1000);

                System.out.println("Time until next car: " + exponentialTimeInterval + "ms");

                // Reschedule the next entry
                carsEntering.schedule(this, exponentialTimeInterval, TimeUnit.MILLISECONDS);
            }
        };

        // Start entering cars
        carsEntering.schedule(enterCarsTask, 0, TimeUnit.MILLISECONDS);

        // Optionally, schedule a shutdown after some time
        carsEntering.schedule(() -> {
            System.out.println("shutting down" + count);
            System.out.println("AWT = " + averageWaitTime + ", MQL = " + maximumQueueLength + ", MWL = " + maximumWaitingTime);
            carsEntering.shutdown();
        }, 15, TimeUnit.SECONDS);

        carsExiting.scheduleAtFixedRate(() -> {
            // Run burst of 3 traffic outflows at 25ms intervals every 250ms
            trafficLightGreen(outboundCars, carsExiting);
        }, 75, 250, TimeUnit.MILLISECONDS); // 75 is the delay and then 250 is the interval
        
        // Schedule shutdown 15 secs aftre simulation start
        carsExiting.schedule(() -> {
            System.out.println("carsExiting thread shutting down");
            carsExiting.shutdown();
        }, 15, TimeUnit.SECONDS);
    }

    public static void exitQueue(long enterTime) {
        if (enterTime != null)
        {
            long waitingTime = System.nanoTime() - enterTime;
            // compute MWT AWT
            maximumWaitingTime = Math.max(maximumWaitingTime, waitingTime);
            averageWaitTime = ((averageWaitTime * quarterCarsExited) + waitingTime) / (++quarterCarsExited);
        }
    }

    private static void trafficLightGreen(Queue<Car>[] outboundCars, ScheduledExecutorService carsExiting) {
        for (int i = 0; i < 20; i++) {
            carsExiting.schedule(() -> {
                for (int j = 0; j < 2; j++) {
                    exitQueue(outboundCars[0].poll());
                    exitQueue(outboundCars[1].poll());
                    exitQueue(outboundCars[2].poll());
                }
            }, i * 2, TimeUnit.MILLISECONDS);
        }
    }
}
