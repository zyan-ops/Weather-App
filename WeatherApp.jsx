  import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Filler
  } from "chart.js";
  import { Line } from "react-chartjs-2";
  import { useState, useEffect } from "react";

  ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Filler,
  );


    
  function Weather() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);

    const APIKEY = "";

    
    useEffect(() => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKEY}&units=metric`
          );
          const data = await res.json();
          setWeather(data);

          const res2 = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${APIKEY}&units=metric`
          );
          const data2 = await res2.json();
          setForecast(data2.list);
        },
        (err) => {
          console.log("Location denied ❌");
        }
      );
    }, []);

    const fetchWeather = async () => {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod !== 200) return alert("City not found");
      setWeather(data);
    };

    const fetchForecast = async () => {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod === "200") setForecast(data.list);
    };

    const handleSearch = () => {
      if (!city) return;
      fetchWeather();
      fetchForecast();
    };

    const getIcon = (icon) =>
      `https://openweathermap.org/img/wn/${icon}@2x.png`;

    
    const getDailyForecast = (list) => {
      const daily = {};
      list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!daily[date]) daily[date] = item;
      });
      return Object.values(daily);
    };

    
    const ChartData = () => {
      if (!forecast.length) return { labels: [], temp: [] };

      const data = forecast.slice(0, 8);

      return {
        labels: data.map((i) => i.dt_txt.split(" ")[1].slice(0, 5)),
        temp: data.map((i) => i.main.temp)
      };
    };

    const chart = ChartData();

    const chartConfig = {
      labels: chart.labels,
      datasets: [
        {
          data: chart.temp,
          borderColor: "#facc15",
          backgroundColor: "rgba(250,204,21,0.2)",
          fill: true,
          tension: 0.4,
          borderWidth: 3
        }
      ]
    };
    

    return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">

      <div className="relative w-[630px] bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[30px] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.7)] overflow-hidden">

        
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-blue-500/10" />

        <div className="relative z-10">

         
          <h1 className="text-2xl font-semibold mb-6 tracking-wide">
            Weather App
          </h1>

         
          <div className="flex gap-3 mb-6">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search city..."
              className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-yellow-400 text-black rounded-xl font-semibold"
            >
              Search
            </button>
          </div>

         
          {!weather ? (
            <p className="text-gray-400 text-center">
              Search a city or allow location 📍
            </p>
          ) : (
            <>
              {/* TOP */}
              <div className="flex justify-between items-start">

                {/* LEFT */}
                <div>
                  <h2 className="text-lg text-gray-300">
                    {weather.name}
                  </h2>

                  <div className="flex items-center gap-4 mt-2">
                    <h1 className="text-7xl font-light text-yellow-400">
                      {Math.round(weather.main.temp)}°
                    </h1>

                    <img
                      src={getIcon(weather.weather[0].icon)}
                      className="w-20 h-20"
                    />
                  </div>

                  <p className="text-gray-400 mt-2 text-lg">
                    {weather.weather[0].main}
                  </p>

                  <div className="mt-6 flex gap-6 text-sm text-gray-300">
                    <span>💧 {weather.main.humidity}%</span>
                    <span>💨 {weather.wind.speed} km/h</span>
                  </div>
                </div>

               
                {forecast.length > 0 && (
                  <div className="w-[350px] h-[180px]">
                    <h3>Temperature</h3>
                    <Line
                      data={chartConfig}
                      options={{
                        plugins: { legend: { display: false } },
                        elements: { point: { radius: 0 } },
                        scales: {
                          x: { display: false },
                          y: { display: false }
                        }
                      }}
                    />
                  </div>
                )}

              </div>

              
              <div className="my-6 h-px bg-white/10" /> 

              
              {forecast.length > 0 && (
                <div className="flex gap-4 overflow-x-auto">
                  {getDailyForecast(forecast).map((item, i) => (
                    <div key={i} className="bg-white/5 p-3 rounded-xl min-w-[80px] text-center">
                      <p className="text-xs text-gray-400">
                        {item.dt_txt.split(" ")[0].slice(5)}
                      </p>
                      <img src={getIcon(item.weather[0].icon)} className="w-10 mx-auto" />
                      <p>{Math.round(item.main.temp)}°</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>

    </div>
  );
  }

  export default Weather;