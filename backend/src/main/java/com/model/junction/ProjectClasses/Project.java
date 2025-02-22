package com.model.junction.ProjectClasses;

import java.util.HashMap;

import com.model.junction.Attributes.Direction;
import com.model.junction.JunctionClasses.JunctionStorage;

public class Project implements Comparable<Project> {
  private HashMap<Direction, HashMap<Direction, Integer>> vehiclePerHourData;
  private JunctionStorage junctions; 
  private String projectTitle;

  // Constructors
  public Project(String title) {
    this.vehiclePerHourData = new HashMap<Direction, HashMap<Direction, Integer>>();
    this.junctions = new JunctionStorage();
    setName(title);
  }
  
  // Accessors and Mutators
  public String getProjectTitle() {
    return this.projectTitle;
  }

  public void setName(String newTitle) {
    this.projectTitle = newTitle;
  }

  // Data Pipeline Methods
  private HashMap<Direction, HashMap<Direction, Integer>> vehicleJSONToHashMap(String dataJSON) {
    return new HashMap<>();
  }

  // Comparators
  public int compareTo(Project other) {
    return 0;
  }
}
