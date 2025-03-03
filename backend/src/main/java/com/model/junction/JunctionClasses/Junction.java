package com.model.junction.JunctionClasses;

import java.util.Objects;

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
  public Junction(String junctionName) {
    this.junctionName = junctionName;
  }

  public Junction(String junctionName, Double junctionScore) {
    this.junctionName = junctionName;
    this.score = junctionScore;
  }

  // Accessors and Mutators
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
