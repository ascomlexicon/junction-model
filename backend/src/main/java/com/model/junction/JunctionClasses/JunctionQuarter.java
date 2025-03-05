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
  double[] score
) {}
