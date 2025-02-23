import React, { useState, useEffect } from 'react';

function Weather() {
  const [weatherData, setWeatherData] = useState({
    temperature: 25,
    condition: 'Sunny',
    city: 'Hanoi',
    icon: '☀️',
    date: '',
    timeZone: '',
  });

  const getWeather = async () => {
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Hanoi&appid=your_api_key&units=metric');
    const data = await response.json();
    const date = new Date(data.dt * 1000); // Convert Unix timestamp to JavaScript Date object
    const timeZone = data.timezone / 3600; // Convert time zone offset from seconds to hours

    setWeatherData({
      temperature: data.main.temp,
      condition: data.weather[0].description,
      city: data.name,
      icon: getWeatherIcon(data.weather[0].icon),
      date: date.toLocaleDateString('en-GB'), // Format date (day/month/year)
      timeZone: timeZone >= 0 ? `UTC+${timeZone}` : `UTC${timeZone}`,
    });
  };

  const getWeatherIcon = (icon) => {
    switch(icon) {
      case '01d': return '☀️';
      case '02d': return '🌤';
      case '03d': return '🌥';
      case '04d': return '☁️';
      case '10d': return '🌧️';
      case '09d': return '🌦️';
      case '11d': return '🌩️';
      case '13d': return '❄️';
      default: return '🌈';
    }
  };

  useEffect(() => {
    getWeather();
    const interval = setInterval(() => {
      getWeather();
    }, 600000); // Refresh weather data every 10 minutes
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="flex justify-center items-center w-2/3 bg-slate-100">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
        <h1 className="text-3xl font-semibold text-gray-700 mb-4">{weatherData.city}</h1>
        <div className="text-6xl mb-4">{weatherData.icon}</div>
        <div className="text-4xl text-orange-500 mb-2">
          <h2>{weatherData.temperature}°C</h2>
        </div>
        <p className="text-lg text-gray-500 mb-4">{weatherData.condition}</p>
        
        {/* Date and Time */}
        <div className="text-sm text-gray-600 mb-4">
          <p>{weatherData.date}</p>
          <p>{new Date().toLocaleTimeString()}</p> {/* Current local time */}
          <p className="text-sm text-gray-500">Timezone: {weatherData.timeZone}</p>
        </div>

        <button 
          onClick={getWeather} 
          className="bg-orange-500 text-white px-6 py-2 rounded-full text-lg hover:bg-orange-600 focus:outline-none">
          Refresh
        </button>
      </div>
    </div>
  );
}

export default Weather;
