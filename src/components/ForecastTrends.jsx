import React from 'react';
import { getWeatherEmoji } from '../utils/weatherUtils';

const ForecastTrends = ({ daily, theme, themes }) => {
  if (!daily || !daily.time) return null;
  return (
    <div style={{
      marginTop: '2rem',
      background: themes[theme].card,
      border: `1px solid ${themes[theme].border}`,
      borderRadius: '8px',
      padding: '1rem',
      maxWidth: '420px',
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      <h2 style={{marginBottom: '1rem'}}>Next 3 Days Forecast</h2>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {daily.time.slice(1, 4).map((date, idx) => (
          <div key={date} style={{
            background: themes[theme].background,
            color: themes[theme].color,
            border: `1px solid ${themes[theme].border}`,
            borderRadius: '6px',
            padding: '0.75rem',
            minWidth: '100px',
            textAlign: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontWeight: 600 }}>{new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            <div style={{ fontSize: '2rem', margin: '0.5em 0' }}>{getWeatherEmoji(daily.weathercode[idx+1])}</div>
            <div style={{ fontSize: '1.2em', margin: '0.5em 0' }}>
              {daily.temperature_2m_max[idx+1]}° / {daily.temperature_2m_min[idx+1]}°C
            </div>
            <div style={{ fontSize: '0.9em', color: themes[theme].color, opacity: 0.7 }}>
              Code: {daily.weathercode[idx+1]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastTrends;
