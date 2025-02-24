package com.model.junction.ProjectClasses;

import com.model.junction.Attributes.Direction;
import com.model.junction.JunctionClasses.Junction;

import java.util.ArrayList;
import java.util.HashMap;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

public class ProjectTest {
  private Project testProject;
  
  private HashMap<Direction, HashMap<Direction, Integer>> createControlVPHData() {
    HashMap<Direction, HashMap<Direction, Integer>> controlVPHData = new HashMap<Direction, HashMap<Direction, Integer>>();
    HashMap<Direction, Integer> northBoundTraffic = new HashMap<Direction, Integer>();
    HashMap<Direction, Integer> eastBoundTraffic = new HashMap<Direction, Integer>();
    HashMap<Direction, Integer> southBoundTraffic = new HashMap<Direction, Integer>();
    HashMap<Direction, Integer> westBoundTraffic = new HashMap<Direction, Integer>();
    
    // Northbound traffic
    northBoundTraffic.put(Direction.NORTH, 200);
    northBoundTraffic.put(Direction.EAST, 50);
    northBoundTraffic.put(Direction.WEST, 50);

    // Eastbound traffic
    eastBoundTraffic.put(Direction.EAST, 50);
    eastBoundTraffic.put(Direction.NORTH, 50);
    eastBoundTraffic.put(Direction.SOUTH, 50);

    // Southbound traffic
    southBoundTraffic.put(Direction.SOUTH, 150);
    southBoundTraffic.put(Direction.EAST, 50);
    southBoundTraffic.put(Direction.WEST, 50);
    
    // Westbound traffic
    westBoundTraffic.put(Direction.WEST, 50);
    westBoundTraffic.put(Direction.NORTH, 25);
    westBoundTraffic.put(Direction.SOUTH, 25);
    
    // Control Hashmap
    controlVPHData.put(Direction.NORTH, northBoundTraffic);
    controlVPHData.put(Direction.EAST, eastBoundTraffic);
    controlVPHData.put(Direction.SOUTH, southBoundTraffic);
    controlVPHData.put(Direction.WEST, westBoundTraffic);
    
    return controlVPHData;
  }

  @BeforeEach
  public void testInit() {
    testProject = new Project("Test Project");
  }

  @Test
  @DisplayName("A fresh project can have its VPH data initialised.")
  public void initialiseProjectVPH() {
    System.out.println("------------------------------------------------------------------");
    System.out.println("Initialise a fresh project's VPH data.\n");

    System.out.println("Starting VPH data: " + testProject.getVehichlePerHourData());
    boolean addProjectVPH = testProject.setVehiclePerHourData(createControlVPHData());
    
    System.out.println("New VPH data: " + testProject.getVehichlePerHourData().toString());
    
    Assertions.assertEquals(addProjectVPH, true, "The project should add the data");
    Assertions.assertNotNull(testProject.getVehichlePerHourData());
  }

  @Test
  @DisplayName("A project with initialised VPH data cannot change.")
  public void updateImmutableProjectVPH() {
    System.out.println("------------------------------------------------------------------");
    System.out.println("Attempt to change an already intialised project.\n");

    testProject.setVehiclePerHourData(createControlVPHData());
    HashMap<Direction, HashMap<Direction, Integer>> currentHashMap = testProject.getVehichlePerHourData();
    
    HashMap<Direction, Integer> northEntry = currentHashMap.get(Direction.NORTH);
    for (Direction d : northEntry.keySet()) {
      northEntry.put(d, northEntry.get(d) * 2);
    }

    HashMap<Direction, HashMap<Direction, Integer>> newHashMap = createControlVPHData();
    newHashMap.put(Direction.NORTH, northEntry);
    boolean hasUpdatedVPH = testProject.setVehiclePerHourData(newHashMap);
    
    System.out.println("Old VPH Data: " + currentHashMap.toString());
    System.out.println("New VPH Data: " + testProject.getVehichlePerHourData().toString());
    
    Assertions.assertEquals(hasUpdatedVPH, false, "The hashmap should not update");
    Assertions.assertEquals(
      testProject.getVehichlePerHourData().toString(),
      currentHashMap.toString(),
      "The hashmap contents must be equal."
    );
  }
  
