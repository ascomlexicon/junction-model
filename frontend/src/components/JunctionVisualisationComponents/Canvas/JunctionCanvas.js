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
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Draw box junction in the center
      ctx.drawImage(images.boxJunction, centerX - 175, centerY - 175, 350, 350);
      
      // Draw entering and exiting lanes based on config
      drawLanes(ctx, config, centerX, centerY, images);
      
      // Draw pedestrian crossings if enabled
      if (config.isCrossings) {
        drawPedestrianCrossings(ctx, centerX, centerY, images);
      }
      
      // Draw traffic flow indicators
      drawTrafficFlow(ctx, config, centerX, centerY, images);
      
      // Draw special lanes (bus/cycle) if configured
      if (config.isBusOrCycle && config.isBusOrCycle !== "none") {
        drawSpecialLanes(ctx, config, centerX, centerY, images);
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
  const drawLanes = (ctx, config, centerX, centerY, images) => {
    const directions = ['North', 'South', 'East', 'West'];
    
    directions.forEach(direction => {
      const enteringLanes = config.lanesEntering[`${direction.toLowerCase()}`] || 1;
      const exitingLanes = config.lanesExiting[`${direction.toLowerCase()}`] || 1;
      const hasLeftTurn = config.leftTurnLanes[`${direction.toLowerCase()}`] || false;
      
      // Draw lanes based on direction
      switch(direction) {
        case 'North':
          drawNorthLanes(ctx, centerX, centerY, enteringLanes, exitingLanes, hasLeftTurn, images);
          break;
        case 'South':
          drawSouthLanes(ctx, centerX, centerY, enteringLanes, exitingLanes, hasLeftTurn, images);
          break;
        case 'East':
          drawEastLanes(ctx, centerX, centerY, enteringLanes, exitingLanes, hasLeftTurn, images);
          break;
        case 'West':
          drawWestLanes(ctx, centerX, centerY, enteringLanes, exitingLanes, hasLeftTurn, images);
          break;
        default:
          break;
      }
    });
  };
  
  // Cars coming from the north
  const drawNorthLanes = (ctx, centerX, centerY, entering, exiting, hasLeftTurn, images) => {
    // Similar to North but mirrored
    const laneWidth = 40;
    const totalEnteringWidth = entering * laneWidth;
    const startX = centerX + (totalEnteringWidth / 2);
    
    // Draw lane markers
    ctx.strokeStyle = 'white';
    
    for (let i = 0; i <= entering; i++) {
      const x = startX - (i * laneWidth);
      ctx.beginPath();
      ctx.moveTo(x, centerY - 175);
      ctx.lineTo(x, 0);
      ctx.stroke();
    }
    
    // Draw directional arrows
    if (hasLeftTurn) {
      ctx.drawImage(images.leftOnlyArrow, startX - 35, centerY - 260, 30, 60);
    }
    
    // Draw straight arrows
    const straightLanes = hasLeftTurn ? entering - 1 : entering;
    for (let i = 0; i < straightLanes; i++) {
      const x = startX - (hasLeftTurn ? laneWidth : 0) - (i * laneWidth) - 35;
      ctx.drawImage(images.straightArrow, x, centerY - 260, 30, 60);
    }
    
    // Draw traffic light
    ctx.drawImage(images.trafficLight, startX + 20, centerY - 140, 40, 20);
  };

  // Cars coming from the south
  const drawSouthLanes = (ctx, centerX, centerY, entering, exiting, hasLeftTurn, images) => {
    // Draw entering lanes (from bottom to junction)
    const laneWidth = 40;
    const totalEnteringWidth = entering * laneWidth;
    const startX = centerX - (totalEnteringWidth / 2);
    
    // Draw lane markers
    ctx.strokeStyle = 'white';
    
    for (let i = 0; i <= entering; i++) {
      const x = startX + (i * laneWidth);
      ctx.beginPath();
      ctx.moveTo(x, centerY + 175);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw directional arrows
    if (hasLeftTurn) {
      ctx.drawImage(images.leftOnlyArrow, startX + 5, centerY + 200, 30, 60);
    }
    
    // Draw straight arrows
    const straightLanes = hasLeftTurn ? entering - 1 : entering;
    for (let i = 0; i < straightLanes; i++) {
      const x = startX + (hasLeftTurn ? laneWidth : 0) + (i * laneWidth) + 5;
      ctx.drawImage(images.straightArrow, x, centerY + 200, 30, 60);
    }
    
    // Draw traffic light
    // FIXME: Traffic lights appear skewed in different directions, so need to fix this
    ctx.drawImage(images.trafficLight, startX - 60, centerY + 120, 40, 20);
  };
  
  // Cars coming from the east
  const drawEastLanes = (ctx, centerX, centerY, entering, exiting, hasLeftTurn, images) => {
    const laneWidth = 40;
    const totalEnteringHeight = entering * laneWidth;
    const startY = centerY + (totalEnteringHeight / 2);
    
    // Draw lane markers
    ctx.strokeStyle = 'white';
    
    for (let i = 0; i <= entering; i++) {
      const y = startY - (i * laneWidth);
      ctx.beginPath();
      ctx.moveTo(centerX + 175, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw arrows (need to rotate for west direction)
    ctx.save();
    
    if (hasLeftTurn) {
      ctx.translate(centerX + 230, startY - 15);
      ctx.rotate(Math.PI/2);
      ctx.drawImage(images.leftOnlyArrow, -30, -30, 30, 60);
    }
    
    const straightLanes = hasLeftTurn ? entering - 1 : entering;
    for (let i = 0; i < straightLanes; i++) {
      const y = startY - (hasLeftTurn ? laneWidth : 0) - (i * laneWidth) - 15;
      ctx.translate(centerX + 230, y);
      ctx.rotate(Math.PI/2);
      ctx.drawImage(images.straightArrow, -30, -30, 30, 60);
      ctx.rotate(-Math.PI/2);
      ctx.translate(-(centerX + 230), -y);
    }
    
    ctx.restore();
    
    // Draw traffic light
    ctx.drawImage(images.trafficLight, centerX + 100, startY + 20, 20, 40);
  };

  // Cars coming from the west
  const drawWestLanes = (ctx, centerX, centerY, entering, exiting, hasLeftTurn, images) => {
    const laneWidth = 40;
    const totalEnteringHeight = entering * laneWidth;
    const startY = centerY - (totalEnteringHeight / 2);
    
    // Draw lane markers
    ctx.strokeStyle = 'white';
    
    for (let i = 0; i <= entering; i++) {
      const y = startY + (i * laneWidth);
      ctx.beginPath();
      ctx.moveTo(centerX - 175, y);
      ctx.lineTo(0, y);
      ctx.stroke();
    }
    
    // Draw arrows (need to rotate for east direction)
    ctx.save();
    
    if (hasLeftTurn) {
      ctx.translate(centerX - 230, startY + 15);
      ctx.rotate(-Math.PI/2);
      ctx.drawImage(images.leftOnlyArrow, -30, -30, 30, 60);
    }
    
    const straightLanes = hasLeftTurn ? entering - 1 : entering;
    for (let i = 0; i < straightLanes; i++) {
      const y = startY + (hasLeftTurn ? laneWidth : 0) + (i * laneWidth) + 15;
      ctx.translate(centerX - 230, y);
      ctx.rotate(-Math.PI/2);
      ctx.drawImage(images.straightArrow, -30, -30, 30, 60);
      ctx.rotate(Math.PI/2);
      ctx.translate(-(centerX - 230), -y);
    }
    
    ctx.restore();
    
    // Draw traffic light
    ctx.drawImage(images.trafficLight, centerX - 120, startY - 60, 20, 40);
  };
  
  // Draw pedestrian crossings if enabled
  const drawPedestrianCrossings = (ctx, centerX, centerY, images) => {
    // North crossing
    ctx.drawImage(images.pedestrianCrossing, centerX - 175, centerY - 197, 350, 22);

    // South crossing
    ctx.drawImage(images.pedestrianCrossing, centerX - 175, centerY + 174, 350, 22);
    
    // East crossing
    ctx.save();
    // This translates the centre of the canvas to a new position (centerX + 230, centerY - 100)
    ctx.translate(centerX + 22, centerY - 160);
    ctx.rotate(Math.PI/2);
    ctx.drawImage(images.pedestrianCrossing, -15, -175, 350, 22);
    ctx.restore(); // Restores to previously saved state (used so centre of canvas is now (0,0) again)

    // West crossing
    ctx.save();
    ctx.translate(centerX - 21, centerY + 160);
    ctx.rotate(-Math.PI/2);
    ctx.fillRect(0, 0, 20, 20);
    ctx.drawImage(images.pedestrianCrossing, -15, -175, 350, 22);
    ctx.restore();
  };
  
  // Draw traffic flow indicators
  const drawTrafficFlow = (ctx, config, centerX, centerY, images) => {
    // Display traffic volume indicators based on vph values
    drawVolumeIndicator(ctx, 'North', config.vphNorth, centerX, centerY + 300);
    drawVolumeIndicator(ctx, 'South', config.vphSouth, centerX, centerY - 300);
    drawVolumeIndicator(ctx, 'East', config.vphEast, centerX - 300, centerY);
    drawVolumeIndicator(ctx, 'West', config.vphWest, centerX + 300, centerY);
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
  const drawSpecialLanes = (ctx, config, centerX, centerY, images) => {
    const { isBusOrCycle, busCycleLaneDuration } = config;
    const laneImage = isBusOrCycle === "bus" ? images.busLane : images.cycleLane;
    
    // Draw special lanes based on direction and vph
    if (busCycleLaneDuration.vphSpecialNorth > 0) {
      ctx.drawImage(laneImage, centerX + 140, centerY - 300, 40, 100);
    }

    if (busCycleLaneDuration.vphSpecialSouth > 0) {
      ctx.drawImage(laneImage, centerX - 180, centerY + 200, 40, 100);
    }
    
    if (busCycleLaneDuration.vphSpecialEast > 0) {
      ctx.save();
      ctx.translate(centerX + 300, centerY + 140);
      ctx.rotate(Math.PI/2);
      ctx.drawImage(laneImage, 0, 0, 40, 100);
      ctx.restore();
    }

    if (busCycleLaneDuration.vphSpecialWest > 0) {
      ctx.save();
      ctx.translate(centerX - 300, centerY - 180);
      ctx.rotate(-Math.PI/2);
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