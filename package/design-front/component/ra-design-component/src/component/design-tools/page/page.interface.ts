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
    <ra-design-dialog header="New {{newFileOption.header}} name" *ngIf="newFileOption.visible">
      <nz-form-item>
        <nz-form-label>enter a new {{newFileOption.header}} name</nz-form-label>
        <nz-form-control>
          <input nz-input [(ngModel)]="newFileOption.filename" nzSize="small" autofocus="true"
                 (keydown.enter)="newFile($event)"
                 (keydown.esc)="newHidden()">
        </nz-form-control>
      </nz-form-item>
    </ra-design-dialog>
  `,
  styles: [],
})
export class PageInterface {
  data: any[];
  newFileOption: any = {
    visible: false,
    header: 'adsad',

    filename: null,
    parentPageID: null,
    pageType: null,
    node: TreeNodeModel
  };

  constructor(public RaDesignStageService: RaDesignStageService,
              public RaDesignMenuService: RaDesignMenuService,
              public PageService: PageService,
              public ChangeDetectorRef: ChangeDetectorRef) {
    this.PageService.index().subscribe((result) => {
      this.data = result;
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
          this.newFileOption.header = 'Page';
          this.newFileOption.parentPageID = node.key;
          this.newFileOption.pageType = PageType.page;
          break;
        case PageContextMenuKey.New.Dir:
          this.newFileOption.visible = true;
          this.newFileOption.header = 'Directory';
          this.newFileOption.parentPageID = node.key;
          this.newFileOption.pageType = PageType.dir;
          break;
        case PageContextMenuKey.New.Router2Dir:
          this.newFileOption.visible = true;
          this.newFileOption.header = '2Level Router Directory';
          this.newFileOption.parentPageID = node.key;
          this.newFileOption.pageType = PageType.router2;
          break;
        case PageContextMenuKey.New.ComponentDir:
          this.newFileOption.visible = true;
          this.newFileOption.header = 'Components Directory';
          this.newFileOption.parentPageID = node.key;
          this.newFileOption.pageType = PageType.component;
          break;
        case PageContextMenuKey.Delete:
          this.PageService.delete(node.key).subscribe(() => {
            node.parentNode.children.splice(node.parentNode.children.indexOf(node), 1);
            this.ChangeDetectorRef.markForCheck();
          });
          break;
        default:
      }
      this.newFileOption.node = node;
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
        option.node.addChildren([result]);
        option.node.children.sort(this.PageService.sort);
        this.ChangeDetectorRef.markForCheck();
        this.newHidden();
      });
    }
    return;
  }

  newHidden() {
    const option = this.newFileOption;
    option.visible = false;
    option.filename = null;
    option.parentPageID = null;
    option.pageType = null;
    option.node = null;
  }
}
