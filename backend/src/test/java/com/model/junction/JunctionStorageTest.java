package com.model.junction;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import java.util.Set;

public class JunctionStorageTest {
  private JunctionStorage store;

  @BeforeEach
  public void testInit() {
    store = new JunctionStorage();
    store.storeJunction("Junction 1", new Junction());
    store.storeJunction("Junction 2", new Junction());
    store.storeJunction("Junction 3", new Junction());
  }
  
  @Test
  @DisplayName("Reject junctions with duplicate names.")
  public void rejectJunctionsWithDuplicateNames() {
    boolean didStore = store.storeJunction("Junction 1", new Junction());

    Assertions.assertEquals(false, didStore, "The Junction storage should reject the request.");
  }
  
  @Test
  @DisplayName("Give a junction a new name and remove its old one.")
  public void replaceJunctionName() {
    store.renameJunction("Junction 1", "Junction 4");
    Set<String> names = store.getJunctionNames();

    Assertions.assertEquals(names.contains("Junction 1"), false, "\"Junction 1\" should not be in the database.");
    Assertions.assertEquals(names.contains("Junction 4"), true, "\"Junction 4\" should be in the database.");
  }
}
