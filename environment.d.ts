// NodeJS.ProcessEnvの型を拡張
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_OPENWEATHER_API_KEY: string;
  }
}
