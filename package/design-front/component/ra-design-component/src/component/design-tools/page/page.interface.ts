import {ChangeDetectorRef, Component} from '@angular/core';
import {RaDesignStageService, StageFactory} from '../../design-stage';
import {NzFormatEmitEvent, TreeNodeModel} from '../../design-tree';
import {RaDesignMenuService} from '../../design-menu/ra-design-menu.service';
import {PageContextMenuKey, PageService} from './page.service';
import {PageModel, PageType} from './interface';

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
                 (keydown.esc)="newHidden()">
        </nz-form-control>
      </nz-form-item>
    </ra-design-dialog>
  `,
  styles: [],
  providers: [PageService],
})
export class PageInterface {
  data: any[];
  newFileOption: any = {
    visible: false,
    filename: null,
    parentPageID: null,
    pageType: null,
  };

  constructor(public RaDesignStageService: RaDesignStageService,
              public RaDesignMenuService: RaDesignMenuService,
              public PageService: PageService,
              public ChangeDetectorRef: ChangeDetectorRef) {
    this.PageService.index().subscribe((result) => {
      console.log(this.data);
      this.data = result;
      console.log(this.data);
      this.ChangeDetectorRef.markForCheck();
    });
  }

  onDblclick($event: NzFormatEmitEvent) {
    const node = $event.node;
    this.RaDesignStageService.putStage(StageFactory.PageEditor, {id: node.key, title: node.title});
  }

  onContextMenu($event: NzFormatEmitEvent) {
    const node: TreeNodeModel = $event.node;
    this.RaDesignMenuService.show($event.event, this.PageService.getContextMenu(node.origin)
    ).subscribe((menu) => {
      switch (menu.key) {
        case PageContextMenuKey.New.Page:
          this.newFileOption.visible = true;
          this.newFileOption.parentPageID = node.origin.parentPageID;
          this.newFileOption.pageType = PageType.page;
          break;
      }
    });
  }

  newFile() {
    const option = this.newFileOption;
    if (option.filename) {
      this.PageService.add({
        pageName: option.filename,
        pageType: option.pageType,
        parentPageID: option.parentPageID,
      }).subscribe((result) => {
        console.log(result);
      });
      this.newHidden();
    }
    return;
  }

  newHidden() {
    const option = this.newFileOption;
    option.visible = false;
    option.filename = null;
    option.parentPageID = null;
    option.pageType = null;
  }
}
