import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {DataSourceService} from './data-source.service';
import {RaDesignToolsInterface} from '../ra-design-tools.interface';

@Component({
  template: `
    <div class="ra-design-side-bar-interface-title">
      <label>数据源管理</label>
      <li class="minimize" (click)="minimize()"><i nz-icon type="rabbit-design:icon-nav-left"></i></li>
    </div>
    <ra-design-tree [nzData]="data"></ra-design-tree>
  `,
  styles: []
})
export class DataSourceInterface extends RaDesignToolsInterface {
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
      'children': []
    }
  ];

  constructor(public DataSourceService: DataSourceService, public Injector: Injector) {
    super(Injector);
    this.DataSourceService.index().subscribe((data: any[]) => {
      this.data = data;
    });
  }
}
