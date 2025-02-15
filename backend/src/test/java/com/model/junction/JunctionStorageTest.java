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
    store.storeJunction(new Junction("Junction 1"));
    store.storeJunction(new Junction("Junction 2"));
    store.storeJunction(new Junction("Junction 3"));
  }
  
  @Test
  @DisplayName("Reject junctions with duplicate names.")
  public void rejectDuplicateJunctions() {
    boolean didStore = store.storeJunction(new Junction("Junction 1"));

    Assertions.assertEquals(false, didStore, "The Junction storage should reject the request.");
  }
  
  @Test
  @DisplayName("Ensure that the store is accurate after a Junction name change.")
  public void updateJunctionName() {
    store.renameJunction("Junction 1", "Junction 4");
    Set<String> names = store.getJunctionNames();

    Assertions.assertEquals(names.contains("Junction 1"), false, "\"Junction 1\" should not be in the database.");
    Assertions.assertEquals(names.contains("Junction 4"), true, "\"Junction 4\" should be in the database.");
  }
}
