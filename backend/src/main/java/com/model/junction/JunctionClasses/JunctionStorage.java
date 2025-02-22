package com.model.junction.JunctionClasses;

import java.util.Set;
import java.util.HashMap;

public class JunctionStorage {


  // Attributes
  private HashMap<String, Junction> junctions;

  // Constructor
  public JunctionStorage() {
    this.junctions = new HashMap<String, Junction>();
  }

  // Storage Updates
  public boolean storeJunction(Junction junction) {
    if (junctions.containsKey(junction.getName())) {
      return false;
    }
    
    junctions.put(junction.getName(), junction);
    return true;
  }

  public boolean renameJunction(String oldName, String newName) {
    if (!junctions.containsKey(oldName) || junctions.containsKey(newName)) {
      return false;
    }

    Junction junction = junctions.remove(oldName);
    junction.setName(newName);
    storeJunction(junction);
    
    return true;
  }
  
  // Storage Retrieval
  public Junction getJunctionData(String name) {
    return junctions.get(name);
  }

  public Set<String> getJunctionNames() {
    return junctions.keySet();
  } 

  // Storage Information
  public boolean isEmpty() {
    return junctions.isEmpty();
  }
}
