package com.model.junction.Application;

import java.util.HashMap;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.model.junction.ProjectClasses.Project;
import com.model.junction.ProjectClasses.ProjectStorage;

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
}

