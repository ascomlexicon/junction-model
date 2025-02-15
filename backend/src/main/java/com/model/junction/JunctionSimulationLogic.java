import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.Queue;
import java.util.LinkedList;

// Thoughts
// Each quarter has its own greenElapsed variable which shows how long the green light for a certain junction has been active
// this number could have some sort of hard limit, like say 1 minute in real life.
// in this duration, keep subtracting from the queues.

// would we have some sort of priority? Like if there is one junction quarter that would be next in turn however there is another quarter suffering
// quite a bit maybe it would be best to turn that one green instead and then the one with loewr priority would be lower, so maybe we could give
// each quarter some sort of urgency weighting.



// For now this simulation logic will cover a single junction quarter with 5 lanes. Extending it should be easy enough by just doing 4 quarters instead of 1
public class JunctionSimulationLogic {
    public static void main(String[] args) {
        int northboundVph = 450;
        int exitingNorth = 250;
        int exitingEast = 150;
        int exitingWest = 50;

        // This is the simulation time in hours currently, an hour in the simulation will translate to 15 seconds in real time
        int simulationTime = 2;

        // counts the number of cars that have left a junction quarter
        int quaterCarsExited = 0;

        // the average wait time for a junction quarter
        // we will modify this by doing: (quaterCarsExited * averagewaitTime + (new car's wait time)) / ++quaterCarsExited
        long averageWaitTime = 0;
        
        //queue.add(new Car());

        Queue<Car>[] outboundCars = new LinkedList[3];

        for (int i = 0; i < outboundCars.length; i++) {
            outboundCars[i] = new LinkedList<>();
        }

        // Create a scheduled executor service with a single thread
        ScheduledExecutorService carsEntering = Executors.newScheduledThreadPool(1);
        ScheduledExecutorService carsExiting = Executors.newScheduledThreadPool(1);
        ScheduledExecutorService greenLight = Executors.newScheduledThreadPool(1);


        // This causes the cars to enter
        // scheduling this to run every 1/4 of a second
        carsEntering.scheduleAtFixedRate(() -> {
            // could potentially modify this so that some of the cars exiting north go into this leftmost lane
            for (int i = 0; i < exitingEast / 60; i ++){
                outboundCars[0].add(new Car());
            }

            for (int i = 0; i < exitingNorth / 60; i ++){
                outboundCars[1].add(new Car());
            }

            for (int i = 0; i < exitingWest / 60; i ++){
                outboundCars[2].add(new Car());
            }
        }, 0, 250, TimeUnit.MILLISECONDS);

        // Optionally, schedule a shutdown after some time
        carsEntering.schedule(() -> {
            System.out.println("shutting down");
            carsEntering.shutdown();
        }, 15, TimeUnit.SECONDS);  // shuts down after 15 seconds - we can change this to however long the user wants the simulation to run

        boolean greenLightOn = false;

        // TODO: Find a way to get cars to leave every x amount of time
        carsExiting.scheduleAtFixedRate(() -> {
            // could potentially modify this so that some of the cars exiting north go into this leftmost lane
            for (int i = 0; i < 5; i ++){
                try{
                outboundCars[0].remove();
                outboundCars[1].remove();
                outboundCars[2].remove();
                } catch (Exception e){
                    System.out.println("No values in queue");
                }
            }
        }, 0, 25, TimeUnit.MILLISECONDS);

        greenLight.scheduleAtFixedRate(() -> {
            // could potentially modify this so that some of the cars exiting north go into this leftmost lane
            //greenLightOn = true;
        }, 0, 500, TimeUnit.MILLISECONDS);

        carsExiting.schedule(() -> {
            System.out.println("carsExiting shutting down");
            carsEntering.shutdown();
        }, 75, TimeUnit.MILLISECONDS);

        
        greenLight.schedule(() -> {
            System.out.println("greenLight shutting down");
            carsEntering.shutdown();
        }, 15, TimeUnit.MILLISECONDS);
    }
}

// for now we can use this Car class
// a potential modification later down the line could be to actually just have the start times added to the queue and hten when we pop those values out,
// we get the current nanoTime and then subtract it from the enter time and add it to the average wait time directly
class Car{
    long enterTime;
    long exitTime;

    public Car()
    {
        enterTime = System.nanoTime();
    }

    public long ExitQueue()
    {
        exitTime = System.nanoTime();
        return exitTime - enterTime;
    }
}