import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgZorroAntdModule, NZ_I18N, NzFormModule, zh_CN} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {OauthGithubComponent} from './login/oauth.github.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent, LoginComponent, OauthGithubComponent, HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrfToken',
      headerName: 'x-csrf-token',
    }),
    BrowserAnimationsModule,
    NgZorroAntdModule,
  ],
  providers: [{provide: NZ_I18N, useValue: zh_CN}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
