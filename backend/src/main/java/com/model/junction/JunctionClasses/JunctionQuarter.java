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
  Direction[] directionOrder,
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
    Direction[] directionOrder,
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
      directionOrder,
      hasCrossings,
      crossingDuration,
      crossingRequestsPerHour,
      null
    );
  }
}
