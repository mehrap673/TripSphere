declare interface Env {
  readonly NODE_ENV: string;
  readonly NG_APP_API_URL: string;
  readonly NG_APP_SOCKET_URL: string;
  readonly NG_APP_GOOGLE_CLIENT_ID: string;
  readonly NG_APP_WEATHER_API_KEY: string;
  readonly NG_APP_MAPBOX_TOKEN: string;
  readonly NG_APP_NAME: string;
  readonly NG_APP_VERSION: string;
  [key: string]: any;
}

declare interface ImportMeta {
  readonly env: Env;
}
