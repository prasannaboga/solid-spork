import { useState, useEffect } from 'react'
import axios from 'axios';
import './App.css'
import LocationDisplay from './components/LocationDisplay.jsx';
import PlaceDisplay from './components/PlaceDisplay.jsx';
import WeatherInfo from './components/WeatherInfo.jsx';
import ForecastTrends from './components/ForecastTrends.jsx';
import ForecastGraph from './components/ForecastGraph.jsx';
import { getWeatherEmoji } from './utils/weatherUtils';

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
    document.title = 'Weather Updates';
    document.body.style.background = themes[theme].background;
    document.body.style.color = themes[theme].color;
  }, [theme]);

  return (
    <div
      className="weather-container min-h-screen w-full flex flex-col items-center justify-start bg-cover bg-no-repeat px-2 md:px-0"
      style={{
        background: themes[theme].background,
        color: themes[theme].color,
        transition: 'background 0.3s, color 0.3s',
        position: 'relative',
      }}
    >
      <div className="w-full max-w-4xl mx-auto mt-4 md:mt-10 p-4 md:p-8 rounded-xl shadow-lg bg-white/80 dark:bg-gray-900/80 relative z-10">
        <div className="flex flex-row justify-between items-center mb-6 gap-4">
          <div className="flex-1 flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">Weather Updates</h1>
            {place && !loading && !error && (
              <div className="mb-2 text-center font-semibold text-lg">
                <span className="text-blue-600">{place.city}</span>
                {place.city && place.state && ', '}
                <span className="text-green-600">{place.state}</span>
                {((place.city || place.state) && place.country) && ', '}
                <span className="text-purple-500">{place.country}</span>
              </div>
            )}
            {location && !loading && !error && (
              <div className="mb-4 text-center text-sm text-gray-700">
                Coordinates: <span className="font-mono">{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 absolute right-4 top-4 md:static md:relative md:right-0 md:top-0">
            <label htmlFor="theme-select" className="font-medium">Theme:</label>
            <select id="theme-select" value={theme} onChange={e => setTheme(e.target.value)} className="rounded border px-2 py-1">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="blue">Blue</option>
            </select>
          </div>
        </div>
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {weather && !loading && !error && (
          <div className="flex flex-col md:flex-row gap-6 justify-center items-start w-full mb-6">
            <div className="flex-1 min-w-[260px]">
              <WeatherInfo weather={weather.current} theme={theme} themes={themes} />
            </div>
            <div className="flex-1 min-w-[260px]">
              <ForecastTrends daily={weather.daily} theme={theme} themes={themes} />
            </div>
          </div>
        )}
        {weather && !loading && !error && (
          <ForecastGraph daily={weather.daily} theme={theme} themes={themes} />
        )}
      </div>
    </div>
  )
}

export default App
