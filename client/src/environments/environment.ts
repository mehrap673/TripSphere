export const environment = {
  production: false,
  apiUrl: (globalThis as any).NG_APP_API_URL || 'http://localhost:5000/api',
  socketUrl: (globalThis as any).NG_APP_SOCKET_URL || 'http://localhost:5000',
  googleClientId: (globalThis as any).NG_APP_GOOGLE_CLIENT_ID || '',
  weatherApiKey: (globalThis as any).NG_APP_WEATHER_API_KEY || '',
  mapboxToken: (globalThis as any).NG_APP_MAPBOX_TOKEN || '',
  appName: (globalThis as any).NG_APP_NAME || 'Smart Travel Planner',
  appVersion: (globalThis as any).NG_APP_VERSION || '1.0.0'
};
