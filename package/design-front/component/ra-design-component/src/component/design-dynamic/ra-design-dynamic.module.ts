import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RaDesignDynamicDirective} from './ra-design-dynamic.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    RaDesignDynamicDirective
  ],
  exports: [
    RaDesignDynamicDirective
  ],
  providers: [],
  entryComponents: []
})

export class RaDesignDynamicModule {

}
