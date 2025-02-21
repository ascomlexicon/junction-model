package com.model.junction.JunctionClasses;

import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

<<<<<<< HEAD
<<<<<<< HEAD
=======
import java.util.Set;

>>>>>>> b38801e (Create a basic system to store a junctions)
=======
>>>>>>> ed3f2a63864995930bad55a98418aa3ef30a701c
public class JunctionStorageTest {
  private JunctionStorage store;

  @BeforeEach
  public void testInit() {
    store = new JunctionStorage();
<<<<<<< HEAD
<<<<<<< HEAD
    store.storeJunction(new Junction("Junction 1"));
    store.storeJunction(new Junction("Junction 2"));
    store.storeJunction(new Junction("Junction 3"));
=======
    store.storeJunction("Junction 1", new Junction());
    store.storeJunction("Junction 2", new Junction());
    store.storeJunction("Junction 3", new Junction());
>>>>>>> b38801e (Create a basic system to store a junctions)
=======
    store.storeJunction(new Junction("Junction 1"));
    store.storeJunction(new Junction("Junction 2"));
    store.storeJunction(new Junction("Junction 3"));
>>>>>>> ed3f2a63864995930bad55a98418aa3ef30a701c
  }
  
  @Test
  @DisplayName("Reject junctions with duplicate names.")
<<<<<<< HEAD
<<<<<<< HEAD
  public void rejectDuplicateJunctions() {
    boolean didStore = store.storeJunction(new Junction("Junction 1"));
=======
  public void rejectJunctionsWithDuplicateNames() {
    boolean didStore = store.storeJunction("Junction 1", new Junction());
>>>>>>> b38801e (Create a basic system to store a junctions)
=======
  public void rejectDuplicateJunctions() {
    boolean didStore = store.storeJunction(new Junction("Junction 1"));
>>>>>>> ed3f2a63864995930bad55a98418aa3ef30a701c

    Assertions.assertEquals(false, didStore, "The Junction storage should reject the request.");
  }
  
  @Test
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> ed3f2a63864995930bad55a98418aa3ef30a701c
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
<<<<<<< HEAD
=======
  @DisplayName("Give a junction a new name and remove its old one.")
  public void replaceJunctionName() {
    store.renameJunction("Junction 1", "Junction 4");
    Set<String> names = store.getJunctionNames();

    Assertions.assertEquals(names.contains("Junction 1"), false, "\"Junction 1\" should not be in the database.");
    Assertions.assertEquals(names.contains("Junction 4"), true, "\"Junction 4\" should be in the database.");
>>>>>>> b38801e (Create a basic system to store a junctions)
=======
>>>>>>> ed3f2a63864995930bad55a98418aa3ef30a701c
  }
}
