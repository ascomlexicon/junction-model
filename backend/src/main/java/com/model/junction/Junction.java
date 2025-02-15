package com.model.junction;


public class Junction implements Comparable<Junction> {
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
  
  // Implementations
  public int compareTo(Junction other) {
    return this.name.compareTo(other.getName()); 
  }
}
