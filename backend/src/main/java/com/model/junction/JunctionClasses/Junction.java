package com.model.junction.JunctionClasses;

import java.util.Objects;

import com.model.junction.Attributes.Direction;

public class Junction {

  // Attributes
  private JunctionQuarter east;
  private JunctionQuarter west;
  private JunctionQuarter south;
  private JunctionQuarter north;

  private Double score;
  private String junctionName;
  private String junctionImage;

  // Constructors
  public Junction(String junctionName, String image) {
    this.junctionName = junctionName;
    this.junctionImage = image;
  }

  public Junction(String junctionName, String image, Double junctionScore) {
    this(junctionName, image);
    this.score = junctionScore;
  }

  // Accessors and Mutators
  public JunctionQuarter getQuarter(Direction direction) {
    switch (direction) {
      case NORTH:
        return this.north;
      case SOUTH:
        return this.south;
      case EAST:
        return this.east;
      default:
        return this.west;
    }
  }
  
  public void setQuarter(Direction direction, JunctionQuarter junctionQuarter) {
    switch (direction) {
      case NORTH:
         this.north = junctionQuarter;
      case SOUTH:
        this.south = junctionQuarter;
      case EAST:
        this.east = junctionQuarter;
      default:
        this.west = junctionQuarter;
    }
  }

  public String getName() {
    return junctionName;
  }

  public void setName(String name) {
    this.junctionName = name;
  }

  public String getJunctionImage() {
    return junctionImage;
  }

  public void setJunctionImage(String junctionImage) {
    this.junctionImage = junctionImage;
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
    return "[Junction(name=" + junctionName + ", score=" + score + ")]";
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
    return Objects.equals(junctionName, junction.getName());
  }

  @Override
  public int hashCode() {
    return Objects.hash(junctionName);
  }
}
