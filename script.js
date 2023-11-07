const cityName = document.getElementById('cityName')
let cityId;
const searchBtn = document.getElementById('searchBtn')

cityName.value = 'pune'
handleSearch('pune')

async function handleSearch(city) {
    console.log(city);

    const url = `https://foreca-weather.p.rapidapi.com/location/search/${city}?lang=en&country=in`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'a966fb770amsha6bf497507a49d5p19d327jsn7e6a369d7d0c',
            'X-RapidAPI-Host': 'foreca-weather.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        cityId = result.locations[0].id
        getCurrentWeather(cityId)
        getWeatherByThreeHourly(cityId)
        getUpcomingDaysWeather(cityId)
    } catch (error) {
        console.error(error);
    }
}
const getCurrentWeather = async (id) => {
    const url = `https://foreca-weather.p.rapidapi.com/current/${id}?alt=0&tempunit=C&windunit=MS&tz=Europe%2FLondon&lang=en`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'a966fb770amsha6bf497507a49d5p19d327jsn7e6a369d7d0c',
            'X-RapidAPI-Host': 'foreca-weather.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        document.getElementById('temperature').innerHTML = result.current.feelsLikeTemp + '&deg;'
        document.getElementById('chances_of_rain').innerHTML = result.current.symbolPhrase

        /* changing icon according to response */
        if (result.current.symbolPhrase === "partly cloudy") {
            document.getElementById('main_weather_icon').innerHTML = '<i class="fa-solid fa-cloud-sun "></i>'
        }
        else if (result.current.symbolPhrase === "cloudy") {
            document.getElementById('main_weather_icon').innerHTML = '<i class="fa-solid fa-cloud"></i>'
        }
        else if (result.current.symbolPhrase === "clear") {
            document.getElementById('main_weather_icon').innerHTML = '<i class="fa-solid fa-sun" style="color: #f07b3d;"></i>'
        }
        else {
            document.getElementById('main_weather_icon').innerHTML = '<i class="fa-solid fa-sun" style="color: #f07b3d;"></i>'
        }

        /* changing air conditions data */
        document.getElementById('real_feel_num_data').innerHTML = result.current.feelsLikeTemp
        document.getElementById('humidity').innerHTML = result.current.relHumidity + '%'
        console.log(result);
        document.getElementById('windDirection').innerHTML = result.current.windDirString
        console.log(result);
        document.getElementById('windSpeed').innerHTML = result.current.windSpeed + 'km/hr'
        document.getElementById('weatherCondition').innerHTML = result.current.symbolPhrase

    } catch (error) {
        console.error(error);
    }
}
const getWeatherByThreeHourly = async (id) => {
    const url = `https://foreca-weather.p.rapidapi.com/forecast/3hourly/${id}?alt=0&tempunit=C&windunit=MS&tz=Europe%2FLondon&periods=8&dataset=full&history=0`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'a966fb770amsha6bf497507a49d5p19d327jsn7e6a369d7d0c',
            'X-RapidAPI-Host': 'foreca-weather.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        document.getElementById('hourly_weather').innerHTML = ""
        document.getElementById('city').innerHTML = cityName.value

        /* changing innerhtml with data */
        result.forecast.map((elem, i, arr) => {
            document.getElementById('hourly_weather').innerHTML += `<div class="forecast_data_hourly">
            <div class="forecast_time">${elem?.time?.slice(-6, -1)}</div>
            <div class="forecast_icon"> ${elem.symbolPhrase === 'clear' ? '<i class="fa-solid fa-sun" style="color: #f07b3d;"></i>' : elem.symbolPhrase === 'cloudy' ? '<i class="fa-solid fa-cloud"></i>' : elem.symbolPhrase === 'partly cloudy' ? '<i class="fa-solid fa-cloud-sun "></i>' : '<i class="fa-solid fa-sun" style="color: #f07b3d;"></i>'}</div>
            <div class="forecast_temp">${elem?.feelsLikeTemp}&deg;</div>
        </div>${i == arr.length - 1 ? '' : '<div class="verticle_line"></div>'}
        `
        })

    } catch (error) {
        console.error(error);
    }
}
async function getUpcomingDaysWeather(id) {
    const url = `https://foreca-weather.p.rapidapi.com/forecast/daily/${id}?alt=0&tempunit=C&windunit=MS&periods=8&dataset=full`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '79c6b4dd17msh99173bc8048d9b6p1aba9bjsn473741998611',
            'X-RapidAPI-Host': 'foreca-weather.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        document.getElementById('upcomingDays').innerHTML=""
        result.forecast.map((elem,i,arr)=>{document.getElementById('upcomingDays').innerHTML+=` <div class="wrapper">
        <div class="flex_wrapper">
            <div class="day">${new Date(elem.date).toString().slice(0,3)}</div>
            <div class="condition"> <span> ${elem.symbolPhrase === 'clear' ? '<i class="fa-solid fa-sun" style="color: #f07b3d;"></i>' : elem.symbolPhrase === 'cloudy' ? '<i class="fa-solid fa-cloud"></i>' : elem.symbolPhrase === 'partly cloudy' ? '<i class="fa-solid fa-cloud-sun "></i>' : '<i class="fa-solid fa-sun" style="color: #f07b3d;"></i>'}</span>
                <span>${elem.symbolPhrase}</span></div>
            <div class="temp">${elem.maxTemp+'/'+elem.minTemp}</div>
        </div>
        ${i == arr.length - 1 ? '' : '<div class="horizontal_divider"></div>'}
        
    </div>`})
        
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}
searchBtn.addEventListener('click', () => handleSearch(cityName.value))