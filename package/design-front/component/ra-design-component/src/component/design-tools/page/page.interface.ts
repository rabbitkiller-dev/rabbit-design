import {Component} from '@angular/core';
import {RaDesignStageService, StageFactory} from '../../design-stage';
import {NzFormatEmitEvent} from '../../design-tree';
import {RaDesignMenuService} from '../../design-menu/ra-design-menu.service';
import {PageContextMenuKey, PageService} from './page.service';
import {PageModel} from './interface';

@Component({
  template: `
    <div class="ra-design-tools-title">
      <i class="fa fa-first-order"></i>
      <label>页面管理</label>
    </div>
    <ra-design-tree [nzData]="data" (nzDblClick)="onDblclick($event)" (nzContextMenu)="onContextMenu($event)"
                    [cdkDrag]="true"></ra-design-tree>
    <ra-design-dialog header="New File" *ngIf="newFileOption.visible">
      <nz-form-item>
        <nz-form-label>enter a new file name</nz-form-label>
        <nz-form-control>
          <input nz-input [(ngModel)]="newFileOption.filename" nzSize="small" autofocus="true"
                 (keydown.enter)="newFile($event)"
                 (keydown.esc)="newFileOption.filename = null;newFileOption.visible=false">
        </nz-form-control>
      </nz-form-item>
    </ra-design-dialog>
  `,
  styles: [],
  providers: [PageService],
})
export class PageInterface {
  data: any[] = [
    {
      key: 4,
      title: '设置管理',
      id: '4',
      children: [
        {
          key: 5,
          title: '首页超长文字首页超长文字首页超长文字首页超长文字',
          id: '5',
          leaf: false,
          children: [
            {
              key: 7,
              title: '首页',
              id: '7',
              leaf: false,
            },
            {
              key: 8,
              title: '登录',
              id: '8',
              leaf: false,
            },
          ]
        },
        {
          key: 6,
          title: '登录',
          id: '6',
          leaf: false,
        },
      ]
    },
    {
      key: 1,
      title: '首页',
      id: '1',
      leaf: false,
    },
    {
      key: 2,
      title: '登录',
      id: '2',
      leaf: false,
    },
    {
      key: 3,
      title: '设置超长文字设置超长文字设置超长文字设置超长文字设置超长文字',
      id: '3',
      leaf: false,
    },
  ];
  newFileOption = {
    visible: false,
    filename: null,
  };

  constructor(public RaDesignStageService: RaDesignStageService, public RaDesignMenuService: RaDesignMenuService, public PageService: PageService) {
  }

  onDblclick($event: NzFormatEmitEvent) {
    const node = $event.node;
    this.RaDesignStageService.putStage(StageFactory.PageEditor, {id: node.key, title: node.title});
  }

  onContextMenu($event: NzFormatEmitEvent) {
    this.RaDesignMenuService.show($event.event, this.PageService.getContextMenu($event.node)
    ).subscribe(($event) => {
      switch ($event.key) {
        case PageContextMenuKey.New.File:
          this.newFileOption.visible = true;
          break;
      }
    });
  }

  newFile() {
    if (this.newFileOption.filename) {
      console.log(this.newFileOption.filename);
      this.newFileOption.visible = false;
      this.newFileOption.filename = null;
    }
    return;
  }
}
