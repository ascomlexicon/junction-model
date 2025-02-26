package com.model.junction.Attributes;

public enum Direction {
  NORTH,
  EAST,
  SOUTH,
  WEST;

  public Direction getOpposite() {
    switch (this) {
      case NORTH: return SOUTH;
      case EAST: return WEST;
      case SOUTH: return NORTH;
      default: return EAST;
    }
  }

  public Direction getLeft() {
    switch (this) {
      case NORTH: return WEST;
      case EAST: return NORTH;
      case SOUTH: return EAST;
      default: return SOUTH;
    }
  }

  public Direction getRight() {
    switch (this) {
      case NORTH: return EAST;
      case EAST: return SOUTH;
      case SOUTH: return WEST;
      default: return NORTH;
    }
  }
}
