package com.model.junction.Application;

import java.util.HashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.model.junction.Attributes.Direction;
import com.model.junction.ProjectClasses.Project;
import com.model.junction.ProjectClasses.ProjectStorage;

@RestController
@RequestMapping("/api")
public class JunctionController {
  private final ProjectStorage projectStorage;
  
  public JunctionController(ProjectStorage projectStore) {
    this.projectStorage = projectStore; 
  }
  
  // Get Mappings

  // Post Mappings
  @PostMapping("/model")
  public ResponseEntity<?> runSimulation(@RequestBody String body) {
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      JsonNode jsonNode = objectMapper.readTree(body);
      
      // Retrieving/creating a project
      String[] vphDirections = {"vphNorth", "vphEast", "vphSouth", "vphWest"}; // Entering directions
      HashMap<Direction, HashMap<Direction, Integer>> vehiclePerHourData = new HashMap<Direction, HashMap<Direction, Integer>>();
      
      for (String vphDirection : vphDirections) {
        Direction key = Direction.valueOf(vphDirection.substring(3).toUpperCase()).getOpposite();
        HashMap<Direction, Integer> exitDirectionsVPH = new HashMap<Direction, Integer>();
        
        for (Direction direction : Direction.values()) {
          if (direction.equals(key.getOpposite())) {
            continue;
          }

          switch (direction) {
            case NORTH:
              exitDirectionsVPH.put(direction, jsonNode.get(vphDirection).get("exitNorth").asInt());
              break;
            case EAST:
              exitDirectionsVPH.put(direction, jsonNode.get(vphDirection).get("exitEast").asInt());
              break;
            case SOUTH:
              exitDirectionsVPH.put(direction, jsonNode.get(vphDirection).get("exitSouth").asInt());
              break;
            default:
              exitDirectionsVPH.put(direction, jsonNode.get(vphDirection).get("exitWest").asInt());
              break;
          }
        }
        vehiclePerHourData.put(key, exitDirectionsVPH);
      }
      Project currentProject = projectStorage.getProjectByVPH(vehiclePerHourData);
      if (currentProject == null) {
        currentProject = projectStorage.createNewProject(vehiclePerHourData);
      }
      
      return ResponseEntity.ok("Processed JSON successfully");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to parse JSON: " + e.getMessage());
    }
  }
}

