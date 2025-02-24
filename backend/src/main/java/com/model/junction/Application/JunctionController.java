package com.model.junction.Application;

import java.util.HashMap;
import java.util.HashSet;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.model.junction.ProjectClasses.Project;
import com.model.junction.ProjectClasses.ProjectStorage;

@RestController
public class JunctionController {
  private final ProjectStorage projectStorage;
  
  public JunctionController(ProjectStorage projectStore) {
    this.projectStorage = projectStore; 
  }

  @GetMapping("api/projects")
  public HashMap<String, Project> getProjects() {
      return this.projectStorage.getAllProjects();
  }
}

