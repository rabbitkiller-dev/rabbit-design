import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NzIconModule} from 'ng-zorro-antd';
import {RaDesignStageComponent} from './ra-design-stage.component';
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
  ],
  entryComponents: [
    // page
    PageEditorInterface,
  ]
})

export class RaDesignStageModule {

}
