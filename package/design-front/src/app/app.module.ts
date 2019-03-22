import {NgModule} from '@angular/core';
import {HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {RaComponentModule} from 'ra-component';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgxWebstorageModule} from 'ngx-webstorage';

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
