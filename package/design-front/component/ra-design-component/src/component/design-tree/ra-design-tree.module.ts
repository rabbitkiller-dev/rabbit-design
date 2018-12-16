import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NzIconModule} from 'ng-zorro-antd';
import {RaDesignTreeComponent} from './ra-design-tree.component';
import {RaDesignTreeNodeComponent} from './ra-design-tree-node.component';

@NgModule({
  imports: [
    CommonModule,
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
