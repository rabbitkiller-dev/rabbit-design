import {NgModule} from '@angular/core';
import {HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';

import {RaComponentModule} from 'ra-component';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

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
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'editor',
        loadChildren: './editor/editor.module#EditorModule',
        canActivate: [],
      },
      {
        path: 'home',
        loadChildren: './home/home.module#HomeModule',
        canActivate: [],
      },
    ]),
    RaComponentModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
