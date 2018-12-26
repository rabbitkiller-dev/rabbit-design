import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NzIconModule} from 'ng-zorro-antd';
import {RaDesignTreeModule} from '../design-tree/ra-design-tree.module';
import {RaDesignToolsComponent} from './ra-design-tools.component';
import {RaDesignToolsInterface} from './ra-design-tools.interface';
import {RaDesignToolsService} from './ra-design-tools.service';
import {DataSourceInterface} from './data-source/data-source.interface';
import {ComponentInterface} from './component/component.interface';
import {PageInterface} from './page/page.interface';

@NgModule({
  imports: [
    CommonModule,
    NzIconModule,
    DragDropModule,
    RaDesignTreeModule
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
