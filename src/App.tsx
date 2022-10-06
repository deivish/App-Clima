import { FormEvent, useEffect, useState } from "react";
import { getWaetherByCoords, getWeatherBySearch } from "./api/fetchWeather";
import { SearchBox } from "./components/SearchBox";
import { WeatherContainer } from "./components/WeatherContainer";

function App() {
  const [fetchedData, setFetchedData] = useState(null);
  const [error, setError] = useState("");

  // Conexión al API Datos
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const LAT = position.coords.latitude;
      const LON = position.coords.longitude;

      try {
        const data = await getWaetherByCoords(LAT, LON);
        setFetchedData(data);
      } catch (err) {
        setError("Por favor revise su conexion a internet 💻");
      }
    });
  }, []);

  // Buscador
  const handleSearch = async (e: FormEvent<HTMLFormElement>, CITY: string) => {
    e.preventDefault();
    setError("");

    try {
      const data = await getWeatherBySearch(CITY);

      if (data.cod === "404") {
        setError("Ciudad no encontrada 🌦️");
      } else if (data.cod === "400") {
        setError( "🌦️ Por favor ingrese una ciudad.");
      } else {
        setFetchedData(data);
      }
    } catch (err) {
      setError(
        "🌦️ Asegúrate de escribir una ciudad o revisar la conexión a Internet."
      );
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <SearchBox handleSearch={handleSearch} />
      <WeatherContainer fetchedData={fetchedData} error={error} />
      <p>Soy un cambio con CI</p>
    </div>
  );
}

export default App;
