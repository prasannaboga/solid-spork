import React from 'react';
import { getWeatherEmoji } from '../utils/weatherUtils';

const WeatherInfo = ({ weather, theme, themes }) => {
  if (!weather) return null;
  return (
    <div className="weather-info" style={{
      background: themes[theme].card,
      border: `1px solid ${themes[theme].border}`,
      borderRadius: '8px',
      padding: '1rem',
      maxWidth: '320px',
      margin: '0 auto',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <p style={{fontSize: '2rem', margin: 0}}>{getWeatherEmoji(weather.weathercode)}</p>
      <p><strong>Temperature:</strong> {weather.temperature}°C</p>
      <p><strong>Wind Speed:</strong> {weather.windspeed} km/h</p>
      <p><strong>Weather Code:</strong> {weather.weathercode}</p>
    </div>
  );
};

export default WeatherInfo;
