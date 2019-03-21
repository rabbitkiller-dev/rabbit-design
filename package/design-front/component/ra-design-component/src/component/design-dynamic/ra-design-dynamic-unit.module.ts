import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RaDesignDynamicUnitDirective} from './ra-design-dynamic-unit.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    RaDesignDynamicUnitDirective,
  ],
  exports: [
    RaDesignDynamicUnitDirective,
  ],
  providers: [],
  // entryComponents: [RaDesignDynamicUnitDirective]
})

export class RaDesignDynamicUnitModule {

}