  @Test
  @DisplayName("Return true for projects with the same VPH data")
  public void compareEqualProjectVPH() {
    System.out.println("------------------------------------------------------------------");
    System.out.println("Compare projects of the same VPH.\n");

    Project otherProject = new Project("Other Project");
    testProject.setVehiclePerHourData(createControlVPHData());
    otherProject.setVehiclePerHourData(createControlVPHData());
    boolean isEqualData = testProject.equalVPHData(otherProject);
    
    System.out.println("Test Project Data: " + testProject.getVehichlePerHourData().toString());
    System.out.println("Other Project Data: " + otherProject.getVehichlePerHourData().toString());
    
    Assertions.assertEquals(isEqualData, true, "Both projects have the same data");
  }

  @Test
  @DisplayName("Return false for projects with different VPH data")
  public void compareDifferentProjectVPH() {
    System.out.println("------------------------------------------------------------------");
    System.out.println("Compare projects with different VPH data\n");
    
    HashMap<Direction, HashMap<Direction, Integer>> differentHashMap = createControlVPHData();
    HashMap<Direction, Integer> northEntry = differentHashMap.get(Direction.NORTH);
    for (Direction d : northEntry.keySet()) {
      northEntry.put(d, northEntry.get(d) * 2);
    }
    differentHashMap.put(Direction.NORTH, northEntry);

    Project otherProject = new Project("Other Project");
    testProject.setVehiclePerHourData(createControlVPHData());
    otherProject.setVehiclePerHourData(differentHashMap);
    boolean isEqualData = testProject.equalVPHData(otherProject);
    
    System.out.println("Test Project Data: " + testProject.getVehichlePerHourData().toString());
    System.out.println("Other Project Data: " + otherProject.getVehichlePerHourData().toString());
    
    Assertions.assertEquals(isEqualData, false, "The projects have different data");
  }
  
  @Test
  @DisplayName("Return the correct sums for each the outbound VPH of each direction.")
  public void returnVPHSums() {
    System.out.println("------------------------------------------------------------------");
    System.out.println("Return the sums of the outbound VPHs for each cardinal direction\n");

    HashMap<Direction, Integer> correctSums = new HashMap<Direction, Integer>();
    correctSums.put(Direction.NORTH, 300);
    correctSums.put(Direction.EAST, 150);
    correctSums.put(Direction.SOUTH, 250);
    correctSums.put(Direction.WEST, 100);
    
    System.out.println("Expected Result: " + correctSums.toString());
    
    testProject.setVehiclePerHourData(createControlVPHData());
    HashMap<Direction, Integer> testSums = testProject.getTotalOutboundVPHData();
    System.out.println("Actual Result: " + testSums.toString());
    
    Assertions.assertEquals(correctSums, testSums, "The hashmaps should have the same contents.");
  }
  
  @Test
  @DisplayName("Return a sorted list of junctions in the project.")
  public void returnSortedListOfJunctions() {
    System.out.println("------------------------------------------------------------------");
    System.out.println("Return a list of junctions sorted by score\n");

    Junction junction1 = new Junction("J1", 10.0);
    Junction junction2 = new Junction("J2", 73.0);
    Junction junction3 = new Junction("J3", 48.0);
    
    ArrayList<Junction> expectedList = new ArrayList<Junction>();
    expectedList.add(junction1);
    expectedList.add(junction3);
    expectedList.add(junction2);
    
    System.out.println("Expected Result: " + expectedList.toString());

    testProject.addJunction(junction1);
    testProject.addJunction(junction2);
    testProject.addJunction(junction3);
    ArrayList<Junction> sortedList = testProject.getScoreSortedJunctions();
    System.out.println("Actual Result: " + sortedList.toString());
    
    Assertions.assertEquals(expectedList, sortedList, "The junctions should be sorted.");
  }
}
