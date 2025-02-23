package com.model.junction.ProjectClasses;

import com.model.junction.Attributes.Direction;

import java.util.HashMap;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class ProjectStorageTest {
  private ProjectStorage store;

  private HashMap<Direction, HashMap<Direction, Integer>> createControlVPHData(int multiplier) {
    HashMap<Direction, HashMap<Direction, Integer>> controlVPHData = new HashMap<Direction, HashMap<Direction, Integer>>();
    HashMap<Direction, Integer> northBoundTraffic = new HashMap<Direction, Integer>();
    HashMap<Direction, Integer> eastBoundTraffic = new HashMap<Direction, Integer>();
    HashMap<Direction, Integer> southBoundTraffic = new HashMap<Direction, Integer>();
    HashMap<Direction, Integer> westBoundTraffic = new HashMap<Direction, Integer>();
    
    // Northbound traffic
    northBoundTraffic.put(Direction.NORTH, 200 * multiplier);
    northBoundTraffic.put(Direction.EAST, 50 * multiplier);
    northBoundTraffic.put(Direction.WEST, 50 * multiplier);

    // Eastbound traffic
    eastBoundTraffic.put(Direction.EAST, 50 * multiplier);
    eastBoundTraffic.put(Direction.NORTH, 50 * multiplier);
    eastBoundTraffic.put(Direction.SOUTH, 50 * multiplier);

    // Southbound traffic
    southBoundTraffic.put(Direction.SOUTH, 150 * multiplier);
    southBoundTraffic.put(Direction.EAST, 50 * multiplier);
    southBoundTraffic.put(Direction.WEST, 50 * multiplier);
    
    // Westbound traffic
    westBoundTraffic.put(Direction.WEST, 50 * multiplier);
    westBoundTraffic.put(Direction.NORTH, 25 * multiplier);
    westBoundTraffic.put(Direction.SOUTH, 25 * multiplier);
    
    // Control Hashmap
    controlVPHData.put(Direction.NORTH, northBoundTraffic);
    controlVPHData.put(Direction.EAST, eastBoundTraffic);
    controlVPHData.put(Direction.SOUTH, southBoundTraffic);
    controlVPHData.put(Direction.WEST, westBoundTraffic);
    
    return controlVPHData;
  }
  
  @BeforeEach
  public void testInit() {
    this.store = new ProjectStorage();

    store.createNewProject(createControlVPHData(1));
    store.createNewProject(createControlVPHData(2));
    store.createNewProject(createControlVPHData(3));
  }
  
  @Test
  @DisplayName("Rename a project successfully.")
  public void renameProjectStandard() {
    System.out.println("------------------------------------------------------------------");
    System.out.println("Renaming a Project (Valid Inputs)\n");
    
    boolean didRename = store.renameProject("Project 1", "Test");
    System.out.println(store.getAllProjects());
    
    Assertions.assertEquals(didRename, true, "The renaming process should occur.");
    Assertions.assertNotNull(store.getProject("Test"));
    Assertions.assertNull(store.getProject("Project 1"));
  }
  
  @Test
  @DisplayName("Rename a project to a duplicate name.")
  public void renameProjectToDuplicate() {
    System.out.println("------------------------------------------------------------------");
    System.out.println("Renaming a Project (Duplicate)\n");
    
    boolean didRename = store.renameProject("Project 1", "Project 2");
    System.out.println(store.getAllProjects());

    Assertions.assertEquals(didRename, false, "Cannot have a duplicate name.");
    Assertions.assertNotNull(store.getProject("Project 1"));
  }
  
  @Test
  @DisplayName("Rename a non-existent project.")
  public void renameNonExistentProject() {
    System.out.println("------------------------------------------------------------------");
    System.out.println("Renaming a non-existent Project \n");
    
    boolean didRename = store.renameProject("Project 4", "Test");
    System.out.println(store.getAllProjects());

    Assertions.assertEquals(didRename, false, "Cannot rename a non-existent project.");
    Assertions.assertNull(store.getProject("Project 4"));
    Assertions.assertNull(store.getProject("Test"));
  }
}
