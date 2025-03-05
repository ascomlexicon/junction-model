package com.model.junction.Application;

import com.model.junction.JunctionClasses.Junction;
import com.model.junction.ProjectClasses.Project;

public class SimulationDTO {
  private Project project;
  private Junction junction;
  
  public SimulationDTO(Project project, Junction junction) {
    this.project = project;
    this.junction = junction;
  }

  public Project getProject() {
    return project;
  }

  public void setProject(Project project) {
    this.project = project;
  }

  public Junction getJunction() {
    return junction;
  }

  public void setJunction(Junction junction) {
    this.junction = junction;
  }
}
