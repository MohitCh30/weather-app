import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../core/weather';
import { NgxChartsModule, ScaleType, Color } from '@swimlane/ngx-charts';

type Mode = 'current' | 'forecast' | 'aqi';
type Suggest = { name: string; country: string; lat: number; lon: number };
type Recent = { city: string; mode: Mode; when: number; lat?: number; lon?: number };

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxChartsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent {
  // UI / form
  city = '';
  mode: Mode = 'current';
  loading = false;
  error = '';
  hasSearched = false;           // <- ONLY set to true inside fetch()

  // autocomplete
  suggestions: Suggest[] = [];
  showSuggest = false;
  pickedCoords: { lat: number; lon: number } | null = null;

  // recents
  showRecent = false;
  recents: Recent[] = [];
  userName = '';

  // results cached per mode (but NEVER auto-shown on mode change)
  private currentResult: any = null;
  private forecastResult: any = null;
  private aqiResult: any = null;

  // chart
  forecastData: Array<{ name: string; value: number }> = [];
  colorScheme: Color = {
    name: 'weatherTemp',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4da3ff']
  };

  constructor(private weather: WeatherService, private el: ElementRef) {}

  // Close suggestions when clicking outside
  @HostListener('document:click', ['$event'])
  onDocClick(ev: Event) {
    if (!this.el.nativeElement.contains(ev.target)) this.showSuggest = false;
  }

  // convenience
  get loggedIn() {
    return !!localStorage.getItem('loggedInUser');
  }
  private recentKey() {
    const u = localStorage.getItem('loggedInUser');
    const email = u ? JSON.parse(u).email : 'guest';
    return `recent:${email}`;
  }

  ngOnInit() {
    const u = localStorage.getItem('loggedInUser');
    this.userName = u ? JSON.parse(u).name : 'Guest';
    if (this.loggedIn) this.loadRecents();
  }

  // --------- getters for template (show ONLY if user clicked fetch) ----------
  get result(): any | null {
    if (!this.hasSearched) return null; // <- blocks preload/auto-show
    switch (this.mode) {
      case 'current':  return this.currentResult;
      case 'forecast': return this.forecastResult;
      case 'aqi':      return this.aqiResult;
    }
  }

  get displayCity(): string {
    if (this.mode === 'forecast') {
      return this.forecastResult?.city?.name ?? this.city;
    }
    return this.currentResult?.name ?? this.city;
  }

  get displayCountry(): string | null {
    if (this.mode === 'forecast') {
      return this.forecastResult?.city?.country ?? null;
    }
    return this.currentResult?.sys?.country ?? null;
  }

  get iconUrl(): string | null {
    // show icon only on Current Weather card, and only after a fetch
    const code = this.currentResult?.weather?.[0]?.icon;
    return this.mode === 'current' && this.hasSearched && code
      ? `https://openweathermap.org/img/wn/${code}@2x.png`
      : null;
  }

  // -------------------- MODE / CITY CHANGES --------------------
  modeChanged() {
    // do NOT fetch and do NOT display cached data
    this.loading = false;
    this.error = '';
    this.hasSearched = false;   // <- hides any card until user clicks button
  }

  onCityInput(text: string) {
    this.city = text;
    this.pickedCoords = null;

    // typing resets display until user clicks button again
    this.hasSearched = false;
    this.error = '';

    if (text.trim().length < 2) {
      this.suggestions = [];
      this.showSuggest = false;
      return;
    }
    this.weather.searchCities(text.trim()).subscribe({
      next: list => { this.suggestions = list ?? []; this.showSuggest = this.suggestions.length > 0; },
      error: () => { this.suggestions = []; this.showSuggest = false; }
    });
  }

  pickSuggestion(s: Suggest) {
    this.city = `${s.name}, ${s.country}`;
    this.pickedCoords = { lat: s.lat, lon: s.lon };
    this.showSuggest = false;
    // still require clicking Get Weather
    this.hasSearched = false;
  }

  // -------------------- FETCH (the only place that shows results) --------------------
  fetch() {
    if (!this.city.trim() || this.loading) return;

    this.loading = true;
    this.error = '';
    this.hasSearched = true;     // <- user explicitly requested data

    const done = (ok: boolean) => {
      this.loading = false;
      if (ok && this.loggedIn) this.saveRecent();
    };

    if (this.mode === 'current') {
      this.weather.getCurrent(this.city).subscribe({
        next: r => { this.currentResult = r; done(true); },
        error: _ => { this.error = 'City not found or API error'; done(false); }
      });
    }
    else if (this.mode === 'forecast') {
      this.weather.getForecast(this.city).subscribe({
        next: r => { this.forecastResult = r; this.buildChart(r); done(true); },
        error: _ => { this.error = 'City not found or API error'; done(false); }
      });
    }
    else if (this.mode === 'aqi') {
      const useCoords = (lat: number, lon: number) => {
        this.weather.getAirQuality(lat, lon).subscribe({
          next: r => { this.aqiResult = r; done(true); },
          error: _ => { this.error = 'AQI lookup failed'; done(false); }
        });
      };
      if (this.pickedCoords) useCoords(this.pickedCoords.lat, this.pickedCoords.lon);
      else {
        this.weather.getCoords(this.city).subscribe({
          next: c => c ? useCoords(c.lat, c.lon) : (this.error = 'City not found', done(false)),
          error: _ => { this.error = 'City not found'; done(false); }
        });
      }
    }
  }

  private buildChart(forecast: any) {
    const list = forecast?.list ?? [];
    this.forecastData = list.slice(0, 12).map((p: any) => ({
      name: (p.dt_txt ?? '').slice(5, 16),
      value: Number(p?.main?.temp ?? 0),
    }));
  }

  // -------------------- AQI helpers --------------------
  get aqiLevel(): number {
    if (!this.hasSearched) return 0;
    return this.aqiResult?.list?.[0]?.main?.aqi ?? 0;
  }
  get aqiLabel(): string {
    return ['Unknown', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][this.aqiLevel] ?? 'Unknown';
  }
  get showAqiAdvice(): boolean {
    return this.hasSearched && this.aqiLevel > 0;
  }
  get aqiAlertClass(): string {
    switch (this.aqiLevel) {
      case 1: return 'alert-success';
      case 2: return 'alert-info';
      case 3: return 'alert-warning';
      case 4: return 'alert-danger';
      case 5: return 'alert-dark';
      default: return 'alert-secondary';
    }
  }
  get aqiAdvice(): string {
    switch (this.aqiLevel) {
      case 1: return 'Air quality is good. Enjoy outdoor activities.';
      case 2: return 'Fair air quality. Sensitive groups should reduce exposure.';
      case 3: return 'Moderate. Consider limiting outdoor activity.';
      case 4: return 'Poor. Limit outdoor time; masks recommended.';
      case 5: return 'Very poor. Avoid outdoor activity if possible.';
      default: return '';
    }
  }
  get pollutantList() {
    const c = this.aqiResult?.list?.[0]?.components ?? {};
    return [
      { label: 'PM2.5', value: fix(c.pm2_5), unit: 'μg/m³' },
      { label: 'PM10',  value: fix(c.pm10),  unit: 'μg/m³' },
      { label: 'O₃',    value: fix(c.o3),    unit: 'μg/m³' },
      { label: 'NO₂',   value: fix(c.no2),   unit: 'μg/m³' },
      { label: 'SO₂',   value: fix(c.so2),   unit: 'μg/m³' },
      { label: 'CO',    value: fix(c.co),    unit: 'μg/m³' },
      { label: 'NH₃',   value: fix(c.nh3),   unit: 'μg/m³' },
    ];
  }

  // -------------------- Recents --------------------
  saveRecent() {
    const arr = this.loadRecents();
    const entry: Recent = {
      city: this.city,
      mode: this.mode,
      when: Date.now(),
      ...(this.pickedCoords ?? {})
    };
    const next = [entry, ...arr].slice(0, 5);
    localStorage.setItem(this.recentKey(), JSON.stringify(next));
    this.recents = next;
  }
  loadRecents() {
    const raw = localStorage.getItem(this.recentKey());
    this.recents = raw ? JSON.parse(raw) : [];
    return this.recents;
  }
  toggleRecent() { this.showRecent = !this.showRecent; }
  loadRecent(r: Recent) {
    this.city = r.city;
    this.mode = r.mode;
    this.pickedCoords = r.lat && r.lon ? { lat: r.lat, lon: r.lon } : null;
    this.fetch(); // explicit fetch on click (acts like button)
  }
}

// util
function fix(n: any, d = 1): number {
  const v = Number(n);
  return Number.isFinite(v) ? +v.toFixed(d) : 0;
}
