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
  
  // Project Operations
  public Project createNewProject(HashMap<Direction, HashMap<Direction, Integer>> vphData) {
    Project projectToCreate = new Project("Project " + (projects.size() + 1));
    projectToCreate.setVehiclePerHourData(vphData);

    HashSet<Project> projectSet = new HashSet<>(projects.values());
    
    for (Project project : projectSet) {
      if (project.equalVPHData(projectToCreate)) {
        return project;
      }
    }
    
    return projects.put(projectToCreate.getProjectTitle(), projectToCreate);
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
