import { ApplicationConfig, APP_INITIALIZER, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DatabaseService } from './core/database';

function initDbFactory() {
  const db = inject(DatabaseService);
  return () => db.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),         
    provideAnimations(),        
    DatabaseService,
    { provide: APP_INITIALIZER, useFactory: initDbFactory, multi: true }
  ],
};
