package com.model.junction.JunctionClasses;

import java.util.Objects;

import com.model.junction.Attributes.Direction;

public class Junction {

  // Attributes
  private String name;
  private Double score;

  // Junction quarters in different directions
  private JunctionQuarter north;
  private JunctionQuarter east;
  private JunctionQuarter south;
  private JunctionQuarter west;

  private String junctionName;

  // Constructors
  public Junction(String junctionName) {
    this.name = junctionName;
  }

  public Junction(String junctionName, Double junctionScore) {
    this.name = junctionName;
    this.score = junctionScore;
  }

  // Accessors and Mutators
  public JunctionQuarter getQuarter(Direction direction) {
    switch (direction) {
      case NORTH:
        return this.north;
      case EAST:
        return this.east;
      case SOUTH:
        return this.south;
      default:
        return this.west;
    }
  }

  public void setQuarter(Direction direction, JunctionQuarter quarter) {
    switch (direction) {
      case NORTH:
        this.north = quarter;
      case EAST:
        this.east = quarter;
      case SOUTH:
        this.south = quarter;
      default:
        this.west = quarter;
    }
  } 
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Double getScore() {
    return score;
  }

  public void setScore(Double newScore) throws IllegalArgumentException {
    if (newScore < 0 || newScore > 100) {
      throw new IllegalArgumentException("The score must be between 0 and 100 inclusive.");
    }
    this.score = newScore;
  }

  // Conversions
  @Override
  public String toString() {
    return "[Junction(name=" + name + ", score=" + score + ")]";
  }

  // Comparison Methods
  @Override
  public boolean equals(Object other) {
    if (this == other) {
      return true;
    }
    if (other == null || getClass() != other.getClass()) {
      return false;
    }

    Junction junction = (Junction) other;
    return Objects.equals(name, junction.name);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name);
  }
}
