# **WeatherApp – Angular + Firebase + OpenWeather**

### A fast, responsive, and beautifully designed weather dashboard built with Angular, providing real-time weather updates and 36-hour forecasts.
### Hosted on Firebase, with secure environment-based API configuration.

## 🔗 Live Demo: https://weather-app-57134.web.app/

## 📸 Screenshots
### Current Weather View

<img width="1920" height="872" alt="Screenshot (786)" src="https://github.com/user-attachments/assets/5f1f6ca5-694c-4484-b376-1407514c1075" />


### Next 36 Hours View

<img width="1259" height="811" alt="Screenshot (796)" src="https://github.com/user-attachments/assets/c6099bcd-dee8-409c-985f-8193c49c69fc" />


## 🚀 Features

### 🌤️ Real-Time Weather

Fetches current weather, temperature, humidity, wind speed, and conditions.

Uses OpenWeather API with safe environment configuration.

### 📊 36-Hour Temperature Forecast

Clean, interactive chart showing temperature every 3 hours.

Hover tooltips for exact values.

Built using a chart library integrated seamlessly with Angular.

### 🔄 Recent Searches

Auto-stores previous city searches.

One-click quick lookup.

Persisted in local storage.

### 👤 Light User Session

Simple, elegant “Welcome, User” UI.

Smooth logout and return flow.

### 📱 Responsive UI

Desktop and mobile UI optimized.

Modern gradient background.

Clean card components and spacing.

### 🚀 Fast Firebase Deployment

Hosted with Firebase Hosting on global CDN.

Lightning-fast response times.

## 🛠️ Tech Stack

Frontend

Angular 17

TypeScript

SCSS

RxJS

Chart.js / ng2-charts

Backend / APIs

OpenWeather REST API

Hosting

Firebase Hosting

Automatic HTTPS

Global caching

## 📦 Installation & Setup

### Clone the repo:

git clone https://github.com/<your-username>/<your-weather-project>.git
cd <your-weather-project>


### Install dependencies:

npm install


### Run local dev server:

ng serve


### Open:

http://localhost:4200/

## 🔑 Environment Setup (VERY IMPORTANT)

Angular uses environment files, not .env.

Create:

src/environments/environment.ts


Add:

export const environment = {
  production: false,
  weatherApiKey: 'YOUR_API_KEY'
};


Production:

src/environments/environment.prod.ts

export const environment = {
  production: true,
  weatherApiKey: 'YOUR_API_KEY'
};


### ⚠ API keys are exposed in Angular builds.
### Use backend proxy / Firebase Cloud Functions for real production apps.

## 🚀 Deploying to Firebase

### Initialize:

firebase login
firebase init


### Deploy:

ng build --configuration production
firebase deploy

## 📚 What I Learned

This project helped me strengthen:

Angular component architecture

HttpClient and async API calls

State storing using Observables

Firebase deployment pipeline

Chart integration in Angular

Environment-based configurations

Handling CORS and WebAssembly issues

UI/UX improvements and responsive design

## ⭐ Future Improvements

5-day forecast with charts

Automatic location detection

Dark/Light theme toggle

Hourly wind & humidity graphs

Backend proxy to hide API key

Weather alerts feature
