package com.model.junction.Application;

import java.util.Arrays;
import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.model.junction.Attributes.Direction;
import com.model.junction.JunctionClasses.Junction;
import com.model.junction.JunctionClasses.JunctionQuarter;
import com.model.junction.JunctionClasses.JunctionScoring;
import com.model.junction.JunctionClasses.JunctionSimulationLogic;
import com.model.junction.ProjectClasses.Project;
import com.model.junction.ProjectClasses.ProjectStorage;

@RestController
@RequestMapping("/api")
public class JunctionController {
  private final ProjectStorage projectStorage;
  
  // Constructor
  public JunctionController(ProjectStorage projectStore) {
    this.projectStorage = projectStore; 
  }
  
  // Helper Functions
  private HashMap<Direction, HashMap<Direction, Integer>> createVPHDataFromJSON(JsonNode node) {
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
            exitDirectionsVPH.put(direction, node.get(vphDirection).get("exitNorth").asInt());
            break;
          case EAST:
            exitDirectionsVPH.put(direction, node.get(vphDirection).get("exitEast").asInt());
            break;
          case SOUTH:
            exitDirectionsVPH.put(direction, node.get(vphDirection).get("exitSouth").asInt());
            break;
          default:
            exitDirectionsVPH.put(direction, node.get(vphDirection).get("exitWest").asInt());
            break;
        }
      }
      vehiclePerHourData.put(key, exitDirectionsVPH);
    }
    
    return vehiclePerHourData;
  }
  
  // Get Mappings
  @GetMapping("/junctions")
  public ResponseEntity<?> getProjectJunctions(@RequestBody String body) {
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      JsonNode jsonNode = objectMapper.readTree(body);

      HashMap<Direction, HashMap<Direction, Integer>> vehiclePerHourData = createVPHDataFromJSON(jsonNode);
      Project currentProject = projectStorage.getProjectByVPH(vehiclePerHourData);
      
      if (currentProject == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The following VPH data does not exist:\n" + vehiclePerHourData);
      }

      return ResponseEntity.ok(currentProject.getScoreSortedJunctions());
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to parse JSON: " + e.getMessage());
    }
  }

  // Post Mappings
  @PostMapping("/model")
  public ResponseEntity<?> runSimulation(@RequestBody String body) {
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      JsonNode jsonNode = objectMapper.readTree(body);
      
      // Retrieving/creating a project
      HashMap<Direction, HashMap<Direction, Integer>> vehiclePerHourData = createVPHDataFromJSON(jsonNode);
      
      Project currentProject = projectStorage.getProjectByVPH(vehiclePerHourData);
      if (currentProject == null) {
        currentProject = projectStorage.createNewProject(vehiclePerHourData);
      }
      
      // Creating A Junction
      Junction junction = new Junction(
        "Junction " + (currentProject.getScoreSortedJunctions().size() + 1), 
        jsonNode.get("junctionImage").asText()
      );
      
      boolean hasPriorities = jsonNode.get("enablePrioritisation").asBoolean();
      Direction[] directionPriorityOrder = new Direction[4];

      for (int i = 0; i < 4; i++) {
        directionPriorityOrder[i] = Direction.valueOf(jsonNode.get("directionPrioritisation").get(i).asText().toUpperCase());
      }
      
      int counter = 0;
      JunctionScoring scoring = new JunctionScoring();

      for (Direction direction : Direction.values()) {
        Direction enteringDirection = direction.getOpposite();
        Integer outboundVPH = currentProject.getTotalOutboundVPHData().get(direction);

        boolean hasLeftTurnLane = jsonNode.get("leftTurnLanes").get(enteringDirection.toString().toLowerCase()).asBoolean();
        int lanesEntering = jsonNode.get("lanesEntering").get(enteringDirection.toString().toLowerCase()).asInt();
        int lanesExiting = jsonNode.get("lanesExiting").get(enteringDirection.toString().toLowerCase()).asInt();
        String hasBusOrCycleLane = jsonNode.get("isBusOrCycle").asText(); 
        int specialVPH = jsonNode.get("busCycleLaneDuration").get("vphSpecial" + StringUtils.capitalize(enteringDirection.toString().toLowerCase())).asInt();
        boolean hasCrossings = jsonNode.get("isCrossings").asBoolean();
        int crossingDuration = jsonNode.get("crossingDuration").asInt();
        int crossingRequestsPerHour = jsonNode.get("crossingRequestsPerHour").asInt();

        double[] parameters = JunctionSimulationLogic.runSimulation(
          currentProject.getVehiclePerHourData().get(direction).get(direction).intValue(),
          currentProject.getVehiclePerHourData().get(direction).get(direction.getRight()).intValue(),
          currentProject.getVehiclePerHourData().get(direction).get(direction.getLeft()).intValue(),
          lanesExiting,
          hasLeftTurnLane,
          (hasBusOrCycleLane == "none"),
          specialVPH,
          hasCrossings,
          crossingDuration,
          crossingRequestsPerHour,
          StringUtils.capitalize(direction.toString().toLowerCase()),
          hasPriorities,
          Arrays.stream(directionPriorityOrder).map(Enum::name).map((String s) -> StringUtils.capitalize(s.toLowerCase())).toArray(String[]::new)
        );

        JunctionQuarter quarter = new JunctionQuarter(direction, hasLeftTurnLane, lanesEntering, lanesExiting, hasBusOrCycleLane, specialVPH, hasPriorities, directionPriorityOrder, hasCrossings, crossingDuration, crossingRequestsPerHour, parameters);
        scoring.quarterScore(
          counter,
          outboundVPH.doubleValue(),
          15, 
          (long) quarter.simulationResults()[0],
          (long) quarter.simulationResults()[2], 
          (long) quarter.simulationResults()[1], 
          0.3,
          0.3,
          0.4
        );

        junction.setQuarter(direction, quarter);
      }
      
      junction.setOverallScore(scoring.junctionScore());

      return ResponseEntity.ok(new SimulationDTO(currentProject, junction));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to parse JSON: " + e.getMessage());
    }
  }
}

