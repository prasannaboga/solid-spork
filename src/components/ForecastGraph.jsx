import React from 'react';
import { Line } from 'react-chartjs-2';

const ForecastGraph = ({ daily, theme, themes }) => {
  if (!daily || !daily.time) return null;
  return (
    <div style={{
      marginTop: '2.5rem',
      background: themes[theme].card,
      border: `1px solid ${themes[theme].border}`,
      borderRadius: '8px',
      padding: '1.5rem',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      <h2 style={{marginBottom: '1rem'}}>Forecast Graph</h2>
      <Line
        data={{
          labels: daily.time.map(date => new Date(date).toLocaleDateString()),
          datasets: [
            {
              label: 'Max Temp (°C)',
              data: daily.temperature_2m_max,
              borderColor: '#e61e1e',
              backgroundColor: 'rgba(230,30,30,0.2)',
              tension: 0.3,
              fill: true,
            },
            {
              label: 'Min Temp (°C)',
              data: daily.temperature_2m_min,
              borderColor: '#1976d2',
              backgroundColor: 'rgba(25,118,210,0.2)',
              tension: 0.3,
              fill: true,
            }
          ]
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Temperature (°C)' }
            },
            x: {
              title: { display: true, text: 'Date' }
            }
          }
        }}
        height={300}
      />
    </div>
  );
};

export default ForecastGraph;
