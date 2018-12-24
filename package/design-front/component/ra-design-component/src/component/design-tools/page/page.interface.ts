import {Component} from '@angular/core';
import {RaDesignStageService, StageFactory} from '../../design-stage';

@Component({
  template: `
    <div class="ra-design-tools-title">
      <i class="fa fa-first-order"></i>
      <label>页面管理</label>
    </div>
    <ra-design-tree [nzData]="data" (nzDblClick)="onDblclick($event)"></ra-design-tree>
  `,
  styles: []
})
export class PageInterface {
  data: any[] = [
    {
      'key': 1,
      'title': '首页',
      // 'icon': 'fa-file',
      'id': '1',
    },
    {
      'key': 1,
      'title': '登录',
      // 'icon': 'fa-file',
      'id': '1',
    },
  ];

  constructor(public RaDesignStageService: RaDesignStageService) {
  }

  onDblclick($event) {
    console.log($event);
    console.log(this.RaDesignStageService);
    this.RaDesignStageService.openStage(StageFactory.PageEditor, $event.node);
  }

}
