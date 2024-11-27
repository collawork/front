import React, { useState, useEffect } from "react";
import axios from "axios";
import "../components/assest/css/WeatherBackground.css";
import clear from '../components/assest/videos/clear.mp4';
import cloud1 from '../components/assest/videos/cloud1.mp4';
import cloud2 from '../components/assest/videos/cloud2.mp4';
import cloud3 from '../components/assest/videos/cloud3.mp4';
import rain from '../components/assest/videos/rainy.mp4';
import snow from '../components/assest/videos/snowy.mp4';
import sunny from '../components/assest/videos/sunny.mp4';
import sunrise from '../components/assest/videos/sunrise.mp4';
import sunset from '../components/assest/videos/sunset.mp4';
import thunderstorm from '../components/assest/videos/thunder.mp4';
import night from '../components/assest/videos/night.mp4';

const WeatherBackground = ({ setWeatherData = () => {} }) => {
    const [weather, setWeather] = useState(null);
    const [videoSrc, setVideoSrc] = useState("");

    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    // 날씨와 동영상 매핑
    const videoMap = {
        clear: clear,
        clouds: [cloud2, cloud3], //cloud1 이거 좀 밤 하늘같음
        rain: rain,
        snow: snow,
        sunny: sunny,
        sunrise: sunrise,
        sunset: sunset,
        thunderstorm: thunderstorm,
        night: night,
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    await fetchWeather(latitude, longitude);
                },
                (error) => {
                    console.error("위치 정보를 가져오지 못했습니다.", error);
                }
            );
        } else {
            console.error("Geolocation이 지원되지 않습니다.");
        }
    }, []);

    const fetchWeather = async (lat, lon) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            const data = response.data;
            const weatherCondition = response.data.weather[0].main.toLowerCase();
            // setWeather(weatherCondition);
            setWeatherData({
                condition: weatherCondition,
                temperature: data.main.temp,
                windSpeed: data.wind.speed,
            });

            // 동영상 선택
            if (weatherCondition.includes("clouds")) {
                const randomCloudVideo =
                    videoMap.clouds[Math.floor(Math.random() * videoMap.clouds.length)];
                setVideoSrc(randomCloudVideo);
            } else {
                setVideoSrc(videoMap[weatherCondition] || videoMap["clear"]);
            }
        } catch (error) {
            console.error("날씨 정보를 가져오는 데 실패했습니다.", error);
        }
    };

    return (
        <div className="weather-container">
            {/* 배경 동영상 */}
            {videoSrc && (
                <video autoPlay muted loop className="background-video">
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}

            {/* 날씨 정보 표시 */}
            {/* <div className="weather-info">
                {weather ? (
                    <h1>현재 날씨: {weather}</h1>
                ) : (
                    <h1>날씨 정보를 가져오는 중...</h1>
                )}
            </div> */}
        </div>
    );
};

export default WeatherBackground;
