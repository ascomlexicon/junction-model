package com.model.junction;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

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
  @DisplayName("Rename a junction to something unique.")
  public void renameJunctionNameValid() {
    boolean didChange = store.renameJunction("Junction 1", "Junction 4");
    Junction junction1 = store.getJunctionData("Junction 1");
    Junction junction4 = store.getJunctionData("Junction 4");

    Assertions.assertEquals(didChange, true, "Junction 1's name should now be Junction 4");
    Assertions.assertNull(junction1, "\"Junction 1\" should not be in the store.");
    Assertions.assertNotNull(junction4, "\"Junction 4\" should be in the store.");
  }

  @Test
  @DisplayName("Rename a junction to a non-unique name.")
  public void renameJunctionToDuplicateName() {
    boolean didChange = store.renameJunction("Junction 1", "Junction 3");

    Assertions.assertEquals(didChange, false, "No change should occur.");
    Assertions.assertNotNull(store.getJunctionData("Junction 1"), "Junction 1 should still remain in the store.");
  }
}
