// src/app/page.tsx (変更後)
'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

// APIからのレスポンスの型を定義する
interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    icon: string;
    main: string;
  }[];
}

export default function Home() {
  // useStateを使って、天気データを保持するstateを定義
  // 初期値はnullにしておく
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffectを使って、コンポーネントのマウント時にAPIからデータを取得する
  useEffect(() => {
    // データ取得処理を非同期関数として定義
    const fetchWeatherData = async () => {
      // .env.localからAPIキーを取得
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) {
        setError('APIキーが設定されていません。');
        setLoading(false);
        return;
      }

      // 東京の緯度経度
      const lat = 35.6895;
      const lon = 139.6917;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;

      try {
        // fetch APIを使ってデータを取得
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('天気情報の取得に失敗しました。');
        }
        const data = (await response.json()) as unknown as WeatherData;
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

    void fetchWeatherData();
  }, []); // 依存配列が空なので、この処理は一度だけ実行される

  // ローディング中の表示
  if (loading) {
    return <div>読み込み中...</div>;
  }

  // エラー発生時の表示
  if (error) {
    return <div>エラー: {error}</div>;
  }

  // データが取得できなかった場合の表示
  if (!weatherData) {
    return <div>天気情報を表示できません。</div>;
  }

  // 天気アイコンのURL
  const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Weather App</h1>
        <div className={styles.weatherCard}>
          {/* APIから取得した都市名を表示 */}
          <h2 className={styles.cityName}>{weatherData.name}</h2>
          <div className={styles.weatherInfo}>
            <div className={styles.weatherIcon}>
              {/* APIから取得したアイコンを表示 */}
              <img src={iconUrl} alt={weatherData.weather[0].main} width="100" height="100" />
            </div>
            {/* APIから取得した気温を表示 */}
            <div className={styles.temperature}>{Math.round(weatherData.main.temp)}°C</div>
          </div>
          <div className={styles.details}>
            {/* APIから取得した湿度と風速を表示 */}
            <p>湿度: {weatherData.main.humidity}%</p>
            <p>風速: {weatherData.wind.speed} m/s</p>
          </div>
        </div>
      </main>
    </div>
  );
}
