import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
//import { TranslateHttpLoader   } from '@ngx-translate/';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthServices } from './core/authservice.service';
import { encryptionInterceptor } from './interceptors/auth.interceptors.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([encryptionInterceptor])),
    AuthServices,
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
  ],
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/xi18n/', '.json');
}
