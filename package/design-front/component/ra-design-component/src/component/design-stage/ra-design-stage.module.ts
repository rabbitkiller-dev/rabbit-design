import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NzIconModule} from 'ng-zorro-antd';
// import {DragDropModule} from '../cdk-drag-drop';
import {RaDesignDragDropModule} from '../design-drag-drop';
import {RaDesignStageComponent} from './ra-design-stage.component';
import {RaDesignStageService} from './ra-design-stage.service';
import {PageEditorInterface} from './page-editor/page-editor.interface';
import {RaDesignDynamicDirective} from './page-editor/dynamic-component/ra-design-dynamic.directive';

@NgModule({
  imports: [
    CommonModule,
    // DragDropModule,
    RaDesignDragDropModule,
    NzIconModule,
  ],
  declarations: [
    RaDesignStageComponent,
    // page
    PageEditorInterface,
    RaDesignDynamicDirective,
  ],
  exports: [
    RaDesignStageComponent,
  ],
  providers: [
    RaDesignStageService
  ],
  entryComponents: [
    // page
    PageEditorInterface,
  ]
})

export class RaDesignStageModule {

}
