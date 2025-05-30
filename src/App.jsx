import { useState, useEffect } from 'react'
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './App.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const themes = {
  light: {
    background: '#f5f5f5',
    color: '#222',
    card: '#fff',
    border: '#ddd',
  },
  dark: {
    background: '#222',
    color: '#f5f5f5',
    card: '#333',
    border: '#444',
  },
  blue: {
    background: '#e3f0ff',
    color: '#003366',
    card: '#cce0ff',
    border: '#99c2ff',
  },
};

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('light');
  const [location, setLocation] = useState(null);
  const [place, setPlace] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        // Fetch both current and 3-day forecast
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=4&timezone=auto`)
          .then((res) => res.json())
          .then((data) => {
            setWeather({
              current: data.current_weather,
              daily: data.daily
            });
            setLoading(false);
          })
          .catch(() => {
            setError('Failed to fetch weather data.');
            setLoading(false);
          });
        // Reverse geocoding for city, state, country
        axios.get(`https://nominatim.openstreetmap.org/reverse`, {
          params: {
            lat: latitude,
            lon: longitude,
            format: 'json',
            addressdetails: 1
          }
        })
        .then(res => {
          const address = res.data.address;
          setPlace({
            city: address.city || address.town || address.village || '',
            state: address.state || '',
            country: address.country || ''
          });
        })
        .catch(() => setPlace(null));
      },
      () => {
        setError('Unable to retrieve your location.');
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    document.body.style.background = themes[theme].background;
    document.body.style.color = themes[theme].color;
  }, [theme]);

  return (
    <div
      className="weather-container"
      style={{
        background: themes[theme].background,
        color: themes[theme].color,
        minHeight: '100vh',
        padding: '2rem',
        transition: 'background 0.3s, color 0.3s',
        position: 'relative',
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <label htmlFor="theme-select" style={{ marginRight: '0.5rem' }}>Theme:</label>
          <select id="theme-select" value={theme} onChange={e => setTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="blue">Blue</option>
          </select>
        </div>
        <h1>Weather Updates</h1>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {weather && !loading && !error && (
          <>
          <div className="weather-info" style={{
            background: themes[theme].card,
            border: `1px solid ${themes[theme].border}`,
            borderRadius: '8px',
            padding: '1rem',
            maxWidth: '320px',
            margin: '0 auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <p><strong>Temperature:</strong> {weather.current.temperature}°C</p>
            <p><strong>Wind Speed:</strong> {weather.current.windspeed} km/h</p>
            <p><strong>Weather Code:</strong> {weather.current.weathercode}</p>
          </div>
          {/* 3-day forecast trends */}
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
              {weather.daily && weather.daily.time && weather.daily.time.slice(1, 4).map((date, idx) => (
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
                  <div style={{ fontSize: '1.2em', margin: '0.5em 0' }}>
                    {weather.daily.temperature_2m_max[idx+1]}° / {weather.daily.temperature_2m_min[idx+1]}°C
                  </div>
                  <div style={{ fontSize: '0.9em', color: themes[theme].color, opacity: 0.7 }}>
                    Code: {weather.daily.weathercode[idx+1]}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Forecast graph */}
          {weather && weather.daily && weather.daily.time && (
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
              labels: weather.daily.time.map(date => new Date(date).toLocaleDateString()),
              datasets: [
                {
                  label: 'Max Temp (°C)',
                  data: weather.daily.temperature_2m_max,
                  borderColor: '#e61e1e',
                  backgroundColor: 'rgba(230,30,30,0.2)',
                  tension: 0.3,
                  fill: true,
                },
                {
                  label: 'Min Temp (°C)',
                  data: weather.daily.temperature_2m_min,
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
      )}
          </>
        )}
        {location && !loading && !error && (
          <div style={{
            margin: '1rem auto',
            maxWidth: 420,
            textAlign: 'center',
            fontWeight: 600,
            fontSize: '1.1em',
            color: 'rgb(230, 30, 30)', // 90% red
            background: 'linear-gradient(90deg, #e61e1e 90%, #1ee64a 5%, #e6d81e 2%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </div>
        )}
        {place && !loading && !error && (
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
        )}
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App
