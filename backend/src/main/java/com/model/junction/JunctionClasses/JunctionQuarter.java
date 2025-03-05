package com.model.junction.JunctionClasses;

import com.model.junction.Attributes.Direction;

public record JunctionQuarter(
  Direction outboundDirection,
  boolean hasLeftTurnLane,
  int lanesEntering,
  int lanesExiting,
  String hasBusCycleLane,
  int specialVPH,
  boolean hasPriorities,
  int priorityNumber,
  boolean hasCrossings,
  int crossingDuration,
  int crossingRequestsPerHour,
  Double score
) {
  public JunctionQuarter(
    Direction outboundDirection,
    boolean hasLeftTurnLane,
    int lanesEntering,
    int lanesExiting,
    String hasBusCycleLane,
    int specialVPH,
    boolean hasPriorities,
    int priorityNumber,
    boolean hasCrossings,
    int crossingDuration,
    int crossingRequestsPerHour
  ) {
    this(
      outboundDirection,
      hasLeftTurnLane,
      lanesEntering, 
      lanesExiting,
      hasBusCycleLane,
      specialVPH,
      hasPriorities,
      priorityNumber,
      hasCrossings,
      crossingDuration,
      crossingRequestsPerHour,
      null
    );
  }
}
