import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NzFormModule, NzIconModule, NzInputModule} from 'ng-zorro-antd';
import {DragDropModule} from '../cdk-drag-drop';
import {RaDesignTreeModule} from '../design-tree/ra-design-tree.module';
import {RaDesignToolsComponent} from './ra-design-tools.component';
import {RaDesignToolsService} from './ra-design-tools.service';
import {DataSourceInterface} from './data-source/data-source.interface';
import {ComponentInterface} from './component/component.interface';
import {PageInterface} from './page/page.interface';
import {RaDesignDragDropModule} from '../design-drag-drop';
import {RaDesignWidgetModule} from '../design-widget/ra-design-widget.module';
import {FormsModule} from '@angular/forms';
import {IconInterface} from './icon/icon.interface';
import {PropertiesEditorInterface} from './properties-editor/properties-editor.interface';
import {StructureInterface} from './structure/structure.interface';
import {TranslateModule} from '@ngx-translate/core';

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
    TranslateModule.forChild(),
  ],
  declarations: [
    RaDesignToolsComponent,
    // data-source
    DataSourceInterface,
    IconInterface,
    ComponentInterface,
    PageInterface,
    PropertiesEditorInterface,
    StructureInterface,
  ],
  exports: [
    RaDesignToolsComponent,
  ],
  providers: [
    RaDesignToolsService,
  ],
  entryComponents: [
    // data-source
    DataSourceInterface,
    IconInterface,
    ComponentInterface,
    PageInterface,
    PropertiesEditorInterface,
    StructureInterface,
  ]
})

export class RaDesignToolsModule {

}
