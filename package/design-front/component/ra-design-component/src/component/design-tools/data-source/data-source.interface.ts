import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  template: `
    <div class="ra-design-tools-title">
      <i class="fa fa-first-order"></i>
      <label>数据源管理</label>
    </div>
    <ra-design-tree [nzData]="data"></ra-design-tree>
  `,
  styles: []
})
export class DataSourceInterface {
  data: any[] = [
    {
      'key': 1,
      'title': 'New',
      // 'icon': 'fa-file',
      'children': [
        {
          'key': 2,
          'title': 'File',
          // 'icon': 'fa-file'
          'children': [
            {
              'key': 2,
              'title': 'File',
              // 'icon': 'fa-file'
            }
          ]
        }
      ]
    },
    {
      'key': 3,
      'title': 'Copy',
      // 'icon': 'fa-file',
      'shortcut': 'ctrl+c'
    },
    {
      'key': 4,
      'title': 'Cut',
      // 'icon': 'fa-file',
      'shortcut': 'ctrl+x',
      'children': [
      ]
    }
  ];

  constructor() {
  }
}
