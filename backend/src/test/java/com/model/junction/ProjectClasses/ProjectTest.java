package com.model.junction.ProjectClasses;

import com.model.junction.Attributes.Direction;

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
    System.out.println("TEST 1\n");
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
    System.out.println("TEST 2\n");
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
}
