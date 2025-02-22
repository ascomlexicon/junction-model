package com.model.junction.ProjectClasses;

import java.util.HashSet;

import org.springframework.stereotype.Repository;

import jakarta.annotation.PostConstruct;

@Repository
public class ProjectStorage {
  private HashSet<Project> projects;
  
  public ProjectStorage() {
    this.projects = new HashSet<Project>();
  }
  
  @PostConstruct
  private void init() {
    this.projects.add(new Project("Project 1"));
  }
  
  // Accessors and Mutators
  public HashSet<Project> getProjects() {
    return projects;
  }
}
