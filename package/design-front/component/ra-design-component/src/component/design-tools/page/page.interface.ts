import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  template: `
    <div class="ra-design-tools-title">
      <i class="fa fa-first-order"></i>
      <label>页面管理</label>
    </div>
    <ra-design-tree [nzData]="data"></ra-design-tree>
  `,
  styles: []
})
export class PageInterface {
  data: any[] = [
    {
      'key': 1,
      'title': 'forms',
      // 'icon': 'fa-file',
      'children': [
        {
          'key': 2,
          'title': 'icon',
          // 'icon': 'fa-file'
        }
      ]
    },
  ];

  constructor() {
  }
}
