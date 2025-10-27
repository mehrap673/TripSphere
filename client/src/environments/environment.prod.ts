export const environment = {
  production: true,
  apiUrl: (globalThis as any).NG_APP_API_URL || 'https://your-api-domain.com/api',
  socketUrl: (globalThis as any).NG_APP_SOCKET_URL || 'https://your-api-domain.com',
  googleClientId: (globalThis as any).NG_APP_GOOGLE_CLIENT_ID || '',
  weatherApiKey: (globalThis as any).NG_APP_WEATHER_API_KEY || '',
  mapboxToken: (globalThis as any).NG_APP_MAPBOX_TOKEN || '',
  appName: (globalThis as any).NG_APP_NAME || 'Smart Travel Planner',
  appVersion: (globalThis as any).NG_APP_VERSION || '1.0.0'
};
