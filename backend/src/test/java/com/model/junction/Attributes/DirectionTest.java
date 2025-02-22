package com.model.junction.Attributes;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;

public class DirectionTest {
  @Test
  @DisplayName("Returns the opposite direction correctly.")
  public void returnOppositeDirection() {
    Direction northOpposite = Direction.NORTH.getOpposite();
    Direction eastOpposite = Direction.EAST.getOpposite();
    Direction southOpposite = Direction.SOUTH.getOpposite();
    Direction westOpposite = Direction.WEST.getOpposite();
    
    Assertions.assertEquals(northOpposite, Direction.SOUTH, "Expected: SOUTH\nOutput: " + northOpposite);
    Assertions.assertEquals(eastOpposite, Direction.WEST, "Expected: WEST\nOutput: " + eastOpposite);
    Assertions.assertEquals(southOpposite, Direction.NORTH, "Expected: NORTH\nOutput: " + southOpposite);
    Assertions.assertEquals(westOpposite, Direction.EAST, "Expected: EAST\nOutput: " + westOpposite);
  }

  @Test
  @DisplayName("Returns the direction left of the current facing direction correctly.")
  public void returnLeftDirection() {
    Direction northLeft = Direction.NORTH.getLeft();
    Direction eastLeft = Direction.EAST.getLeft();
    Direction southLeft = Direction.SOUTH.getLeft();
    Direction westLeft = Direction.WEST.getLeft();
    
    Assertions.assertEquals(northLeft, Direction.WEST, "Expected: WEST\nOutput: " + northLeft);
    Assertions.assertEquals(eastLeft, Direction.NORTH, "Expected: NORTH\nOutput: " + eastLeft);
    Assertions.assertEquals(southLeft, Direction.EAST, "Expected: EAST\nOutput: " + southLeft);
    Assertions.assertEquals(westLeft, Direction.SOUTH, "Expected: SOUTH\nOutput: " + westLeft);
  }

  @Test
  @DisplayName("Returns the direction right of the current facing direction correctly.")
  public void returnRightDirection() {
    Direction northRight = Direction.NORTH.getRight();
    Direction eastRight = Direction.EAST.getRight();
    Direction southRight = Direction.SOUTH.getRight();
    Direction westRight = Direction.WEST.getRight();
    
    Assertions.assertEquals(northRight, Direction.EAST, "Expected: EAST\nOutput: " + northRight);
    Assertions.assertEquals(eastRight, Direction.SOUTH, "Expected: SOUTH\nOutput: " + eastRight);
    Assertions.assertEquals(southRight, Direction.WEST, "Expected: WEST\nOutput: " + southRight);
    Assertions.assertEquals(westRight, Direction.NORTH, "Expected: NORTH\nOutput: " + westRight);
  }
}
