import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RaDesignDragDirective} from './ra-design-drag.directive';
import {RaDesignDropDirective} from './ra-design-drop.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    RaDesignDragDirective,
    RaDesignDropDirective,
  ],
  exports: [
    RaDesignDragDirective,
    RaDesignDropDirective,
  ],
  providers: [
  ],
  entryComponents: [
  ]
})

export class RaDesignDragDropModule {

}
