import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Cloud } from '@react-three/drei';
import axios from 'axios';

function WeatherBackground() {
    const [weather, setWeather] = useState(null);
    const [timeOfDay, setTimeOfDay] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);     
    useEffect(() => {
        console.log("API Key:", process.env.REACT_APP_WEATHER_API_KEY);
        async function fetchWeatherData() {
            setLoading(true);
            try {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
                    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
                    console.log("Weather API URL:", weatherUrl);

                    try {
                        const response = await axios.get(weatherUrl);
                        console.log("Weather API Response:", response);
                        const currentWeather = response.data.weather[0].main.toLowerCase();
                    setWeather(currentWeather);
                    } catch (error) {
                        console.error("Weather API Error:", error.response ? error.response.data : error);
                    }
                
                    const currentTime = new Date().getHours();
                    setTimeOfDay(currentTime >= 6 && currentTime < 18 ? 'day' : 'night');
                }, (geoError) => {
                    console.error("위치 권한이 필요합니다.", geoError);
                    setError("위치 권한이 필요합니다.");
                });
            } catch (error) {
                console.error("날씨 데이터를 가져오는 중 오류가 발생했습니다.", error);
                setError("날씨 데이터를 가져오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        }
        fetchWeatherData();
    }, []);

    if (loading) return <div>날씨 데이터를 가져오는 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Canvas style={{ height: '100vh', width: '100vw' }}>
            <OrbitControls enableZoom={false} enablePan={false} />
            
            {timeOfDay === 'night' && <Stars radius={100} depth={50} count={10000} fade factor={7} />}
            
            {weather === 'clouds' && (
                <>
                    <Cloud position={[5, 5, -10]} />
                    <Cloud position={[-5, 10, -15]} />
                </>
            )}
            
            {weather === 'rain' && <RainAnimation />}
            
            {weather === 'clear' && timeOfDay === 'day' && <Sun />}
            
            {weather === 'thunderstorm' && <LightningAnimation />}
        </Canvas>
    );
}

function Sun() {
    return (
        <mesh>
            <pointLight intensity={1.5} position={[0, 10, 10]} />
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshStandardMaterial emissive="yellow" emissiveIntensity={1} />
        </mesh>
    );
}

function RainAnimation() {
    const drops = Array.from({ length: 1000 }, () => ({
        position: [
            Math.random() * 100 - 50,
            Math.random() * 50 - 25,
            Math.random() * 50 - 25
        ]
    }));

    return (
        <group>
            {drops.map((drop, index) => (
                <mesh key={index} position={drop.position}>
                    <sphereGeometry args={[0.05, 8, 8]} />
                    <meshBasicMaterial color="blue" />
                </mesh>
            ))}
        </group>
    );
}

function LightningAnimation() {
    const [flash, setFlash] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setFlash((prev) => !prev), 1000 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, []);

    return flash ? <pointLight intensity={5} position={[0, 5, -10]} color="white" /> : null;
}

export default WeatherBackground;
