import {NgModule} from '@angular/core';
import {RaDesignComponentComponent} from './ra-design-component.component';
import {RaDesignTreeModule} from './design-tree';

export * from './design-tree';

@NgModule({
  declarations: [RaDesignComponentComponent],
  imports: [],
  exports: [RaDesignComponentComponent, RaDesignTreeModule]
})
export class RaDesignComponentModule {
}
