import {NgModule} from '@angular/core';
import {HttpClient, HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {RaComponentModule} from 'ra-component';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrfToken',
      headerName: 'x-csrf-token',
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxWebstorageModule.forRoot(),
    RaComponentModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

// import {JitCompilerFactory} from '@angular/platform-browser-dynamic';
// export function createJitCompiler() {
//   return new JitCompilerFactory().createCompiler([{
//     useJit: true
//   }]);
// }
// [{provide: Compiler, useFactory: createJitCompiler}]
