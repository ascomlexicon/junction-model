package com.model.junction.JunctionClasses;

import java.util.ArrayList;
import java.util.Arrays;

import com.model.junction.Attributes.Direction;

/**
 * Contains the classes for junction management.
 *
 * JunctionQuarter is an abstract class representing a junction quarter, which includes
 * traffic lights, directions, exiting lanes, entering lanes, and additional configurable
 * parameters such as priority, bus lanes, cycle lanes, left-turn lanes, and pedestrian crossing.
 */
public class JunctionQuarter {

  /** Traffic light object, defaulted to null */
  //private TrafficLight light;

  /** Stores the direction of the junction */
  private Direction junctionDirection;

  private int exitingForward;
  private int exitingLeft;
  private int exitingRight;

  /** Stores the lanes exiting the junction, defaulted to 1, 2, and 3 */
  //private ArrayList<Integer> exitingLanes = new ArrayList<>(Arrays.asList(1, 2, 3));

  /** Stores the lanes entering the junction, defaulted to 4 and 5 */
  //private ArrayList<Integer> enteringLanes = new ArrayList<>(Arrays.asList(4, 5));

  /**
   * The attributes below are the configurable parameters. They all have default values
   * of either an empty array, 0, or null because the user can choose to leave them empty
   * without affecting the program.
   */

  /** Stores the priority level of the junction, defaulted to 0 */
  private int priorityLevel = 0;

  /** Stores the lanes that are bus lanes */
  // private ArrayList<Integer> busLaneDirection = new ArrayList<>();
  private boolean busCycleLane = false;

  /** Stores the lanes that are cycle lanes */
  // private ArrayList<Integer> cycleLaneDirection = new ArrayList<>();

  /** Stores the lanes that are left turn lanes */
  // private ArrayList<Integer> leftTurnLanes = new ArrayList<>();
  private boolean leftTurnLane = false;

  /** Stores the number of lanes in the junction, defaulted to 5 */
  private int numberOfLanes = 5;

  /** Stores whether the junction contains a pedestrian crossing, defaulted to false */
  private boolean pedestrianCrossing = false;
  private int crossingsPerHour = 0;
  private int crossingDuration = 0;

  public int getCrossingsPerHour() {
    return crossingsPerHour;
  }

  public void setCrossingsPerHour(int crossingsPerHour) {
    if (crossingsPerHour >= 0) { 
      this.crossingsPerHour = crossingsPerHour;
    }
  }

  public int getCrossingDuration() {
    return crossingDuration;
  }

  public void setCrossingDuration(int crossingDuration) {
    if (crossingDuration >= 0) { 
      this.crossingDuration = crossingDuration;
    }
  }

  // Getters and Setters

  /*public TrafficLight getLight() {
    return light;
  }

  public void setLight(TrafficLight light) {
    this.light = light;
  }*/

  public int getOutbound(){
    return exitingForward + exitingLeft + exitingRight;
  }

  public int getExitingForward() {
    return exitingForward;
  }

  public void setExitingForward(int exitingForward) {
    if (exitingForward >= 0) {
      this.exitingForward = exitingForward;
    }
  }

  public int getExitingLeft() {
    return exitingLeft;
  }

  public void setExitingLeft(int exitingLeft) {
    if (exitingLeft >= 0) {
      this.exitingLeft = exitingLeft;
    }
  }

  public int getExitingRight() {
    return exitingRight;
  }

  public void setExitingRight(int exitingRight) {
    if (exitingRight >= 0) {
      this.exitingRight = exitingRight;
    }
  }

  public Direction getJunctionDirection() {
    return junctionDirection;
  }

  public void setJunctionDirection(Direction junctionDirection) {
    this.junctionDirection = junctionDirection;
  }

  /*public ArrayList<Integer> getEnteringLanes() {
    return enteringLanes;
  }

  public void setEnteringLanes(ArrayList<Integer> enteringLanes) {
    this.enteringLanes = enteringLanes;
  }

  public ArrayList<Integer> getExitingLanes() {
    return exitingLanes;
  }

  public void setExitingLanes(ArrayList<Integer> exitingLanes) {
    this.exitingLanes = exitingLanes;
  }*/

  public int getPriorityLevel() {
    return priorityLevel;
  }

  public void setPriorityLevel(int priorityLevel) {
    this.priorityLevel = priorityLevel;
  }

  // MODIFIED
  public boolean getBusCycleLane() {
    return busCycleLane;
  }

  public void setBusCycleLane(boolean newValue) {
    this.busCycleLane = newValue;
  }

  public boolean getLeftTurnLane() {
    return leftTurnLane;
  }

  public void setLeftTurnLanes(boolean newValue) {
    this.leftTurnLane = newValue;
  }
  // END OF MODIFIED

  public int getNumberOfLanes() {
    return numberOfLanes;
  }

  public void setNumberOfLanes(int numberOfLanes) {
    this.numberOfLanes = numberOfLanes;
  }

  public boolean isPedestrianCrossing() {
    return pedestrianCrossing;
  }

  public void setPedestrianCrossing(boolean pedestrianCrossing) {
    this.pedestrianCrossing = pedestrianCrossing;
  }

  /**
   * Dummy function for now. It needs to add lane logic but will check that the outbound
   * and inbound lanes are numbered properly. Lanes are numbered 1 to n where n does not exceed 5.
   *
   * To make storing and verifying junction configurations easier, the JSON object passed from
   * the frontend will ONLY be passed if it is a valid junction.
   */
  public boolean verifyLanes() {
    return true;
  }

  /**
   * According to the requirements, the junction can only have either a bus or a cycle lane.
   * This method checks if this constraint is satisfied. Additionally, it validates that the lanes
   * specified are valid, i.e., they are either in entering or exiting lanes.
   */
  /*public boolean verifyBusAndCycleLanes() {
    if (busLaneDirection.size() == 0 || cycleLaneDirection.size() == 0) {
      return true;
    } else {
      return false;
    }
  }*/
}



