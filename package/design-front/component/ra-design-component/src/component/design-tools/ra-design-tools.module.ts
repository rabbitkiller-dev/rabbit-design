import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NzFormModule, NzIconModule, NzInputModule} from 'ng-zorro-antd';
import {DragDropModule} from '../cdk-drag-drop';
import {RaDesignTreeModule} from '../design-tree/ra-design-tree.module';
import {RaDesignToolsComponent} from './ra-design-tools.component';
import {RaDesignToolsInterface} from './ra-design-tools.interface';
import {RaDesignToolsService} from './ra-design-tools.service';
import {DataSourceInterface} from './data-source/data-source.interface';
import {ComponentInterface} from './component/component.interface';
import {PageInterface} from './page/page.interface';
import {RaDesignDragDropModule} from '../design-drag-drop';
import {RaDesignWidgetModule} from '../design-widget/ra-design-widget.module';
import {FormsModule} from '@angular/forms';

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
    DataSourceInterface,
    ComponentInterface,
    PageInterface,
  ],
  exports: [
    RaDesignToolsComponent,
    RaDesignToolsInterface,
  ],
  providers: [
    RaDesignToolsService,
  ],
  entryComponents: [
    // data-source
    DataSourceInterface,
    ComponentInterface,
    PageInterface,
  ]
})

export class RaDesignToolsModule {

}
