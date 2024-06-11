const API_KEY = '0754ac20997b6d8137a35fd52ec5b3dc';

const form = document.querySelector('#form');
const input = document.querySelector('.form__input');

form.onsubmit = submitHandler;

async function submitHandler (e) {
	e.preventDefault();

	if (!input.value.trim()) {
		console.log('Enter city name');
		return
	}

	const cityName = input.value.trim() 
	input.value = ''


	const cityInfo = await getGeo(cityName)

	if (!cityInfo.length) return


	const weatherInfo = await getWeather (
		cityInfo[0]['lat'],
		cityInfo[0]['lon']
	);

	console.log(weatherInfo.name);
	console.log(weatherInfo.weather[0]['main']);


	const weatherData = {
		name: weatherInfo.name,
		temp: weatherInfo.main.temp,
		humidity: weatherInfo.main.humidity,
		speed: weatherInfo.wind.speed,
		main: weatherInfo.weather[0]['main']
	};

	renderWeatherData(weatherData);
}

async function getGeo (name) {
	const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_KEY}`
	const response = await fetch(geoUrl);
	const data = await response.json();
	return data;
}

async function getWeather (lat, lon) {
	const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`
	const response = await fetch(weatherUrl);
	const data = await response.json();
	return data;
}

function renderWeatherData (data) {
	// Info block show
	document.querySelector('.weather__info').classList.remove('none');
	document.querySelector('.weather__details').classList.remove('none');

	// Weather data
	const temp = document.querySelector('.weather__temp');
	const city = document.querySelector('.weather__city');
	const humidity = document.querySelector('#humidity');
	const speed = document.querySelector('#speed');
	const img = document.querySelector('.weather__img');

	temp.innerText = Math.round(data.temp) + '°c';
	city.innerText = data.name;
	humidity.innerText = data.humidity + '%';
	speed.innerText = data.speed + 'km/h';

	const fileNames = {
		'Clouds': 'clouds',
		'Clear': 'clear',
		'Rain': 'rain',
		'Mist': 'mist',
		'Drizzle': 'drizzle',
		'Snow': 'snow'
	}

	if (fileNames[data.main]) {
			img.src = `./img/weather/${fileNames[data.main]}.svg`
	}

}
