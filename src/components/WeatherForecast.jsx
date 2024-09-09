import PropTypes from "prop-types"

// capitalize description
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const WeatherForecast = (props) => {
  return (
    <div className='w-[80px] sm:w-[120px] h-[150px] sm:h-[120px] flex flex-col items-center justify-between text-center text-sky-700 shadow-inner bg-gradient-to-bl  from-sky-100 from-15% to-sky-200 to-90% rounded-xl py-3 sm:py-1'>
      <p className='text-sm'>
        {props.date.slice(8, 10) + "/" + props.date.slice(5, 7)}
      </p>
      <img
        className='sm:w-11 sm:h-11 w-9 h-9 drop-shadow-md brightness-125 '
        src={
          "http://openweathermap.org/img/wn/" + props.weatherIcon + "@2x.png"
        }
        alt='🌧️'
      />
      <p className='text-xs sm:max-w-[120px] max-w-[60px]'>
        {capitalizeFirstLetter(props.description)}
      </p>
      <p className='text-xl font-semibold'>{props.temperature}°C</p>
    </div>
  )
}

WeatherForecast.propTypes = {
  date: PropTypes.string.isRequired,
  weatherIcon: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  temperature: PropTypes.number.isRequired,
}

export default WeatherForecast
