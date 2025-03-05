package com.model.junction.ProjectClasses;

import java.util.HashMap;
import java.util.ArrayList;

import com.model.junction.Attributes.Direction;
import com.model.junction.JunctionClasses.Junction;
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
  
  public HashMap<Direction, HashMap<Direction, Integer>> getVehiclePerHourData() {
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
  
  public HashMap<Direction, Integer> getTotalOutboundVPHData() {
    HashMap<Direction, Integer> outboundVPHData = new HashMap<Direction, Integer>();
    
    for (Direction direction : Direction.values()) {
      ArrayList<Integer> exitAmounts = new ArrayList<Integer>(vehiclePerHourData.get(direction).values());
      Integer outboundTotal = exitAmounts.stream().mapToInt(Integer::intValue).sum();
      
      outboundVPHData.put(direction, outboundTotal);
    }
    
    return outboundVPHData;
  }
  
  public ArrayList<Junction> getScoreSortedJunctions() {
    ArrayList<Junction> junctionList = junctions.getAllJunctions();
    junctionList.sort( 
        (Junction junction1, Junction junction2) -> { return junction1.getOverallScore().compareTo(junction2.getOverallScore()); } 
    );
    return junctionList;
  }

  public void addJunction(Junction junction) {
    junctions.storeJunction(junction);
  }
  
  // Conversions
  @Override
  public String toString() {
    return "[ProjectObject(title=" + getProjectTitle() +")]";
  }

  // Comparators
  public boolean equalVPHData(Project other) {
    int equalityCounter = 0;
    HashMap<Direction, HashMap<Direction, Integer>> thisHashMap = getVehiclePerHourData();
    HashMap<Direction, HashMap<Direction, Integer>> otherHashMap = other.getVehiclePerHourData();

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
