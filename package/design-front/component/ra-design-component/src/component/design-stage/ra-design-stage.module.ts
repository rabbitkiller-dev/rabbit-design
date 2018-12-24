import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NzIconModule} from 'ng-zorro-antd';
import {RaDesignStageComponent} from './ra-design-stage.component';
import {RaDesignStageService} from './ra-design-stage.service';
import {PageEditorInterface} from './page-editor/page-editor.interface';

@NgModule({
  imports: [
    CommonModule,
    NzIconModule,
  ],
  declarations: [
    RaDesignStageComponent,
    // page
    PageEditorInterface,
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
