import { useCallback, useEffect, useRef, useState } from "react"

import WeatherForecast from "./WeatherForecast"
import WeatherToday from "./WeatherToday"
import { fetchPlace } from "../mapbox/fetchplace"
import axios from "axios"

const Weather = () => {
  // const variable array to save the users location
  const [userLocation, setUserLocation] = useState(null)
  const [emptyLocation, setEmptyLocation] = useState(true)
  const [loadedGeolocation, setLoadedGeolocation] = useState(false)
  const [userCity, setUserCity] = useState(null)

  const [city, setCity] = useState("")
  const [autocompleteCities, setAutocompleteCities] = useState([])
  const [autocompleteErr, setAutocompleteErr] = useState("")

  const inputRef = useRef(null)
  const [weatherData, setWeatherData] = useState(null)
  const [weatherForecast, setWeatherForecast] = useState(null)

  // define the function that finds the users geolocation
  const getUserLocation = () => {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // save the geolocation coordinates in two variables
          const { latitude, longitude } = position.coords
          // update the value of userlocation variable
          setUserLocation({ latitude, longitude })
          setEmptyLocation(false)
        },
        // if there was an error getting the users location
        (error) => {
          console.error("Error getting user location:", error)
        }
      )
    }
    // if geolocation is not supported by the users browser
    else {
      console.error("Geolocation is not supported by this browser.")
    }
  }

  // openweather api requests
  const fetchData = useCallback(async () => {
    try {
      if (userCity === null) {
        if (userLocation !== null) {
          if (loadedGeolocation) return
          setLoadedGeolocation(true)
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&units=metric&appid=28fe031716e55a064151397a02026387`
          )
          const responseForecast = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${userLocation.latitude}&lon=${userLocation.longitude}&units=metric&appid=28fe031716e55a064151397a02026387`
          )
          setWeatherData(response.data)
          setWeatherForecast(responseForecast.data)

          console.log(response.data)
        }
      } else {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&units=metric&appid=28fe031716e55a064151397a02026387`
        )
        const responseForecast = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${userCity}&units=metric&appid=28fe031716e55a064151397a02026387`
        )
        setWeatherForecast(responseForecast.data)
        setWeatherData(response.data)
        console.log(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }, [userCity, userLocation, loadedGeolocation])

  // update user's city
  const submitCity = useCallback(() => {
    const inputText = inputRef.current.value.trim()
    if (inputText === "") {
      return
    }
    setUserCity(inputText)
    setEmptyLocation(false)
    console.log(userCity)
    fetchData()
    inputRef.current.value = ""
  }, [fetchData, userCity])

  // get current date
  function currentTime(timezoneIn, dtIn) {
    let dateTime = new Date(dtIn * 1000 + timezoneIn * 1000)

    let weekday = dateTime.toLocaleString("default", { weekday: "long" })
    let month = dateTime.toLocaleString("default", { month: "short" })
    let date = dateTime.getDate()

    return `${weekday.substring(0, 3)}, ${month} ${date}`
  }

  // Triggering user location on page load
  useEffect(() => {
    if (!loadedGeolocation) {
      let ignore = false
      if (!ignore) getUserLocation()
      return () => {
        ignore = true
        fetchData()
      }
    }
  }, [fetchData, loadedGeolocation])

  useEffect(() => {
    submitCity()
  }, [submitCity])

  // fetch place
  const handleCityChange = async (e) => {
    setCity(e.target.value)
    if (!city) return

    const res = await fetchPlace(city)
    !autocompleteCities.includes(e.target.value) &&
      res.features &&
      setAutocompleteCities(res.features.map((place) => place.place_name))
    res.error ? setAutocompleteErr(res.error) : setAutocompleteErr("")
  }

  return (
    <div className='bg-white place-self-center w-full max-w-xs sm:max-w-md md:w-11/12 flex flex-col p-7 min-h-[200px] max-h-fit rounded-xl shadow-none md:shadow-2xl text-sky-900'>
      <h1 className='text-xl md:text-2xl font-bold text-sky-900'>
        ☂️ Goto Weather
      </h1>

      <div className='flex items-center mt-5 mb-4 bg-slate-200 rounded-xl shadow-inner'>
        <input
          ref={inputRef}
          className='bg-transparent border-0 outline-none flex-1 h-8 sm:h-11 pl-6 pr-2 placeholder:text-slate-600 text-md sm:text-lg'
          type='text'
          placeholder='Search location...'
          list='places'
          id='city'
          name='city'
          onChange={handleCityChange}
          value={city}
          required
          pattern={autocompleteCities.join("|")}
          autoComplete='off'
        />
        <datalist id='places'>
          {autocompleteCities.map((city, i) => (
            <option key={i}>{city}</option>
          ))}
        </datalist>

        <button
          onClick={submitCity}
          className='border-none rounded-xl bg-teal-400 w-16 h-8 sm:h-11 text-white text-xl font-medium cursor-pointer shadow-inner'
        >
          🔍
        </button>
      </div>

      {emptyLocation ? (
        <p className='italic'>
          Allow access to your location, or type in a city.
        </p>
      ) : (
        <>
          {weatherData ? (
            <>
              <WeatherToday
                cityName={weatherData.name.toString()}
                date={currentTime(weatherData.timezone, weatherData.dt)}
                temperatureNow={Math.round(weatherData.main.temp)}
                feelsLike={Math.round(weatherData.main.feels_like)}
                description={weatherData.weather[0].description}
                windSpeed={Math.round(weatherData.wind.speed * 3.6)}
                humidity={weatherData.main.humidity}
                weatherIcon={weatherData.weather[0].icon}
              />

              <div className='flex items-center justify-between mt-4'>
                <WeatherForecast
                  date={weatherForecast.list[8].dt_txt}
                  weatherIcon={weatherForecast.list[8].weather[0].icon}
                  description={weatherForecast.list[8].weather[0].description}
                  temperature={Math.round(weatherForecast.list[8].main.temp)}
                />
                <WeatherForecast
                  date={weatherForecast.list[16].dt_txt}
                  weatherIcon={weatherForecast.list[16].weather[0].icon}
                  description={weatherForecast.list[16].weather[0].description}
                  temperature={Math.round(weatherForecast.list[16].main.temp)}
                />
                <WeatherForecast
                  date={weatherForecast.list[24].dt_txt}
                  weatherIcon={weatherForecast.list[24].weather[0].icon}
                  description={weatherForecast.list[24].weather[0].description}
                  temperature={Math.round(weatherForecast.list[24].main.temp)}
                />
              </div>
            </>
          ) : (
            <p className='flex items-center justify-center gap-2'>
              {/* <img
                src='../assets/loader.svg'
                alt='loading'
                className='opacity-50 max-w-6 pt-1'
              /> */}
              Loading weather data...
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default Weather
