import React from 'react';

const LocationDisplay = ({ location }) => {
  if (!location) return null;
  return (
    <div style={{
      margin: '1rem auto',
      maxWidth: 420,
      textAlign: 'center',
      fontWeight: 600,
      fontSize: '1.1em',
      color: 'rgb(230, 30, 30)',
      background: 'linear-gradient(90deg, #e61e1e 90%, #1ee64a 5%, #e6d81e 2%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}>
      Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
    </div>
  );
};

export default LocationDisplay;
