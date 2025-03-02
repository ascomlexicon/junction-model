import React from 'react';

const JSONViewer = ({ data }) => {
  return (
    <div className="json-viewer">
      <h3>Current JSON Data</h3>
      <pre
        style={{
          backgroundColor: '#f5f5f5',
          padding: '1rem',
          borderRadius: '4px',
          maxHeight: '400px',
          overflow: 'auto',
          fontSize: '14px',
          border: '1px solid #ddd'
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default JSONViewer;