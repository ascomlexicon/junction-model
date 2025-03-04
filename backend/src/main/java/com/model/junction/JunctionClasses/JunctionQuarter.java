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
  /** Stores the direction of the junction */
  private Direction junctionDirection;

  private int exitingForward;
  private int exitingLeft;
  private int exitingRight;

  /** Stores the priority level of the junction, defaulted to 0 */
  private String[] quarterPriorities = {"South", "West", "North", "East"};

  /** Stores the lanes that are bus lanes */
  // private ArrayList<Integer> busLaneDirection = new ArrayList<>();
  private boolean busCycleLane = false;
  private int busCyclesPerHour = 0;

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
  public String[] getPriorities() {
    return quarterPriorities;
  }

  public void setPriorities(String[] newValue) {
    for (int i = 0; i < newValue.length; i++) {
        this.quarterPriorities[i] = newValue[i];
      }
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
}



