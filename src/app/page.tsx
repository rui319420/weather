'use client';

import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Weather App</h1>
        <div className={styles.weatherCard}>
          <h2 className={styles.cityName}>Tokyo</h2>
          <div className={styles.weatherInfo}>
            <div className={styles.weatherIcon}>☀️</div>
            <div className={styles.temperature}>25°C</div>
          </div>
          <div className={styles.details}>
            <p>湿度: 60%</p>
            <p>風速: 5 m/s</p>
          </div>
        </div>
      </main>
    </div>
  );
}
