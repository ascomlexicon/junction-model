package com.model.junction.JunctionClasses;

import java.util.Objects;

public class Junction {
  // Attributes
  private String name;
  private Double score;
  
  // TODO: Are EastJunction etc supposed to implement the abstract class JunctionQuarter?
  private JunctionQuarter East;
  private JunctionQuarter West;
  private JunctionQuarter South;
  private JunctionQuarter North;
  private String JunctionName;
    

  // Constructors
  public Junction(String junctionName) {
    this.name = junctionName;
  }
  
  public Junction(String junctionName, Double junctionScore) {
    this.name = junctionName;
    this.score = junctionScore;
  }
  
  // Accessors and Mutators
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  } 
  
  public Double getScore() {
    return this.score;
  }

  public void setScore(Double newScore) throws IllegalArgumentException {
    if (this.score < 0 || this.score > 100) {
      throw new IllegalArgumentException("The score must be between 0 and 100 inclusive.");
    }

    this.score = newScore;
  }

  // Conversions
  @Override
  public String toString() {
    return "[Junction(name="+ this.name + ", score=" + this.score + ")]";
  }
  
  // Comparison Methods
  @Override
  public boolean equals(Object other){
    if (other == this) {
      return true;
    }
    if (other == null) {
      return false;
    }
    if (getClass() != other.getClass()) {
      return false;
    }
    
    Junction junction = (Junction) other;

    return Objects.equals(getName(), junction.getName());
  }
}
