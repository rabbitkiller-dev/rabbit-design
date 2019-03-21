import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NzFormModule, NzIconModule, NzInputModule} from 'ng-zorro-antd';
import {DragDropModule} from '../cdk-drag-drop';
import {RaDesignTreeModule} from '../design-tree/ra-design-tree.module';
import {RaDesignToolsComponent} from './ra-design-tools.component';
import {RaDesignToolsInterface} from './ra-design-tools.interface';
import {RaDesignToolsService} from './ra-design-tools.service';
import {RaDesignDragDropModule} from '../design-drag-drop';
import {RaDesignWidgetModule} from '../design-widget/ra-design-widget.module';
import {FormsModule} from '@angular/forms';
import {ImagesInterface} from './images/images.interface';
import {LineInterface} from './line/line.interface';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NzIconModule,
    NzInputModule,
    NzFormModule,
    DragDropModule,
    RaDesignTreeModule,
    RaDesignWidgetModule,
    RaDesignDragDropModule,
  ],
  declarations: [
    RaDesignToolsComponent,
    RaDesignToolsInterface,
    // data-source
    ImagesInterface,
    LineInterface,
  ],
  exports: [
    RaDesignToolsComponent,
    RaDesignToolsInterface,
  ],
  providers: [
    RaDesignToolsService,
  ],
  entryComponents: [
    ImagesInterface,
    LineInterface,
  ]
})

export class RaDesignToolsModule {

}
