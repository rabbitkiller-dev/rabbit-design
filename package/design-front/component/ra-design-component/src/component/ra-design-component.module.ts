import {NgModule} from '@angular/core';
import {RaDesignComponentComponent} from './ra-design-component.component';
import {RaDesignToolsModule} from './design-tools';
import {RaDesignTreeModule} from './design-tree';

export * from './design-tree';

@NgModule({
  declarations: [RaDesignComponentComponent],
  imports: [],
  exports: [RaDesignComponentComponent,
    RaDesignToolsModule, RaDesignTreeModule]
})
export class RaDesignComponentModule {
}
