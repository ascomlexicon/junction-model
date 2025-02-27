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
    if (!config) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
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
      // FIXME: If crossings is configured, positions of lanes should be further away from the box junction
      if (config.isCrossings) {
        drawPedestrianCrossings(ctx, centreX, centreY, images);
      }
      
      // Draw special lanes (bus/cycle) if configured
      // FIXME: This should be included in the drawLanes bit
      if (config.isBusOrCycle && config.isBusOrCycle !== "none") {
        drawSpecialLanes(ctx, config, centreX, centreY, images);
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
      const enteringLanes = config.lanesEntering[`${direction.toLowerCase()}`] || 1;
      const exitingLanes = config.lanesExiting[`${direction.toLowerCase()}`] || 1;
      const hasLeftTurn = config.leftTurnLanes[`${direction.toLowerCase()}`] || false;

      // Draw lanes based on direction
      switch(direction) {
        case 'North':
          drawNorthQuarter(ctx, centreX, centreY, enteringLanes, exitingLanes, hasLeftTurn, images, busData, config.isBusOrCycle);
          break;
        case 'South':
          drawSouthLanes(ctx, centreX, centreY, enteringLanes, exitingLanes, hasLeftTurn, images, busData, config.isBusOrCycle);
          break;
        case 'East':
          drawEastLanes(ctx, centreX, centreY, enteringLanes, exitingLanes, hasLeftTurn, images, busData, config.isBusOrCycle);
          break;
        case 'West':
          drawWestLanes(ctx, centreX, centreY, enteringLanes, exitingLanes, hasLeftTurn, images, busData, config.isBusOrCycle);
          break;
        default:
          break;
      }
    });
  };
  
  // Cars coming from the north
  // TODO: Change to drawNorthQuarter() name
  const drawNorthQuarter = (ctx, centreX, centreY, entering, exiting, hasLeftTurn, images, busData, busOrBike) => {
    // TODO: Entering lane widths = ((height of box junction)/2) / number of entering lanes
    // TODO: Exiting lane widths = ((height of box junction)/2) / number of exiting lanes
    const laneWidth = 40; 
    const totalEnteringWidth = entering * laneWidth;
    const startX = centreX + (totalEnteringWidth / 2);

    // FIXME: Issue if the value is "none"
      // Not a problem: bus will only be displayed if busData.vphSpecialNorth is a value, and this is only a value if there is a buslane ticked
    const specialImg = busOrBike === "bus" ? images.busLane : images.cycleLane;
    
    // Draw lane markers
    
    // Draw directional arrows
    if (hasLeftTurn) {
      ctx.save();
      ctx.translate(centreX + 134 + 20, centreY - 274 + 50); // Translate to the center of the image
      ctx.rotate(Math.PI); // Rotate by 180 degrees
      ctx.drawImage(images.leftOnlyArrow, -20, -50, 40, 100); // Draw the image centered at the new origin
      ctx.restore();
    }

    // Draw special lanes based on direction and vph
    if (busData.vphSpecialNorth) {
      ctx.save();
      // Original image drawn at (centreX + 134, centreY - 274)
      // TODO: Eventually simplify this, keep additions for rotation logic for now
      ctx.translate(centreX + 134 + 20, centreY - 274 + 50); // Translate to the center of the image
      ctx.rotate(Math.PI); // Rotate by 180 degrees
      ctx.drawImage(specialImg, -20, -50, 40, 100); // Draw the image centered at the new origin
      ctx.restore();
    }

    // Draw straight arrows
    
    // Draw traffic light
    ctx.save();
    ctx.translate(centreX + 155, centreY - 175); // Translate to the top right corner of the box
    ctx.rotate(Math.PI); // Rotate by 180 degrees
    ctx.drawImage(images.trafficLight, -20, -40, 20, 40); // Draw the image centered at the new origin
    ctx.restore();
  };

  // Cars coming from the south
  const drawSouthLanes = (ctx, centreX, centreY, entering, exiting, hasLeftTurn, images) => {
    const laneWidth = 40;
    const totalEnteringWidth = entering * laneWidth;
    const startX = centreX - (totalEnteringWidth / 2);
    
    // Draw lane markers
    ctx.strokeStyle = 'white';
    
    for (let i = 0; i <= entering; i++) {
      const x = startX + (i * laneWidth);
      ctx.beginPath();
      ctx.moveTo(x, centreY + 175);
      ctx.lineTo(x, 600); // Use base height
      ctx.stroke();
    }
    
    // Draw directional arrows
    if (hasLeftTurn) {
      ctx.drawImage(images.leftOnlyArrow, centreX - 174, centreY + 174, 40, 100);
    }
    
    // Draw straight arrows
    const straightLanes = hasLeftTurn ? entering - 1 : entering;
    for (let i = 0; i < straightLanes; i++) {
      const x = startX + (hasLeftTurn ? laneWidth : 0) + (i * laneWidth) + 5;
      ctx.drawImage(images.straightArrow, x, centreY + 200, 30, 60);
    }
    
    // Draw traffic light
    ctx.drawImage(images.trafficLight, centreX - 175, centreY + 135, 20, 40);
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
      ctx.lineTo(800, y); // Use base width
      ctx.stroke();
    }
    
    // Draw arrows (need to rotate for west direction)
    ctx.save();
    
    if (hasLeftTurn) {
      ctx.save();
      ctx.translate(centreX + 275, centreY + 135);
      ctx.rotate(Math.PI/2);
      ctx.scale(-1, -1); // Flips image again, can be read by oncoming traffic from the east
      ctx.drawImage(images.leftOnlyArrow, -40, -100, 40, 100);
      ctx.restore();
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
    ctx.save();
    ctx.translate(centreX + 175, startY + 135);
    ctx.rotate(-Math.PI / 2);
    ctx.drawImage(images.trafficLight, -20, -40, 20, 40);
    ctx.restore();
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
      ctx.save();
      ctx.translate(centreX - 173, centreY - 175);
      ctx.rotate(-Math.PI/2);
      ctx.scale(-1, -1);
      ctx.drawImage(images.leftOnlyArrow, 0, 0, 40, 100);
      ctx.restore();
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
    ctx.save();
    ctx.translate(centreX - 95, startY - 175);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(images.trafficLight, 20, 40, 20, 40);
    ctx.restore();
  };
  
  // Draw pedestrian crossings if enabled
  const drawPedestrianCrossings = (ctx, centreX, centreY, images) => {
    // North crossing
    ctx.drawImage(images.pedestrianCrossing, centreX - 175, centreY - 197, 350, 22);

    // South crossing
    ctx.drawImage(images.pedestrianCrossing, centreX - 175, centreY + 174, 350, 22);
    
    // East crossing
    ctx.save();
    ctx.translate(centreX + 22, centreY - 160);
    ctx.rotate(Math.PI/2);
    ctx.drawImage(images.pedestrianCrossing, -15, -175, 350, 22);
    ctx.restore(); // Restores to previously saved state (used so centre of canvas is now (0,0) again)

    // West crossing
    ctx.save();
    ctx.translate(centreX - 21, centreY + 160);
    ctx.rotate(-Math.PI/2);
    ctx.drawImage(images.pedestrianCrossing, -15, -175, 350, 22);
    ctx.restore();
  };
  
  // Draw special lanes (bus/cycle)
  const drawSpecialLanes = (ctx, config, centreX, centreY, images) => {
    const { isBusOrCycle, busCycleLaneDuration } = config;
    const laneImage = isBusOrCycle === "bus" ? images.busLane : images.cycleLane;
    
    // Draw special lanes based on direction and vph
    // if (busCycleLaneDuration.vphSpecialNorth) {
    //   ctx.save();
    //   // Original image drawn at (centreX + 134, centreY - 274)
    //   // TODO: Eventually simplify this, keep additions for rotation logic for now
    //   ctx.translate(centreX + 134 + 20, centreY - 274 + 50); // Translate to the center of the image
    //   ctx.rotate(Math.PI); // Rotate by 180 degrees
    //   ctx.drawImage(laneImage, -20, -50, 40, 100); // Draw the image centered at the new origin
    //   ctx.restore();
    // }

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
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '70vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <canvas 
        ref={canvasRef} 
        width={dimensions.width} 
        height={dimensions.height} 
        style={{ 
          border: '1px solid #000', 
          backgroundColor: '#f0f0f0',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      />
    </div>
  );
};

export default JunctionCanvas;