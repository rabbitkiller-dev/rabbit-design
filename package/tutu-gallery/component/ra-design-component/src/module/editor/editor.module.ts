import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {RaDesignComponentModule, DragDropModule} from '../../component/ra-design-component.module';

import {EditorComponent} from './editor.component';
import {EditorService} from './editor.service';

@NgModule({
  declarations: [
    EditorComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: EditorComponent
      },
    ]),
    RaDesignComponentModule,
    DragDropModule,
  ],
  providers: [EditorService],
})
export class EditorModule {
}
