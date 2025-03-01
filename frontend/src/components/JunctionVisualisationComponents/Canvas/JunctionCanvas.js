import React, { useEffect, useRef, useState } from 'react';

const JunctionCanvas = ({ config }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // Function to handle resize with debounce
  // TODO: Check, new
  const handleResize = () => {
    // Clear any existing timeout
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    
    // Set a new timeout
    resizeTimeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        // Get the container dimensions
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight || window.innerHeight * 0.7;
        
        // Set canvas dimensions based on container
        setDimensions({
          width: containerWidth,
          height: containerHeight
        });
      }
    }, 250); // 250ms delay for debounce
  };
  
  // Initialize dimensions and set up resize listener
  // TODO: Check, new
  useEffect(() => {
    // Initial sizing
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight || window.innerHeight * 0.7;
      
      setDimensions({
        width: containerWidth,
        height: containerHeight
      });
    }
    
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);

      // Clear any existing timeout on unmount
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);
  
  // Effect to redraw the canvas whenever the config or dimensions change
  useEffect(() => {
    if (!config || !config.lanesEntering) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Load all required images
    const images = {
      boxJunction: new Image(),
      roadMarking: new Image(),
      pedestrianCrossing: new Image(),
      leftOnlyArrow: new Image(),
      rightOnlyArrow: new Image(),
      straightArrow: new Image(),
      straightLeftArrow: new Image(),
      straightRightArrow: new Image(),
      leftRightArrow: new Image(),
      busLane: new Image(),
      cycleLane: new Image()
    };
    
    // Set image sources
    images.boxJunction.src = require('../images/box.png');
    images.roadMarking.src = require('../images/roadMarking.png');
    images.pedestrianCrossing.src = require('../images/crossing.png');
    images.leftOnlyArrow.src = require('../images/left.png');
    images.rightOnlyArrow.src = require('../images/right.png');
    images.straightArrow.src = require('../images/straight.png');
    images.straightLeftArrow.src = require('../images/straightLeft.png');
    images.straightRightArrow.src = require('../images/straightRight.png');
    images.leftRightArrow.src = require('../images/leftRight.png');
    images.busLane.src = require('../images/busLane.png');
    images.cycleLane.src = require('../images/cycleLane.png');
    
    // Track loaded images
    let loadedImages = 0;
    const totalImages = Object.keys(images).length;
    
    // Original design was based on 800x600; calculate scale factor based on these dimensions
    const baseWidth = 800;
    const baseHeight = 600;
    const scaleX = dimensions.width / baseWidth;
    const scaleY = dimensions.height / baseHeight;
    
    // Use the smaller scale to maintain aspect ratio
    const scale = Math.min(scaleX, scaleY);
    
    // Function to draw the junction based on user data and scale
    const drawJunction = () => {
      // Clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Save the context state
      ctx.save();
      
      // Center the drawing in the canvas
      const offsetX = (dimensions.width - (baseWidth * scale)) / 2;
      const offsetY = (dimensions.height - (baseHeight * scale)) / 2;
      
      // Move to center and scale
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);
      
      // Center coordinates (now in the scaled coordinate system)
      const centreX = baseWidth / 2;
      const centreY = baseHeight / 2;
      
      // Draw box junction in the center
      ctx.drawImage(images.boxJunction, centreX - 175, centreY - 175, 350, 350);
      
      // Draw entering and exiting lanes based on config
      drawLanes(ctx, config, centreX, centreY, images);
      
      // Draw pedestrian crossings if enabled
      if (config.isCrossings) {
        drawPedestrianCrossings(ctx, centreX, centreY, images);
      }
      
      // Restore the context state
      ctx.restore();
    };
    
    // Load handler for images
    const onImageLoad = () => {
      loadedImages++;
      if (loadedImages === totalImages) {
        // Draw the junction when all images have loaded
        drawJunction();
      }
    };
    
    // Set load event for all images
    Object.values(images).forEach(img => {
      img.onload = onImageLoad;
    });
    
  }, [config, dimensions]);
  
  // Draw lanes based on config
  const drawLanes = (ctx, config, centreX, centreY, images) => {
    const directions = ['North', 'South', 'East', 'West'];
    const busData = config.busCycleLaneDuration;

    directions.forEach(direction => {
      const enteringLanes = config.lanesEntering[`${direction.toLowerCase()}`] || 0;
      const exitingLanes = config.lanesExiting[`${direction.toLowerCase()}`] || 0;
      const hasLeftTurn = config.leftTurnLanes[`${direction.toLowerCase()}`] || false;

      // Draw lanes based on direction
      switch(direction) {
        case 'North':
          drawNorthQuarter(ctx, centreX, centreY, enteringLanes, exitingLanes, hasLeftTurn, images, busData, config.vphNorth, config.isBusOrCycle);
          break;
        case 'South':
          drawSouthQuarter(ctx, centreX, centreY, enteringLanes, exitingLanes, hasLeftTurn, images, busData, config.vphSouth, config.isBusOrCycle);
          break;
        case 'East':
          drawEastQuarter(ctx, centreX, centreY, enteringLanes, exitingLanes, hasLeftTurn, images, busData, config.vphEast, config.isBusOrCycle);
          break;
        case 'West':
          drawWestQuarter(ctx, centreX, centreY, enteringLanes, exitingLanes, hasLeftTurn, images, busData, config.vphWest, config.isBusOrCycle);
          break;
        default:
          break;
      }
    });
  };
  
  // Returns a layout of road markings dependant on the number of lanes available and
  // what direction cars exit the junction
  const determineLayout = (numLanes, carData, direction) => {
    let left, straight, right;

    switch (direction) {
      case 'North':
        left = carData.exitEast;
        straight = carData.exitSouth;
        right = carData.exitWest;
        break;
      case 'South':
        left = carData.exitWest;
        straight = carData.exitNorth;
        right = carData.exitEast;
        break;
      case 'East':
        left = carData.exitSouth;
        straight = carData.exitWest;
        right = carData.exitNorth;
        break;
      case 'West':
        left = carData.exitNorth;
        straight = carData.exitEast;
        right = carData.exitSouth;
        break;
    }

    // Checks which directions have traffic flow (non-zero)
    const needLeft = left > 0;
    const needStraight = straight > 0;
    const needRight = right > 0;

    let laneConfiguration = []

    // 1 lane
    if (numLanes === 1) {
      // TODO: Need to think about this case
        // The straight only arrow would not cover it naturally, however is it too complex to have all 3?
        // I think this should be disallowed, talk with the team
      if (needLeft && needStraight && needRight) {
        laneConfiguration.push('straight');
      } else if (needLeft && needStraight) {
        laneConfiguration.push('straightLeft');
      } else if (needRight && needStraight) {
        laneConfiguration.push('straightRight');
      } else if (needLeft && needRight) {
        laneConfiguration.push('leftRight');
      } else if (needLeft) {
        laneConfiguration.push('left');
      } else if (needRight) {
        laneConfiguration.push('right');
      } else {
        laneConfiguration.push('straight');
      }
      return laneConfiguration;
    }

    // Multiple lanes case
    if (numLanes >= 2) {
      // Left lane handling
      if (needLeft) {
        if (needStraight) {
          laneConfiguration.push('straightLeft');
        } else {
          // TODO: Might get rid of this, as this is a left-only lane, which is special
          // However, are we saying that "left-only lane" as an option clicked by the user is different to just routing traffic left??
          laneConfiguration.push('left');
        }
      } else if (needRight && !needStraight) {
        // When all traffic routed only to the right
        laneConfiguration.push('right');
      } else {
        // When all traffic routed straight only
        laneConfiguration.push('straight');
      }
      
      // Middle lanes (only applicable in the case of >2)
      if (numLanes !== 2) {
        for (let i = 1; i < numLanes - 1; i++) {
          if (needStraight) {
            laneConfiguration.push('straight');
          } else {
            if (needLeft && needRight) {
              // Left and right, no straight traffic
              if (i < 2) {
                laneConfiguration.push('left');
              } else {
                laneConfiguration.push('right');
              }
            } else if (needLeft) {
              // Left only
              laneConfiguration.push('left');
            } else {
              // Right only
              laneConfiguration.push('right');
            }
          }
        }
      }
      
      // Right lane handling
      if (needRight) {
        if (needStraight) {
          laneConfiguration.push('straightRight');
        } else {
          laneConfiguration.push('right');
        }
      } else if (needLeft && !needStraight) {
        // When all traffic routed only to the left
        laneConfiguration.push('left');
      } else {
        // When all traffic routed straight only
        laneConfiguration.push('straight');
      }
    }

    return laneConfiguration;
  };

  // Returns the image for a given type of lane
  const getLaneImageFromType = (images, type) => {
    switch (type) {
      case 'straight':
        return images.straightArrow;
      case 'left':
        return images.leftOnlyArrow;
      case 'right':
        return images.rightOnlyArrow;
      case 'straightLeft':
        return images.straightLeftArrow;
      case 'straightRight':
        return images.straightRightArrow;
      case 'leftRight':
        return images.leftRightArrow;
      default:
        break;
    }
  }

  const drawEnteringCarLanes = (ctx, centreX, centreY, lanesToDraw, images, isSpecialLane, carData, width, direction) => {
    // If there is a special lane, then start drawing lanes further from the edge of
    // the road
    let xOffset = isSpecialLane ? width : 0;
    
    // Configuration of road markings for regular cars
    const laneLayout = determineLayout(lanesToDraw, carData, direction);

    // Draw each junction quarter
    switch (direction) {
      case 'North':
        ctx.save();
        ctx.translate(centreX + 135 + 20, centreY - 275 + 50); 
        ctx.rotate(Math.PI);

        for (let i = 0; i < lanesToDraw; i++) {
          ctx.drawImage(getLaneImageFromType(images, laneLayout[i]), -20 + (i * width) + xOffset, -50, width, 100);
        }

        ctx.restore();
        break;
      case 'South':
        for (let i = 0; i < lanesToDraw; i++) {
          ctx.drawImage(getLaneImageFromType(images, laneLayout[i]), centreX - 174 + (i * width) + xOffset, centreY + 174, width, 100);
        }
        break;
      case 'East':
        ctx.save();
        ctx.translate(centreX + 275, centreY + 135);
        ctx.rotate(Math.PI/2);
        ctx.scale(-1, -1); 

        for (let i = 0; i < lanesToDraw; i++) {
          ctx.drawImage(getLaneImageFromType(images, laneLayout[i]), -40 + (i * width) + xOffset, -100, width, 100);
        }

        ctx.restore();
        break;
      case 'West':
        ctx.save();
        ctx.translate(centreX - 173, centreY - 175);
        ctx.rotate(-Math.PI/2);
        ctx.scale(-1, -1);

        for (let i = 0; i < lanesToDraw; i++) {
          ctx.drawImage(getLaneImageFromType(images, laneLayout[i]), 0 + (i * width) + xOffset, 0, width, 100);
        }

        ctx.restore();
        break;
      default:
        break;
    }
  };

  const drawExitingCarLanes = (ctx, centreX, centreY, lanesToDraw, img, width, direction) => {
    switch (direction) {
      case 'North':
        for (let i = 0; i < lanesToDraw; i++) {  
          ctx.drawImage(img, centreX - 175 + (i * width), centreY - 275, width, 100);
        }
        break;
      case 'South':
        for (let i = 0; i < lanesToDraw; i++) {
          ctx.drawImage(img, centreX + (i * width), centreY + 174, width, 100);
        }
        break;
      case 'East':
        ctx.save();
        ctx.translate(centreX - 173, centreY - 175);
        ctx.rotate(-Math.PI/2);
        ctx.scale(-1, -1);

        for (let i = 0; i < lanesToDraw; i++) {
          ctx.drawImage(img, 0 + (i * width), -448, width, 100);
        }

        ctx.restore();
        break;
      case 'West':
        ctx.save();
        ctx.translate(centreX + 275, centreY + 135);
        ctx.rotate(Math.PI/2);
        ctx.scale(-1, -1);

        for (let i = 0; i < lanesToDraw; i++) {
          ctx.drawImage(img, -40 + (i * width), -548, width, 100);
        }

        ctx.restore();
        break;
      default:
        break
    }
  }

  // Cars coming from the north
  const drawNorthQuarter = (ctx, centreX, centreY, entering, exiting, hasLeftTurn, images, busData, carData, busOrBike) => {
    // Entering lane widths = ((height of box junction)/2) / number of entering lanes
    // Exiting lane widths = ((height of box junction)/2) / number of exiting lanes
    const enteringLaneWidth = entering !== 0 ? (350 / 2) / entering : null;
    const exitingLaneWidth = exiting !== 0 ? (350 / 2) / exiting : null;
    let lanesToDraw = entering;

    let specialImg = null;

    if (hasLeftTurn) {
      specialImg = images.leftOnlyArrow;
    } else if (busOrBike === "bus" && busData.vphSpecialNorth) {
      specialImg = images.busLane;
    } else if (busOrBike === "cycle" && busData.vphSpecialNorth) {
      specialImg = images.cycleLane;
    }

    // Draws the special lane only if the user has specified left, bus or cycle lane
    if (specialImg) {
      ctx.save();
      ctx.translate(centreX + 134 + 20, centreY - 274 + 50); // Translate to the center of the image
      ctx.rotate(Math.PI); // Rotate by 180 degrees
      ctx.drawImage(specialImg, -20, -50, enteringLaneWidth, 100); // Draw the image centered at the new origin
      ctx.restore();
      lanesToDraw--;
    }

    // Draw car lanes only if the user has entered data
    if (entering !== 0) {
      // Draws the other car lanes depending on vph data and how many are left
      drawEnteringCarLanes(ctx, centreX, centreY, lanesToDraw, images, specialImg, carData, enteringLaneWidth, 'North');

      // Draws car lanes exiting the junction northbound
      drawExitingCarLanes(ctx, centreX, centreY, exiting, images.roadMarking, exitingLaneWidth, 'North');
    }
  };

  // Cars coming from the south
  const drawSouthQuarter = (ctx, centreX, centreY, entering, exiting, hasLeftTurn, images, busData, carData, busOrBike) => {
    const enteringLaneWidth = entering !== 0 ? (350 / 2) / entering : null;
    const exitingLaneWidth = exiting !== 0 ? (350 / 2) / exiting : null;
    let lanesToDraw = entering;

    let specialImg = null;

    if (hasLeftTurn) {
      specialImg = images.leftOnlyArrow;
    } else if (busOrBike === "bus" && busData.vphSpecialSouth) {
      specialImg = images.busLane;
    } else if (busOrBike === "cycle" && busData.vphSpecialSouth) {
      specialImg = images.cycleLane;
    }

    // Draws the special lane only if the user has specified left, bus or cycle lane
    if (specialImg) {
      ctx.drawImage(specialImg, centreX - 174, centreY + 174, enteringLaneWidth, 100);
      lanesToDraw--;
    }

    if (entering !== 0) {
      drawEnteringCarLanes(ctx, centreX, centreY, lanesToDraw, images, specialImg, carData, enteringLaneWidth, 'South');

      // Draws car lanes exiting the junction northbound
      drawExitingCarLanes(ctx, centreX, centreY, exiting, images.roadMarking, exitingLaneWidth, 'South');
    }
  };
  
  // Cars coming from the east
  const drawEastQuarter = (ctx, centreX, centreY, entering, exiting, hasLeftTurn, images, busData, carData, busOrBike) => {
    const enteringLaneWidth = entering !== 0 ? (350 / 2) / entering : null;
    const exitingLaneWidth = exiting !== 0 ? (350 / 2) / exiting : null;
    let lanesToDraw = entering;

    let specialImg = null;

    if (hasLeftTurn) {
      specialImg = images.leftOnlyArrow;
    } else if (busOrBike === "bus" && busData.vphSpecialEast) {
      specialImg = images.busLane;
    } else if (busOrBike === "cycle" && busData.vphSpecialEast) {
      specialImg = images.cycleLane;
    }

    // Draws the special lane only if the user has specified left, bus or cycle lane
    if (specialImg) {
      ctx.save();
      ctx.translate(centreX + 275, centreY + 135);
      ctx.rotate(Math.PI/2);
      ctx.scale(-1, -1); // Flips image again, can be read by oncoming traffic from the east
      ctx.drawImage(specialImg, -40, -100, enteringLaneWidth, 100);
      ctx.restore();
      lanesToDraw--;
    }

    if (entering !== 0) {
      drawEnteringCarLanes(ctx, centreX, centreY, lanesToDraw, images, specialImg, carData, enteringLaneWidth, 'East');

      // Draws car lanes exiting the junction northbound
      drawExitingCarLanes(ctx, centreX, centreY, exiting, images.roadMarking, exitingLaneWidth, 'East');
    }

  };

  // Cars coming from the west
  const drawWestQuarter = (ctx, centreX, centreY, entering, exiting, hasLeftTurn, images, busData, carData, busOrBike) => {
    const enteringLaneWidth = entering !== 0 ? (350 / 2) / entering : null;
    const exitingLaneWidth = exiting !== 0 ? (350 / 2) / exiting : null;
    let lanesToDraw = entering;

    let specialImg = null;

    if (hasLeftTurn) {
      specialImg = images.leftOnlyArrow;
    } else if (busOrBike === "bus" && busData.vphSpecialWest) {
      specialImg = images.busLane;
    } else if (busOrBike === "cycle" && busData.vphSpecialWest) {
      specialImg = images.cycleLane;
    }

    // Draws the special lane only if the user has specified left, bus or cycle lane
    if (specialImg) {
      ctx.save();
      ctx.translate(centreX - 173, centreY - 175);
      ctx.rotate(-Math.PI/2);
      ctx.scale(-1, -1);
      ctx.drawImage(specialImg, 0, 0, enteringLaneWidth, 100);
      ctx.restore();
      lanesToDraw--;
    }

    if (entering !== 0) {
      drawEnteringCarLanes(ctx, centreX, centreY, lanesToDraw, images, specialImg, carData, enteringLaneWidth, 'West');

      // Draws car lanes exiting the junction northbound
      drawExitingCarLanes(ctx, centreX, centreY, exiting, images.roadMarking, exitingLaneWidth, 'West');
    }

  };
  
  // Draw pedestrian crossings if enabled
  const drawPedestrianCrossings = (ctx, centreX, centreY, images) => {
    // North crossing
    ctx.drawImage(images.pedestrianCrossing, centreX - 175, centreY - 185, 350, 10);

    // South crossing
    ctx.drawImage(images.pedestrianCrossing, centreX - 175, centreY + 174, 350, 10);
    
    // East crossing
    ctx.save();
    ctx.translate(centreX + 22, centreY - 160);
    ctx.rotate(Math.PI/2);
    ctx.drawImage(images.pedestrianCrossing, -15, -163, 350, 10);
    ctx.restore(); // Restores to previously saved state (used so centre of canvas is now (0,0) again)

    // West crossing
    ctx.save();
    ctx.translate(centreX - 21, centreY + 160);
    ctx.rotate(-Math.PI/2);
    ctx.drawImage(images.pedestrianCrossing, -15, -163, 350, 10);
    ctx.restore();
  };
  
  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <canvas 
        ref={canvasRef} 
        className='junction-graphic'
        width={dimensions.width} 
        height={dimensions.height} 
        style={{ 
          // border: '1px solid #000', 
          // backgroundColor: '#f0f0f0',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      />
    </div>
  );
};

export default JunctionCanvas;