package com.model.junction.Application;

import java.util.HashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.model.junction.Attributes.Direction;
import com.model.junction.ProjectClasses.Project;
import com.model.junction.ProjectClasses.ProjectStorage;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class JunctionController {
  private final ProjectStorage projectStorage;
  
  // Constructors
  public JunctionController(ProjectStorage projectStore) {
    this.projectStorage = projectStore; 
  }

  // Get Mappings
  @GetMapping("api/projects")
  public HashMap<String, Project> getProjects() {
      return this.projectStorage.getAllProjects();
  }
  
  // Post Mappings
  @PostMapping("/run/simulation")
  public ResponseEntity<?> runSimulation(@RequestBody String body) {
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      JsonNode jsonObject = objectMapper.readTree(body);
      
      // VPH Data
      String[] vphDirections = {"vphNorth", "vphEast", "vphSouth", "vphWest"};
      HashMap<Direction, HashMap<Direction, Integer>> vphData = new HashMap<>();
      
      for (String vphString : vphDirections) {
        Direction enterDirection = Direction.valueOf(vphString.substring(3));
        Direction key = enterDirection.getOpposite();

        HashMap<Direction, Integer> exitVPH = new HashMap<>();
        for (Direction direction : Direction.values()) {
          if (direction == enterDirection) {
            continue;
          }
          
          switch (direction) {
            case NORTH:
              exitVPH.put(direction, jsonObject.get(vphString).get("exitNorth").asInt());
              break;

            case SOUTH:
              exitVPH.put(direction, jsonObject.get(vphString).get("exitSouth").asInt());
              break;
            
            case EAST:
              exitVPH.put(direction, jsonObject.get(vphString).get("exitEast").asInt());
              break;
            default:
              exitVPH.put(direction, jsonObject.get(vphString).get("exitWest").asInt());
              break;
          }
        }
        
        vphData.put(key, exitVPH);
      }
      
      // Project Processing
      Project currentProject = projectStorage.getProject(vphData);
      if (currentProject == null) {
        currentProject = projectStorage.createNewProject(vphData);
      }

      return ResponseEntity.ok("Processed JSON");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to process the JSON: " + e.getMessage());
    }
  }
  
}

