// Utility for weather emoji
export const getWeatherEmoji = (weatherCode) => {
  if (weatherCode === undefined || weatherCode === null) return '';
  if ([0, 1].includes(weatherCode)) return '☀️'; // Clear
  if ([2, 3].includes(weatherCode)) return '⛅️'; // Partly cloudy
  if ([45, 48].includes(weatherCode)) return '🌫️'; // Fog
  if ([51, 53, 55, 56, 57].includes(weatherCode)) return '🌦️'; // Drizzle
  if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) return '🌧️'; // Rain
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return '❄️'; // Snow
  if ([95, 96, 99].includes(weatherCode)) return '⛈️'; // Thunderstorm
  return '🌡️'; // Default
};
