package com.model.junction;

import java.util.Set;
import java.util.HashMap;

public class JunctionStorage {
  private HashMap<String, Junction> nameJunctionHashMap;
  
  public JunctionStorage() {
    this.nameJunctionHashMap = new HashMap<String, Junction>();
  }

  // Storage Updates
  public boolean storeJunction(String name, Junction junction) {
    if (this.nameJunctionHashMap.get(name) != null) {
      return false;
    }
    this.nameJunctionHashMap.put(name, junction);
    return true;
  }

  public void renameJunction(String oldName, String newName) {
    Junction currentJunction = this.nameJunctionHashMap.get(oldName);
    if (currentJunction == null) {
      return ;
    }
    
    this.storeJunction(newName, currentJunction);
    this.nameJunctionHashMap.remove(oldName);
  }
  
  // Storage Retrieval
  public Junction getJunctionData(String name) {
    return this.nameJunctionHashMap.get(name);
  }

  public Set<String> getJunctionNames() {
    return this.nameJunctionHashMap.keySet();
  } 

  // Storage Information
  public boolean isEmpty() {
    return this.nameJunctionHashMap.isEmpty();
  }
}
