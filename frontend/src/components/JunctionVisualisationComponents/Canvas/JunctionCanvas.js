import React, { useEffect, useRef } from 'react';

// TODO: Will need to use dynamic sizing, but fixed for now
const JunctionCanvas = ({ config, width = 800, height = 600 }) => {
  const canvasRef = useRef(null);
  
  // Effect to redraw the canvas whenever the config changes
  useEffect(() => {
    // TODO: Remove this (I think?)
    if (!config) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Load all required images
    const images = {
      boxJunction: new Image(),
      trafficLight: new Image(),
      pedestrianCrossing: new Image(),
      leftOnlyArrow: new Image(),
      rightOnlyArrow: new Image(),
      straightArrow: new Image(),
      straightLeftArrow: new Image(),
      straightRightArrow: new Image(),
      busLane: new Image(),
      cycleLane: new Image()
    };
    
    // Set image sources
    images.boxJunction.src = require('../images/box.png');
    images.trafficLight.src = require('../images/trafficLights.png');
    images.pedestrianCrossing.src = require('../images/crossing.png');
    images.leftOnlyArrow.src = require('../images/left.png');
    images.rightOnlyArrow.src = require('../images/right.png');
    images.straightArrow.src = require('../images/straight.png');
    images.straightLeftArrow.src = require('../images/straightLeft.png');
    images.straightRightArrow.src = require('../images/straightRight.png');
    images.busLane.src = require('../images/busLane.png');
    images.cycleLane.src = require('../images/cycleLane.png');
    
    // Track loaded images
    let loadedImages = 0;
    const totalImages = Object.keys(images).length;
    
    // Function to draw the junction based on config
    const drawJunction = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Center coordinates
      const centreX = width / 2;
      const centreY = height / 2;
      
      // Draw box junction in the center
      ctx.drawImage(images.boxJunction, centreX - 175, centreY - 175, 350, 350);
      
      // Draw entering and exiting lanes based on config
      drawLanes(ctx, config, centreX, centreY, images);
      
      // Draw pedestrian crossings if enabled
      if (config.isCrossings) {
        drawPedestrianCrossings(ctx, centreX, centreY, images);
      }
      
      // Draw traffic flow indicators
      drawTrafficFlow(ctx, config, centreX, centreY, images);
      
      // Draw special lanes (bus/cycle) if configured
      if (config.isBusOrCycle && config.isBusOrCycle !== "none") {
        drawSpecialLanes(ctx, config, centreX, centreY, images);
      }
    };
    
    // Load handler for images
    const onImageLoad = () => {
      loadedImages++;
      if (loadedImages === totalImages) {
        // All images loaded, draw the junction
        drawJunction();
      }
    };
    
    // Set load event for all images
    Object.values(images).forEach(img => {
      img.onload = onImageLoad;
    });
    
  }, [config, width, height]);
  
  // Draw lanes based on config
  const drawLanes = (ctx, config, centreX, centreY, images) => {
    const directions = ['North', 'South', 'East', 'West'];
    
    directions.forEach(direction => {
      const enteringLanes = config.lanesEntering[`${direction.toLowerCase()}`] || 1;
      const exitingLanes = config.lanesExiting[`${direction.toLowerCase()}`] || 1;
      const hasLeftTurn = config.leftTurnLanes[`${direction.toLowerCase()}`] || false;
      
      // Draw lanes based on direction
      switch(direction) {
        case 'North':
          drawNorthLanes(ctx, centreX, centreY, enteringLanes, exitingLanes, hasLeftTurn, images);
          break;
        case 'South':
          drawSouthLanes(ctx, centreX, centreY, enteringLanes, exitingLanes, hasLeftTurn, images);
          break;
        case 'East':
          drawEastLanes(ctx, centreX, centreY, enteringLanes, exitingLanes, hasLeftTurn, images);
          break;
        case 'West':
          drawWestLanes(ctx, centreX, centreY, enteringLanes, exitingLanes, hasLeftTurn, images);
          break;
        default:
          break;
      }
    });
  };
  
  // Cars coming from the north
  const drawNorthLanes = (ctx, centreX, centreY, entering, exiting, hasLeftTurn, images) => {
    // Similar to North but mirrored
    const laneWidth = 40;
    const totalEnteringWidth = entering * laneWidth;
    const startX = centreX + (totalEnteringWidth / 2);
    
    // Draw lane markers
    ctx.strokeStyle = 'white';
    
    for (let i = 0; i <= entering; i++) {
      const x = startX - (i * laneWidth);
      ctx.beginPath();
      ctx.moveTo(x, centreY - 175);
      ctx.lineTo(x, 0);
      ctx.stroke();
    }
    
    // Draw directional arrows
    if (hasLeftTurn) {
      ctx.drawImage(images.leftOnlyArrow, startX - 35, centreY - 260, 30, 60);
    }
    
    // Draw straight arrows
    const straightLanes = hasLeftTurn ? entering - 1 : entering;
    for (let i = 0; i < straightLanes; i++) {
      const x = startX - (hasLeftTurn ? laneWidth : 0) - (i * laneWidth) - 35;
      ctx.drawImage(images.straightArrow, x, centreY - 260, 30, 60);
    }
    
    // Draw traffic light
    ctx.drawImage(images.trafficLight, startX + 20, centreY - 140, 40, 20);
  };

  // Cars coming from the south
  const drawSouthLanes = (ctx, centreX, centreY, entering, exiting, hasLeftTurn, images) => {
    // Draw entering lanes (from bottom to junction)
    const laneWidth = 40;
    const totalEnteringWidth = entering * laneWidth;
    const startX = centreX - (totalEnteringWidth / 2);
    
    // Draw lane markers
    ctx.strokeStyle = 'white';
    
    for (let i = 0; i <= entering; i++) {
      const x = startX + (i * laneWidth);
      ctx.beginPath();
      ctx.moveTo(x, centreY + 175);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw directional arrows
    if (hasLeftTurn) {
      ctx.drawImage(images.leftOnlyArrow, startX + 5, centreY + 200, 30, 60);
    }
    
    // Draw straight arrows
    const straightLanes = hasLeftTurn ? entering - 1 : entering;
    for (let i = 0; i < straightLanes; i++) {
      const x = startX + (hasLeftTurn ? laneWidth : 0) + (i * laneWidth) + 5;
      ctx.drawImage(images.straightArrow, x, centreY + 200, 30, 60);
    }
    
    // Draw traffic light
    // FIXME: Traffic lights appear skewed in different directions, so need to fix this
    ctx.drawImage(images.trafficLight, startX - 60, centreY + 120, 40, 20);
  };
  
  // Cars coming from the east
  const drawEastLanes = (ctx, centreX, centreY, entering, exiting, hasLeftTurn, images) => {
    const laneWidth = 40;
    const totalEnteringHeight = entering * laneWidth;
    const startY = centreY + (totalEnteringHeight / 2);
    
    // Draw lane markers
    ctx.strokeStyle = 'white';
    
    for (let i = 0; i <= entering; i++) {
      const y = startY - (i * laneWidth);
      ctx.beginPath();
      ctx.moveTo(centreX + 175, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw arrows (need to rotate for west direction)
    ctx.save();
    
    if (hasLeftTurn) {
      ctx.translate(centreX + 230, startY - 15);
      ctx.rotate(Math.PI/2);
      ctx.drawImage(images.leftOnlyArrow, -30, -30, 30, 60);
    }
    
    const straightLanes = hasLeftTurn ? entering - 1 : entering;
    for (let i = 0; i < straightLanes; i++) {
      const y = startY - (hasLeftTurn ? laneWidth : 0) - (i * laneWidth) - 15;
      ctx.translate(centreX + 230, y);
      ctx.rotate(Math.PI/2);
      ctx.drawImage(images.straightArrow, -30, -30, 30, 60);
      ctx.rotate(-Math.PI/2);
      ctx.translate(-(centreX + 230), -y);
    }
    
    ctx.restore();
    
    // Draw traffic light
    ctx.drawImage(images.trafficLight, centreX + 100, startY + 20, 20, 40);
  };

  // Cars coming from the west
  const drawWestLanes = (ctx, centreX, centreY, entering, exiting, hasLeftTurn, images) => {
    const laneWidth = 40;
    const totalEnteringHeight = entering * laneWidth;
    const startY = centreY - (totalEnteringHeight / 2);
    
    // Draw lane markers
    ctx.strokeStyle = 'white';
    
    for (let i = 0; i <= entering; i++) {
      const y = startY + (i * laneWidth);
      ctx.beginPath();
      ctx.moveTo(centreX - 175, y);
      ctx.lineTo(0, y);
      ctx.stroke();
    }
    
    // Draw arrows (need to rotate for east direction)
    ctx.save();
    
    if (hasLeftTurn) {
      ctx.translate(centreX - 230, startY + 15);
      ctx.rotate(-Math.PI/2);
      ctx.drawImage(images.leftOnlyArrow, -30, -30, 30, 60);
    }
    
    const straightLanes = hasLeftTurn ? entering - 1 : entering;
    for (let i = 0; i < straightLanes; i++) {
      const y = startY + (hasLeftTurn ? laneWidth : 0) + (i * laneWidth) + 15;
      ctx.translate(centreX - 230, y);
      ctx.rotate(-Math.PI/2);
      ctx.drawImage(images.straightArrow, -30, -30, 30, 60);
      ctx.rotate(Math.PI/2);
      ctx.translate(-(centreX - 230), -y);
    }
    
    ctx.restore();
    
    // Draw traffic light
    ctx.drawImage(images.trafficLight, centreX - 120, startY - 60, 20, 40);
  };
  
  // Draw pedestrian crossings if enabled
  const drawPedestrianCrossings = (ctx, centreX, centreY, images) => {
    // North crossing
    ctx.drawImage(images.pedestrianCrossing, centreX - 175, centreY - 197, 350, 22);

    // South crossing
    ctx.drawImage(images.pedestrianCrossing, centreX - 175, centreY + 174, 350, 22);
    
    // East crossing
    ctx.save();
    // This translates the centre of the canvas to a new position (centreX + 230, centreY - 100)
    ctx.translate(centreX + 22, centreY - 160);
    ctx.rotate(Math.PI/2);
    ctx.drawImage(images.pedestrianCrossing, -15, -175, 350, 22);
    ctx.restore(); // Restores to previously saved state (used so centre of canvas is now (0,0) again)

    // West crossing
    ctx.save();
    ctx.translate(centreX - 21, centreY + 160);
    ctx.rotate(-Math.PI/2);
    ctx.fillRect(0, 0, 20, 20);
    ctx.drawImage(images.pedestrianCrossing, -15, -175, 350, 22);
    ctx.restore();
  };
  
  // Draw traffic flow indicators
  const drawTrafficFlow = (ctx, config, centreX, centreY, images) => {
    // Display traffic volume indicators based on vph values
    drawVolumeIndicator(ctx, 'North', config.vphNorth, centreX, centreY + 300);
    drawVolumeIndicator(ctx, 'South', config.vphSouth, centreX, centreY - 300);
    drawVolumeIndicator(ctx, 'East', config.vphEast, centreX - 300, centreY);
    drawVolumeIndicator(ctx, 'West', config.vphWest, centreX + 300, centreY);
  };
  
  // Helper to draw traffic volume indicator
  const drawVolumeIndicator = (ctx, direction, vphData, x, y) => {
    if (!vphData || Object.keys(vphData).length === 0) return;
    
    // Extract total vph if available
    const totalVph = vphData.total || 
                    (vphData.left || 0) + (vphData.straight || 0) + (vphData.right || 0);
    
    if (totalVph > 0) {
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.fillText(`${direction}: ${totalVph} vph`, x - 40, y);
    }
  };
  
  // Draw special lanes (bus/cycle)
  // FIXME: Width of bus lane needs to be the same as every other lane
  // This means the width of the bus lane depends on the number of lanes, see logic for drawing standard lanes and customise accordingly
  const drawSpecialLanes = (ctx, config, centreX, centreY, images) => {
    const { isBusOrCycle, busCycleLaneDuration } = config;
    const laneImage = isBusOrCycle === "bus" ? images.busLane : images.cycleLane;
    
    // Draw special lanes based on direction and vph
    if (busCycleLaneDuration.vphSpecialNorth) {
      ctx.save();
      // Original image drawn at (centreX + 134, centreY - 274)
      // TODO: Eventually simplify this, keep additions for rotation logic for now
      ctx.translate(centreX + 134 + 20, centreY - 274 + 50); // Translate to the center of the image
      ctx.rotate(Math.PI); // Rotate by 180 degrees
      ctx.drawImage(laneImage, -20, -50, 40, 100); // Draw the image centered at the new origin
      ctx.restore();
    }

    if (busCycleLaneDuration.vphSpecialSouth) {
      ctx.drawImage(laneImage, centreX - 174, centreY + 174, 40, 100);
    }
    
    if (busCycleLaneDuration.vphSpecialEast) {
      ctx.save();
      ctx.translate(centreX + 275, centreY + 135);
      ctx.rotate(Math.PI/2);
      ctx.scale(-1, -1); // Flips image again, can be read by oncoming traffic from the east
      ctx.drawImage(laneImage, -40, -100, 40, 100);
      ctx.restore();
    }

    if (busCycleLaneDuration.vphSpecialWest) {
      ctx.save();
      ctx.translate(centreX - 173, centreY - 175);
      ctx.rotate(-Math.PI/2);
      ctx.scale(-1, -1);
      ctx.drawImage(laneImage, 0, 0, 40, 100);
      ctx.restore();
    }
  };
  
  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height} 
      style={{ border: '1px solid #000', backgroundColor: '#f0f0f0' }}
    />
  );
};

export default JunctionCanvas;