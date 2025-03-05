package com.model.junction.JunctionClasses;

import java.util.Objects;

import com.model.junction.Attributes.Direction;

public class Junction {

  // Attributes
  private String junctionName;
  private String junctionImage;
  private double[] overallScore;
  private JunctionQuarter north;
  private JunctionQuarter east;
  private JunctionQuarter south;
  private JunctionQuarter west;

  // Constructors
  public Junction(String junctionName, String junctionImage) {
    this.junctionName = junctionName;
    this.junctionImage = junctionImage;
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
    return this.junctionName;
  }

  public void setName(String name) {
    this.junctionName = name;
  }

  public String getJunctionImage() {
    return this.junctionImage;
  }

  public void setJunctionImage(String junctionImage) {
    this.junctionImage = junctionImage;
  }

  public double[] getOverallScore() {
    return this.overallScore;
  }

  public void setOverallScore(double[] overallScore) {
    this.overallScore = overallScore;
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
    return Objects.equals(this.junctionName, junction.getName());
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.junctionName);
  }
}
