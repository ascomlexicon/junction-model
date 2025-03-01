{/* TODO: DELETE THIS, WAS FOR TESTING PURPOSES, HOWEVER NOTE HOW THE JUNCTION IS VISUALISED AGAIN USING SRC OF IMG TAG */}
import React from 'react';

const ImageRenderer = ({ imageData }) => {
  return (
    <div className="image-renderer">
      <h3>Stored Junction Image Preview</h3>
      {imageData ? (
        <img 
          src={imageData} 
          alt="Rendered Junction" 
          style={{ 
            maxWidth: '100%', 
            border: '1px solid #ccc',
            borderRadius: '4px'
          }} 
        />
      ) : (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f5f5f5', 
          border: '1px solid #ccc',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          No image data available
        </div>
      )}
    </div>
  );
};

export default ImageRenderer;