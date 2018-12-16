import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {HomeComponent} from './home.component';
import {RaDesignComponentModule} from 'ra-design-component';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent
      },
    ]),
    RaDesignComponentModule,
  ],
  providers: [],
})
export class HomeModule {
}
