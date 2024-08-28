import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEnvironmentNgxMask } from "ngx-mask";
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideEnvironmentNgxMask({
			prefix: "R$",
			thousandSeparator: ".",
			decimalMarker: ",",
		}), 
		provideHttpClient(),
    provideAnimationsAsync()]
};
