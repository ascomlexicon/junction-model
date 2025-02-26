package com.model.junction.JunctionClasses; 
import java.util.ArrayList;
import java.util.Arrays;

import com.model.junction.Direction;

/*Contains the classes*/

/* Junction Quarter is an abstract class */
public class JunctionQuarter{ 
    /*Traffic light object, defaulted to null*/
    private TrafficLight light; 

    /*Stores the direction of the junction*/
    private Direction junctionDirection;
    private int ExitingForward;
    private int ExitingLeft;
    private int ExitingRight;

    /*Stores the lanes exiting the junction, default this to 1,2 and 3*/
    private ArrayList<Integer> exitingLanes = new ArrayList<Integer>(Arrays.asList(1, 2, 3));
    /*Stores the lanes entering the junction, default this to 4 and 5*/
    private ArrayList<Integer> enteringLanes = new ArrayList<Integer>(Arrays.asList(4,5));

    /**
    * The attributes below are the configurable parameters
    *  They all have default values of either an empty array, 0 or null
    *  because the user can choose to leave them empty without affecting the program
    */

    /*Stores the priority level of the junction, defaulted to 0*/
    private int PriorityLevel = 0; 
    /*Stores the lanes that are bus lanes*/
    private ArrayList<Integer> busLaneDirection= new ArrayList<>(); 
    /*Stores the lanes that are cycle lanes*/
    private ArrayList<Integer> cycleLaneDirection = new ArrayList<>(); 
    /*Stores the lanes that are left turn lanes*/
    private ArrayList<Integer> leftTurnLanes = new ArrayList<>(); 
    /*Stores the number of lanes in the junction, defaulted to 5*/
    private int numberOfLanes = 5;  
    /*Stores whether the junction contains a pedestrian crossing, defaulted to false*/
    private boolean pedestrianCrossing = false; 

    //Getters and Setters
    public TrafficLight getLight(){
        return light;
    }

    public void setLight(TrafficLight light){
        this.light = light;
    }   

    public int getExitingForward(){
        return ExitingForward;
    }
    public void setExitingForward(int exitingForward){
        if (exitingForward >= 0){
            this.ExitingForward = exitingForward;
        }
    }
    public int getExitingLeft(){
        return ExitingLeft;
    }
    public void setExitingLeft(int exitingLeft){
        if (exitingLeft >= 0){
            this.ExitingLeft = exitingLeft;
        }
    }
    public int getExitingRight(){
        return ExitingRight;
    }
    public void setExitingRight(int exitingRight){
        if (exitingRight >=0){
            this.ExitingRight = exitingRight;
        }
    }


    public Direction getJunctionDirection(){
        return junctionDirection;
    }
    public void setJunctionDirection(Direction junctionDirection){
        this.junctionDirection = junctionDirection;
    }


    public ArrayList<Integer> getEnteringLanes(){
        return enteringLanes;
    }
    public void setEnteringLanes(ArrayList<Integer> enteringLanes){
        this.enteringLanes = enteringLanes;
    }
    public ArrayList<Integer> getExitingLanes(){
        return exitingLanes;
    }
    public void setExitingLanes(ArrayList<Integer> exitingLanes){
        this.exitingLanes = exitingLanes;
    }
    public int getPriorityLevel(){
        return PriorityLevel;
    }
    public void setPriorityLevel(int priorityLevel){
        PriorityLevel = priorityLevel;
    }

    // TODO: There's a lot of variable type mismatch here. What are the types that you actually want?
    public String getBusLaneDirection(){
        return busLaneDirection;
    }
    public void setBusLaneDirection(String busLaneDirection){
        this.busLaneDirection = busLaneDirection;
    }
    public String getCycleLaneDirection(){
        return cycleLaneDirection;
    }
    public void setCycleLaneDirection(String cycleLaneDirection){
        this.cycleLaneDirection = cycleLaneDirection;
    }


    public ArrayList<Integer> getLeftTurnLanes(){
        return leftTurnLanes;
    }
    public void setLeftTurnLanes(ArrayList<Integer> leftTurnLanes){
        this.leftTurnLanes = leftTurnLanes;
    }
    public int getNumberOfLanes(){
        return numberOfLanes;
    }
    public void setNumberOfLanes(int numberOfLanes){
        this.numberOfLanes = numberOfLanes;
    }
    public boolean isPedestrianCrossing(){
        return pedestrianCrossing;
    }
    public void setPedestrianCrossing(boolean pedestrianCrossing){
        this.pedestrianCrossing = pedestrianCrossing;
    }

    /**
     * Dummy function for now, need to add lane logic
     * But will check that the outbound and inbound lanes are numbered properly
     * Lanes are numbered 1 to n where n does not exceed 5
     */

    // TODO: Both of these methods are private, should they not be public?
    // Also, to make storing and verifying junction configurations easier, 
    // the JSON object passed from the frontend will ONLY be passed if it is a valid
    // junction.
    private boolean verifyLanes(){
        return true;
    }

    /**
     * According to the requirements, the junction can only have either a bus or a cycle lane
     * This method checks if this constraint is satisfied
     * I will need to add that the lanes specified are valid, i.e. they are either in entering or exiting lanes
     */
    private boolean verifyBusAndCycleLanes(){
        if(busLaneDirection.size() == 0 || cycleLaneDirection.size() == 0){
            return true;
        }
        else{
            return false;
        }
    }
}


