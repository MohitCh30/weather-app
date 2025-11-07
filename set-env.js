// set-env.js
const fs = require('fs');

const targetPath = './src/environments/environment.ts';
const targetProdPath = './src/environments/environment.prod.ts';

const apiKey = process.env.WEATHER_API_KEY;

if (!apiKey) {
  console.error('❌ WEATHER_API_KEY is missing. Make sure it’s set in Vercel.');
  process.exit(1);
}

const envConfigFile = `export const environment = {
  production: false,
  weatherApiKey: '${apiKey}'
};\n`;

const envProdConfigFile = `export const environment = {
  production: true,
  weatherApiKey: '${apiKey}'
};\n`;

fs.writeFileSync(targetPath, envConfigFile);
fs.writeFileSync(targetProdPath, envProdConfigFile);

console.log('✅ Environment files generated successfully.');
