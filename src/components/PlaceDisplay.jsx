import React from 'react';

const PlaceDisplay = ({ place }) => {
  if (!place) return null;
  return (
    <div style={{
      margin: '0.5rem auto',
      maxWidth: 420,
      textAlign: 'center',
      fontWeight: 600,
      fontSize: '1.1em',
    }}>
      {place.city && <span style={{color: '#1976d2'}}>{place.city}, </span>}
      {place.state && <span style={{color: '#1db954'}}>{place.state}, </span>}
      {place.country && <span style={{color: '#a259e6'}}>{place.country}</span>}
    </div>
  );
};

export default PlaceDisplay;
