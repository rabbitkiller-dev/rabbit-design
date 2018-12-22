import {NgModule} from '@angular/core';
import {RaDesignComponentComponent} from './ra-design-component.component';
import {RaDesignStageModule} from './design-stage';
import {RaDesignToolsModule} from './design-tools';
import {RaDesignTreeModule} from './design-tree';

export * from './design-stage';
export * from './design-tools';
export * from './design-tree';

@NgModule({
  declarations: [RaDesignComponentComponent],
  imports: [],
  exports: [RaDesignComponentComponent,
    RaDesignStageModule, RaDesignToolsModule,
    RaDesignTreeModule, ]
})
export class RaDesignComponentModule {
}
