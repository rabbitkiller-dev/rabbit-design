import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {Monaco} from './monaco';
import {RaDesignMonacoComponent} from './ra-design-monaco.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    Monaco,
    RaDesignMonacoComponent,
  ],
  exports: [
    RaDesignMonacoComponent,
  ]
})
export class RaDesignMonacoModule {
}
