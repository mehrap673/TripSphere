const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/environments/environment.prod.ts');

const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '${process.env.NG_APP_API_URL || 'https://tripshereserver.vercel.app'}/api',
  socketUrl: '${process.env.NG_APP_SOCKET_URL || 'https://tripshereserver.vercel.app'}',
  googleClientId: '${process.env.NG_APP_GOOGLE_CLIENT_ID || ''}',
  weatherApiKey: '${process.env.NG_APP_WEATHER_API_KEY || ''}',
  mapboxToken: '${process.env.NG_APP_MAPBOX_TOKEN || ''}',
  appName: '${process.env.NG_APP_NAME || 'Smart Travel Planner'}',
  appVersion: '${process.env.NG_APP_VERSION || '1.0.0'}'
};
`;

console.log('🔧 Creating environment.prod.ts file...');
console.log('📍 API URL:', process.env.NG_APP_API_URL);

fs.writeFileSync(targetPath, envConfigFile);

console.log('✅ environment.prod.ts generated successfully!');
