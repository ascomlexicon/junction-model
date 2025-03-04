package com.model.junction.JunctionClasses;

import com.model.junction.Attributes.Direction;

public record JunctionQuarter(
  Direction outboundDirection,
  boolean hasLeftTurnLane,
  int enteringLanes,
  int exitingLanes,
  boolean hasBusCycleLane,
  int specialVPH,
  int priority,
  boolean hasCrossings,
  int crossingRequestsPerHour,
  Double score
) {
  public JunctionQuarter(Direction outboundDirection, boolean hasLeftTurnLane, int enteringLanes, int exitingLanes, boolean hasBusCycleLane, int specialVPH, int priority, boolean hasCrossings, int crossingRequestsPerHour) {
    this(outboundDirection, hasLeftTurnLane, enteringLanes, exitingLanes, hasBusCycleLane, specialVPH, priority, hasCrossings, crossingRequestsPerHour, null);
  }
}



