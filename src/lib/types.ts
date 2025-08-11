export interface WeatherData {
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
    description: string;
  }[];
}
