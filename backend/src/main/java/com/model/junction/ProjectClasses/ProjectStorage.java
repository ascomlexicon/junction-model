package com.model.junction.ProjectClasses;

import java.util.HashMap;
import java.util.HashSet;

import com.model.junction.Attributes.Direction;

import org.springframework.stereotype.Repository;

@Repository
public class ProjectStorage {
  private HashMap<String, Project> projects;
  
  // Constructors
  public ProjectStorage() {
    this.projects = new HashMap<String, Project>();
  }
  
  // Accessors and Mutators
  public HashMap<String, Project> getAllProjects() {
    return projects;
  }
  
  public Project getProject(String title) {
    return projects.get(title);
  }

  // Getter for project usingn VPH data
  public Project getProjectByVPH(HashMap<Direction, HashMap<Direction, Integer>> vphData) {
    for (Project project : projects.values()) {
      if (project.getVehiclePerHourData().equals(vphData)) {
        return project;
      }
    }
    return null; // Return null if no project matches the VPH data
  }
  
  // Project Operations
  public Project createNewProject(HashMap<Direction, HashMap<Direction, Integer>> vphData) {
    Project projectToCreate = new Project("Project " + (projects.size() + 1));
    projectToCreate.setVehiclePerHourData(vphData);

    HashSet<Project> projectSet = new HashSet<Project>(projects.values());
    for (Project project : projectSet) {
      if (project.equalVPHData(projectToCreate)) {
        return project;
      }
    }
    
    // Put the project into storage, return the project that was put in storage
    projects.put(projectToCreate.getProjectTitle(), projectToCreate);
    System.out.println("Projects in storage: " + projects.size());
    return projectToCreate;
  }

  public boolean renameProject(String oldName, String newName) {
    if (!projects.containsKey(oldName) || projects.containsKey(newName)) {
      return false;
    }
    
    Project renameProject = projects.remove(oldName); 
    renameProject.setProjectTitle(newName);
    projects.put(newName, renameProject);
    
    return true;
  }
}
