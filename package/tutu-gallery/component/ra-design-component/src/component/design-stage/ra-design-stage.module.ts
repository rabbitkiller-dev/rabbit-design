import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NzIconModule} from 'ng-zorro-antd';
// import {DragDropModule} from '../cdk-drag-drop';
import {RaDesignDragDropModule} from '../design-drag-drop';
import {RaDesignStageComponent} from './ra-design-stage.component';
import {RaDesignStageService} from './ra-design-stage.service';
import {ImageDetailInterface} from './image-detail/image-detail.interface';

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
    ImageDetailInterface,
  ],
  exports: [
    RaDesignStageComponent,
  ],
  providers: [
    RaDesignStageService
  ],
  entryComponents: [
    // page
    ImageDetailInterface,
  ]
})

export class RaDesignStageModule {

}
