import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DragDropModule} from '../cdk-drag-drop';
import {NzIconModule} from 'ng-zorro-antd';
import {RaDesignTreeComponent} from './ra-design-tree.component';
import {RaDesignTreeNodeComponent} from './ra-design-tree-node.component';

@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    NzIconModule
  ],
  declarations: [
    RaDesignTreeComponent,
    RaDesignTreeNodeComponent,
  ],
  exports: [
    RaDesignTreeComponent,
    RaDesignTreeNodeComponent,
  ]
})

export class RaDesignTreeModule {

}
