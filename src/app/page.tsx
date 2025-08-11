'use client';

import { useEffect, useState } from 'react';
import type { WeatherData } from '../lib/types';
import styles from './page.module.css';

const WeatherCard = ({ weatherData }: { weatherData: WeatherData }) => {
  if (!weatherData) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

  return (
    <div className={styles.weatherCard}>
      <h2 className={styles.cityName}>{weatherData.name}</h2>
      <div className={styles.weatherInfo}>
        <div className={styles.weatherIcon}>
          <img src={iconUrl} alt={weatherData.weather[0].main} width="100" height="100" />
        </div>
        <div className={styles.temperature}>{Math.round(weatherData.main.temp)}°C</div>
      </div>
      <div className={styles.details}>
        <p>湿度: {weatherData.main.humidity}%</p>
        <p>風速: {weatherData.wind.speed} m/s</p>
      </div>
    </div>
  );
};

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('');

  const fetchWeatherData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      setError('APIキーが設定されていません。');
      setLoading(false);
      return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('天気情報の取得に失敗しました。');
      }
      const data = (await response.json()) as WeatherData;
      setWeatherData(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('不明なエラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  };
  const fetchWeatherByCity = async (cityName: string) => {
    setLoading(true);
    setError(null);
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      setError('APIキーが設定されていません。');
      setLoading(false);
      return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=ja`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('都市が見つかりませんでした。');
      }
      const data = (await response.json()) as WeatherData;
      setWeatherData(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('不明なエラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        void fetchWeatherData(latitude, longitude);
      },
      () => {
        // 現在地が取得できない場合は東京の天気を表示
        void fetchWeatherData(35.6895, 139.6917);
      },
    );
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city) {
      void fetchWeatherByCity(city);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Weather App</h1>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="都市名を入力"
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            検索
          </button>
        </form>

        {loading && <div>読み込み中...</div>}
        {error && <div className={styles.error}>エラー: {error}</div>}
        {weatherData && <WeatherCard weatherData={weatherData} />}
      </main>
    </div>
  );
}
