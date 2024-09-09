import PropTypes from "prop-types"

// capitalize description
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const WeatherToday = (props) => {
  return (
    <div className='flex items-center justify-between bg-gradient-to-bl  from-sky-100 from-15% to-emerald-200 to-90% rounded-xl shadow-inner'>
      <div className='flex flex-col gap-y-2 pl-6 py-4'>
        <div>
          <h2 className='text-xl font-semibold'>{props.cityName}</h2>
          <p className='text-sm text-teal-600'>{props.date}</p>
        </div>

        <div className='py-2 border-0 border-solid border-t border-white'>
          <p className='text-5xl font-semibold'>{props.temperatureNow}°C</p>
          <p className='text-sm text-teal-700'>
            Feels like {props.feelsLike}°C
          </p>
          <div className='grid items-center gap-x-1 grid-flow-col mt-1'>
            <img
              src={
                "https://cors-anywhere.herokuapp.com/http://openweathermap.org/img/wn/" +
                props.weatherIcon +
                "@2x.png"
              }
              alt='🌧️'
              className='w-8 h-8 drop-shadow-md brightness-125'
            />
            <p className='text-sm text-teal-700'>
              {capitalizeFirstLetter(props.description)}
            </p>
          </div>
        </div>

        <div className='py-2 border-0 border-solid border-t border-white text-sm text-teal-700'>
          <p>Wind: {props.windSpeed}km/h</p>
          <p>Humidity: {props.humidity}%</p>
        </div>
      </div>
      <div className='flex items-center grow'>
        <img
          className='mx-auto w-48 drop-shadow-xl brightness-125'
          src={
            "https://cors-anywhere.herokuapp.com/http://openweathermap.org/img/wn/" + props.weatherIcon + "@4x.png"
          }
          alt='🌧️'
        />
      </div>
    </div>
  )
}

WeatherToday.propTypes = {
  cityName: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  temperatureNow: PropTypes.number.isRequired,
  feelsLike: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  windSpeed: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
  weatherIcon: PropTypes.string.isRequired,
}

export default WeatherToday
