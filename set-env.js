// set-env.js
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const targetPath = './src/environments/environment.ts';
const targetProdPath = './src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
  production: false,
  weatherApiKey: '${process.env.WEATHER_API_KEY}'
};
`;

const envProdConfigFile = `export const environment = {
  production: true,
  weatherApiKey: '${process.env.WEATHER_API_KEY}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);
fs.writeFileSync(targetProdPath, envProdConfigFile);

console.log('✅ Environment files generated successfully.');
