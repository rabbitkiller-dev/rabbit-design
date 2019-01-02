import {NgModule} from '@angular/core';
import {RaDesignComponentComponent} from './ra-design-component.component';
import {DragDropModule} from './cdk-drag-drop';
import {RaDesignDragDropModule} from './design-drag-drop';
import {RaDesignStageModule} from './design-stage';
import {RaDesignToolsModule} from './design-tools';
import {RaDesignTreeModule} from './design-tree';

export * from './cdk-drag-drop';
export * from './design-drag-drop';
export * from './design-stage';
export * from './design-tools';
export * from './design-tree';

@NgModule({
  declarations: [RaDesignComponentComponent],
  imports: [],
  exports: [RaDesignComponentComponent,
    DragDropModule, RaDesignDragDropModule,
    RaDesignStageModule, RaDesignToolsModule,
    RaDesignTreeModule, ]
})
export class RaDesignComponentModule {
}
