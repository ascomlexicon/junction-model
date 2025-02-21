package com.model.junction.JunctionClasses;

import java.util.Objects;

public class Junction {
  // Attributes
  private String name;

  // Constructors
  public Junction(String junctionName) {
    this.name = junctionName;
  }
  
  // Accessors and Mutators
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
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
