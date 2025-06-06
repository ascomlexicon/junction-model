package com.model.junction.Application;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins = "http://localhost:3000")
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
  @PostMapping("/junctions")
  public ResponseEntity<?> getProjectJunctions(@RequestBody String body) {
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      JsonNode jsonNode = objectMapper.readTree(body);

      HashMap<Direction, HashMap<Direction, Integer>> vehiclePerHourData = createVPHDataFromJSON(jsonNode);
      Project currentProject = projectStorage.getProjectByVPH(vehiclePerHourData);
      
      if (currentProject == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The following VPH data does not exist:\n" + vehiclePerHourData);
      }

      // Create a list to hold the junction data as JSON objects
      java.util.List<HashMap<String, Object>> junctionList = new java.util.ArrayList<>();

      // Process each junction in the sorted list
      for (Junction junction : currentProject.getScoreSortedJunctions()) {
        HashMap<String, Object> junctionData = new HashMap<>();
        
        // Add basic junction info
        junctionData.put("name", junction.getName());
        junctionData.put("score", junction.getOverallScore());
        junctionData.put("junctionImage", junction.getJunctionImage());
        
        // Left turn, enter and exit lanes
        HashMap<String, Boolean> leftTurnLaneMap = new HashMap<>();
        leftTurnLaneMap.put("north", junction.getQuarter(Direction.SOUTH).hasLeftTurnLane());
        leftTurnLaneMap.put("south", junction.getQuarter(Direction.NORTH).hasLeftTurnLane());
        leftTurnLaneMap.put("east", junction.getQuarter(Direction.WEST).hasLeftTurnLane());
        leftTurnLaneMap.put("west", junction.getQuarter(Direction.EAST).hasLeftTurnLane());
        junctionData.put("leftTurnLanes", leftTurnLaneMap);

        HashMap<String, String> laneEnteringMap = new HashMap<>();
        laneEnteringMap.put("north", String.valueOf(junction.getQuarter(Direction.SOUTH).lanesEntering()));
        laneEnteringMap.put("south", String.valueOf(junction.getQuarter(Direction.NORTH).lanesEntering()));
        laneEnteringMap.put("east", String.valueOf(junction.getQuarter(Direction.WEST).lanesEntering()));
        laneEnteringMap.put("west", String.valueOf(junction.getQuarter(Direction.EAST).lanesEntering()));
        junctionData.put("lanesEntering", laneEnteringMap);

        HashMap<String, String> laneExitingMap = new HashMap<>();
        laneExitingMap.put("north", String.valueOf(junction.getQuarter(Direction.NORTH).lanesExiting()));
        laneExitingMap.put("south", String.valueOf(junction.getQuarter(Direction.SOUTH).lanesExiting()));
        laneExitingMap.put("east", String.valueOf(junction.getQuarter(Direction.EAST).lanesExiting()));
        laneExitingMap.put("west", String.valueOf(junction.getQuarter(Direction.WEST).lanesExiting()));
        junctionData.put("lanesExiting", laneExitingMap);

        // Pedestrian crossing information
        junctionData.put("isCrossings", junction.getQuarter(Direction.NORTH).hasCrossings());
        junctionData.put("crossingDuration", junction.getQuarter(Direction.NORTH).hasCrossings() ? junction.getQuarter(Direction.NORTH).crossingDuration() : 0);
        junctionData.put("crossingRequestsPerHour", junction.getQuarter(Direction.NORTH).hasCrossings() ? junction.getQuarter(Direction.NORTH).crossingRequestsPerHour() : 0);
        
        // Direction prioritisation information
        String[] directions = new String[4];

        // If the junction has prioritisation enabled, then we need to get the order of directions
        if (junction.getQuarter(Direction.NORTH).hasPriorities()) {
          Direction[] directionOrder = junction.getQuarter(Direction.NORTH).directionOrder();
          directions = new String[directionOrder.length];
          for (int i = 0; i < directionOrder.length; i++) {
            directions[i] = directionOrder[i].toString().toLowerCase();
          }
        }

        junctionData.put("directionPrioritisation", directions);
        junctionData.put("enablePrioritisation", junction.getQuarter(Direction.NORTH).hasPriorities());

        HashMap<String, Boolean> specialLanes = new HashMap<>();

        // Special lane info
        // Only one type of bus/cycle lane can be present at a junction
        if (junction.getQuarter(Direction.NORTH).hasBusCycleLane() != "none" 
          || junction.getQuarter(Direction.EAST).hasBusCycleLane() != "none"
          || junction.getQuarter(Direction.SOUTH).hasBusCycleLane() != "none"
          || junction.getQuarter(Direction.WEST).hasBusCycleLane() != "none") {
          for (Direction d : Direction.values()) {
            if (junction.getQuarter(d).hasBusCycleLane() != "none") {
              junctionData.put("isBusCycle", junction.getQuarter(d).hasBusCycleLane());
              break;
            }
          }

          // Add whether or not a quarter includes a bus/cycle lanes
          specialLanes.put("north", junction.getQuarter(Direction.SOUTH).hasBusCycleLane() != "none");
          specialLanes.put("east", junction.getQuarter(Direction.WEST).hasBusCycleLane() != "none");
          specialLanes.put("south", junction.getQuarter(Direction.NORTH).hasBusCycleLane() != "none");
          specialLanes.put("west", junction.getQuarter(Direction.EAST).hasBusCycleLane() != "none");

          junctionData.put("specialLanes", specialLanes);
        } else {
          junctionData.put("isBusOrCycle", "none");
        }

        // Special VPH figures
        HashMap<String, Integer> busCycleLaneDuration = new HashMap<>();

        for (Direction direction : Direction.values()) {
          if (junction.getQuarter(direction).hasBusCycleLane() != "none") {
            busCycleLaneDuration.put(direction.getOpposite().toString(), junction.getQuarter(direction).specialVPH());
            break;
          }
        }

        junctionData.put("busCycleLaneDuration", busCycleLaneDuration);

        // Hashmap for each quarter (compromise in performance for readability; this 
        // method just retrieve data, no calculations done, so still quick)
        HashMap<String, Double> northQuarterMetrics = new HashMap<>();
        northQuarterMetrics.put("avgWaitTime", junction.getQuarter(Direction.SOUTH).simulationResults()[0]);
        northQuarterMetrics.put("maxQueueLength", junction.getQuarter(Direction.SOUTH).simulationResults()[1]);
        northQuarterMetrics.put("maxWaitTime", junction.getQuarter(Direction.SOUTH).simulationResults()[2]);
        junctionData.put("northMetrics", northQuarterMetrics);

        HashMap<String, Double> southQuarterMetrics = new HashMap<>();
        southQuarterMetrics.put("avgWaitTime", junction.getQuarter(Direction.NORTH).simulationResults()[0]);
        southQuarterMetrics.put("maxQueueLength", junction.getQuarter(Direction.NORTH).simulationResults()[1]);
        southQuarterMetrics.put("maxWaitTime", junction.getQuarter(Direction.NORTH).simulationResults()[2]);
        junctionData.put("southMetrics", southQuarterMetrics);

        HashMap<String, Double> eastQuarterMetrics = new HashMap<>();
        eastQuarterMetrics.put("avgWaitTime", junction.getQuarter(Direction.WEST).simulationResults()[0]);
        eastQuarterMetrics.put("maxQueueLength", junction.getQuarter(Direction.WEST).simulationResults()[1]);
        eastQuarterMetrics.put("maxWaitTime", junction.getQuarter(Direction.WEST).simulationResults()[2]);
        junctionData.put("eastMetrics", eastQuarterMetrics);

        HashMap<String, Double> westQuarterMetrics = new HashMap<>();
        westQuarterMetrics.put("avgWaitTime", junction.getQuarter(Direction.EAST).simulationResults()[0]);
        westQuarterMetrics.put("maxQueueLength", junction.getQuarter(Direction.EAST).simulationResults()[1]);
        westQuarterMetrics.put("maxWaitTime", junction.getQuarter(Direction.EAST).simulationResults()[2]);
        junctionData.put("westMetrics", westQuarterMetrics);

        junctionList.add(junctionData);
      }

      return ResponseEntity.ok(junctionList);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to parse JSON: " + e.getMessage());
    }
  }

  @PostMapping("/name")
  public ResponseEntity<?> getProjectNameFromVPH(@RequestBody String body) {
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      JsonNode jsonNode = objectMapper.readTree(body);
      
      HashMap<Direction, HashMap<Direction, Integer>> vehiclePerHourData = createVPHDataFromJSON(jsonNode);
      Project currentProject = projectStorage.getProjectByVPH(vehiclePerHourData);

      if (currentProject == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The following VPH data does not exist:\n" + vehiclePerHourData);
      }
      
      return ResponseEntity.ok(currentProject.getProjectTitle());
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to parse JSON: " + e.getMessage());
    }
  }
  
  @GetMapping("/projects")
  public ResponseEntity<?> getAllProjects() {
    java.util.List<HashMap<String, Object>> projectList = new java.util.ArrayList<>();

    for (Map.Entry<String, Project> entry : projectStorage.getAllProjects().entrySet()) {
      HashMap<String, Object> project = new HashMap<>();
      
      Project projectData = entry.getValue();

      // Add name of project to JSON object
      String projectName = projectData.getProjectTitle();
      project.put("name", projectName);

      HashMap<Direction, HashMap<Direction, Integer>> weirdVPHData = projectData.getVehiclePerHourData();
      HashMap<Direction, Integer> outboundData = projectData.getTotalOutboundVPHData();

      for (Direction direction : Direction.values()) {
        HashMap<String, Object> vphData = new HashMap<>();
        HashMap<Direction, Integer> directionData = weirdVPHData.get(direction.getOpposite());
        
        vphData.put("enter", outboundData.get(direction.getOpposite()));
        vphData.put("exitNorth", directionData.get(Direction.NORTH));
        vphData.put("exitEast", directionData.get(Direction.EAST));
        vphData.put("exitSouth", directionData.get(Direction.SOUTH));
        vphData.put("exitWest", directionData.get(Direction.WEST));

        project.put("vph" + StringUtils.capitalize(direction.toString().toLowerCase()), vphData);
      }

      projectList.add(project);
    }

    // System.out.println(projectStorage.getAllProjects().size());
    return ResponseEntity.ok(projectList);
  }

  // Post Mappings
  @PostMapping("/model")
  public ResponseEntity<?> runSimulation(@RequestBody String body) {
    try {
      System.out.println("Starting simulation...");
      ObjectMapper objectMapper = new ObjectMapper();
      JsonNode jsonNode = objectMapper.readTree(body);
      
      // Retrieving/creating a project
      HashMap<Direction, HashMap<Direction, Integer>> vehiclePerHourData = createVPHDataFromJSON(jsonNode);
      System.out.println("Created VPH data: " + vehiclePerHourData);
      
      Project currentProject = null;
      Junction junction = null;
      // Creating A Junction
      if (projectStorage.getProjectByVPH(vehiclePerHourData) == null) {
        System.out.println("Creating new project as no existing project found");
        
        currentProject = projectStorage.createNewProject(vehiclePerHourData);
        System.out.println(currentProject);
        junction = new Junction("Junction 1", jsonNode.get("junctionImage").asText());
      } else {
        currentProject = projectStorage.getProjectByVPH(vehiclePerHourData);
        System.out.println("Found existing project: " + currentProject.getProjectTitle());
        junction = new Junction(
          "Junction " + (currentProject.getScoreSortedJunctions().size() + 1), 
          jsonNode.get("junctionImage").asText()
        );
      }
      
      System.out.println("Created new junction: " + junction.getName());
      
      boolean hasPriorities = jsonNode.get("enablePrioritisation").asBoolean();
      Direction[] directionPriorityOrder = new Direction[4];

      if (!hasPriorities) {
        // Arbitrary order of directions as priorities is disables anyway
        directionPriorityOrder[0] = Direction.NORTH;
        directionPriorityOrder[1] = Direction.EAST;
        directionPriorityOrder[2] = Direction.SOUTH;
        directionPriorityOrder[3] = Direction.WEST;
      } else {
        for (int i = 0; i < 4; i++) {
          directionPriorityOrder[i] = Direction.valueOf(jsonNode.get("directionPrioritisation").get(i).asText().toUpperCase());
        }
      }
      
      int counter = 0;
      JunctionScoring scoring = new JunctionScoring();

      for (Direction direction : Direction.values()) {
        Direction enteringDirection = direction.getOpposite();

        // Alternatively, could we not just get what's been parsed from the JSON? We have 'enter' as an attribute, so this could suffice
        // Integer outboundVPH = currentProject.getTotalOutboundVPHData().get(direction);
        Integer outboundVPH;

        if (direction == Direction.NORTH) {
          outboundVPH = jsonNode.get("vphSouth").get("enter").asInt();
        } else if (direction == Direction.EAST) {
          outboundVPH = jsonNode.get("vphWest").get("enter").asInt();
        } else if (direction == Direction.SOUTH) {
          outboundVPH = jsonNode.get("vphNorth").get("enter").asInt();
        } else {
          outboundVPH = jsonNode.get("vphEast").get("enter").asInt();
        }

        boolean hasLeftTurnLane = jsonNode.get("leftTurnLanes").get(enteringDirection.toString().toLowerCase()).asBoolean();
        int lanesEntering = jsonNode.get("lanesEntering").get(enteringDirection.toString().toLowerCase()).asInt();
        int lanesExiting = jsonNode.get("lanesExiting").get(enteringDirection.toString().toLowerCase()).asInt();

        // Now this represents whether a quarter has a bus/cycle lane, not the entire junction
        String hasBusOrCycleLane;

        if (jsonNode.get("isBusOrCycle").asText() != "none") {
          // If the quarter has a bus/cycle lane
          if (jsonNode.get("busCycleLaneDuration").get("vphSpecial" + StringUtils.capitalize(enteringDirection.toString().toLowerCase())).asInt() != 0) {
            hasBusOrCycleLane = jsonNode.get("isBusOrCycle").asText();
          } else {
            hasBusOrCycleLane = "none";
          };
        } else {
          // No bus/cycle lane anywhere in the junction
          hasBusOrCycleLane = "none";
        }

        int specialVPH = hasBusOrCycleLane != "none" ? jsonNode.get("busCycleLaneDuration").get("vphSpecial" + StringUtils.capitalize(enteringDirection.toString().toLowerCase())).asInt() : 0;
        boolean hasCrossings = jsonNode.get("isCrossings").asBoolean();
        int crossingDuration = hasCrossings ? jsonNode.get("crossingDuration").asInt() : 0;
        int crossingRequestsPerHour = hasCrossings ? jsonNode.get("crossingRequestsPerHour").asInt() : 0;
        
        JunctionSimulationLogic simulateDirection = new JunctionSimulationLogic();

        double[] parameters = simulateDirection.runSimulation(
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
        System.out.println(quarter.hasBusCycleLane());
        
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

        // Move to the next quarter
        counter += 1;

        junction.setQuarter(direction, quarter);
      }
      
      junction.setOverallScore(scoring.junctionScore());

      // System.out.println("Junction score: " + junction.getOverallScore());

      currentProject.addJunction(junction);
      return ResponseEntity.ok(junction);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Failed to parse JSON: " + e.getMessage() + ". Line number = " + e.getStackTrace()[0].getLineNumber());
    }
  }
}

