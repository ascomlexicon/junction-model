package com.model.junction.ProjectClasses;

import java.util.HashMap;

import com.model.junction.Direction;
import com.model.junction.JunctionStorage;

public class Project {
  private HashMap<Direction, HashMap<Direction, Integer>> vehiclePerHourData;
  private JunctionStorage junctions; 
  private String name;
}
