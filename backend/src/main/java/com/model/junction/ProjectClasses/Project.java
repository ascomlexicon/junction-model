package com.model.junction.ProjectClasses;

import java.util.HashMap;

import com.model.junction.Attributes.Direction;
import com.model.junction.JunctionClasses.JunctionStorage;

public class Project {
  private HashMap<Direction, HashMap<Direction, Integer>> vehiclePerHourData;
  private JunctionStorage junctions; 
  private String projectTitle;

  // Constructors
  public Project(String title) {
    setProjectTitle(title);
    this.junctions = new JunctionStorage();
  }
  
  // Accessors and Mutators
  public String getProjectTitle() {
    return this.projectTitle;
  }

  public void setProjectTitle(String newTitle) {
    this.projectTitle = newTitle;
  }
  
  public HashMap<Direction, HashMap<Direction, Integer>> getVehichlePerHourData() {
    return this.vehiclePerHourData;
  }

  public boolean setVehiclePerHourData(HashMap<Direction, HashMap<Direction, Integer>> vphData) {
    // Once it is first set, then the VPH cannot be changed.
    if (this.vehiclePerHourData == null) {
      this.vehiclePerHourData = vphData;
      return true;
    }
    
    return false;
  }

  // Comparators
  public boolean equalVPHData(Project other) {
    int equalityCounter = 0;
    HashMap<Direction, HashMap<Direction, Integer>> thisHashMap = getVehichlePerHourData();
    HashMap<Direction, HashMap<Direction, Integer>> otherHashMap = other.getVehichlePerHourData();

    for (Direction direction : Direction.values()) {
      HashMap<Direction, Integer> thisEntry = thisHashMap.get(direction);
      HashMap<Direction, Integer> otherEntry = otherHashMap.get(direction);
      
      if (thisEntry.equals(otherEntry)) {
        equalityCounter++;
      }
    }
    
    return equalityCounter == 4;
  }
  
  @Override
  public boolean equals(Object other) {
    if (other == this) {
      return true;
    }
    if (other == null) {
      return false;
    }
    if (getClass() != other.getClass()) {
      return false;
    }
    
    Project project = (Project) other;

    // Projects are equal if they share the same name or VPH data.
    return equalVPHData(project) || getProjectTitle().equals(project.getProjectTitle());
  }
}
