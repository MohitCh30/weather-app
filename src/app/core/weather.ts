import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private key = environment.weatherApiKey;

  private currentUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast'; // 3-hour intervals
  private airUrl = 'https://api.openweathermap.org/data/2.5/air_pollution';
  private geoUrl = 'https://api.openweathermap.org/geo/1.0/direct';

  constructor(private http: HttpClient) {}

  /** Current weather by city string */
  getCurrent(city: string): Observable<any> {
    return this.http.get(`${this.currentUrl}`, {
      params: { q: city, appid: this.key, units: 'metric' }
    });
  }

  /** 3-hour forecast (5 days) by city string */
  getForecast(city: string): Observable<any> {
    return this.http.get(`${this.forecastUrl}`, {
      params: { q: city, appid: this.key, units: 'metric' }
    });
  }

  /** Air quality by coordinates */
  getAirQuality(lat: number, lon: number): Observable<any> {
    return this.http.get(`${this.airUrl}`, {
      params: { lat, lon, appid: this.key }
    });
  }

  /** City suggestions (limit 5) */
  searchCities(q: string): Observable<Array<{name:string; country:string; lat:number; lon:number}>> {
    return this.http.get<any[]>(`${this.geoUrl}`, {
      params: { q, limit: 5, appid: this.key }
    }).pipe(map(list => list?.map(x => ({
      name: x.name,
      country: x.country,
      lat: x.lat,
      lon: x.lon
    })) ?? []));
  }

  /** First geocode match for city string */
  getCoords(city: string): Observable<{lat:number; lon:number} | null> {
    return this.http.get<any[]>(`${this.geoUrl}`, {
      params: { q: city, limit: 1, appid: this.key }
    }).pipe(map(list => list?.length ? { lat: list[0].lat, lon: list[0].lon } : null));
  }

  /** Real OpenWeather icon */
  iconUrl(code: string): string {
    return `https://openweathermap.org/img/wn/${code}@2x.png`;
  }
}
