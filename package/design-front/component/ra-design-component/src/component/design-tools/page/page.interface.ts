import {Component, ElementRef, Injector} from '@angular/core';
import {RaDesignStageService, StageFactory} from '../../design-stage';
import {NzFormatEmitEvent, TreeNodeModel} from '../../design-tree';
import {RaDesignMenuService} from '../../design-menu/ra-design-menu.service';
import {PageContextMenuKey, PageService} from './page.service';
import {PageModel, PageType} from './interface';
import {RaDesignKeyMapService} from '../../design-key-map/ra-design-key-map.service';
import {RaDesignToolsInterface} from '../ra-design-tools.interface';

@Component({
  template: `
    <div class="ra-design-side-bar-interface-title">
      <label>页面管理</label>
      <li class="minimize" (click)="minimize()"><i nz-icon type="rabbit-design:icon-nav-left"></i></li>
    </div>
    <ra-design-tree [nzData]="data" (nzDblClick)="onDblclick($event)" (nzContextMenu)="onContextMenu($event)"
                    (nzTouchStart)="onTouchStart($event)"
                    [cdkDrag]="true"></ra-design-tree>
    <ra-design-dialog header="New {{newFileOption.header}} name" *ngIf="newFileOption.visible">
      <nz-form-item>
        <nz-form-label>enter a new {{newFileOption.header}} name</nz-form-label>
        <nz-form-control>
          <input design-input [(ngModel)]="newFileOption.filename" autofocus="true"
                 (keydown.enter)="newFile($event)"
                 (keydown.esc)="newHidden()">
        </nz-form-control>
      </nz-form-item>
    </ra-design-dialog>
  `,
  styles: [],
})
export class PageInterface extends RaDesignToolsInterface {
  data: any[];
  newFileOption: any = {
    visible: false,
    header: 'adsad',

    filename: null,
    parentPageID: null,
    pageType: null,
    node: TreeNodeModel
  };

  constructor(
    public ElementRef: ElementRef,
    public RaDesignStageService: RaDesignStageService,
    public RaDesignMenuService: RaDesignMenuService,
    public PageService: PageService,
    public RaDesignKeyMapService: RaDesignKeyMapService,
    public Injector: Injector,
  ) {
    super(Injector);
    this.PageService.index().subscribe((result) => {
      this.data = result;
    });
    this.RaDesignKeyMapService.registerListenerWindow('page', this.ElementRef.nativeElement).subscribe((event) => {
      switch (event.emitKey) {
        case 'delete':
          console.log('page delete');
          // if (this.PropertiesEditorService.currentHtmlJsonL) {
          //   const originParentNode = this.getParentNodeJson(path);
          //   originParentNode.children.splice(originParentNode.children.indexOf(htmlJson), 1);
          // }
          break;
      }

    });
  }

  onDblclick($event: NzFormatEmitEvent) {
    const node = $event.node;
    const page: PageModel = $event.node.origin;
    if (page.pageType === PageType.page) {
      this.RaDesignStageService.putStage(StageFactory.PageEditor, {id: node.key, title: node.title});
    } else {
      node.setExpanded(!node.isExpanded);
    }
  }

  onTouchStart($event) {
    const node = $event.node;
    const page: PageModel = $event.node.origin;
    if (page.pageType === PageType.page) {
      this.RaDesignStageService.putStage(StageFactory.PageEditor, {id: node.key, title: node.title});
    } else {
      node.setExpanded(true);
    }
  }

  onContextMenu($event: NzFormatEmitEvent) {
    const node: TreeNodeModel = $event.node;
    this.RaDesignMenuService.show($event.event, this.PageService.getContextMenu(node.origin)
    ).subscribe((menu) => {
      switch (menu.key) {
        case PageContextMenuKey.New.Page:
          this.newFileOption.visible = true;
          this.newFileOption.header = 'Page';
          this.newFileOption.parentPageID = node.origin.pageType ? node.key : undefined;
          this.newFileOption.pageType = PageType.page;
          break;
        case PageContextMenuKey.New.Dir:
          this.newFileOption.visible = true;
          this.newFileOption.header = 'Directory';
          this.newFileOption.parentPageID = node.origin.pageType ? node.key : undefined;
          this.newFileOption.pageType = PageType.dir;
          break;
        case PageContextMenuKey.New.Router2Dir:
          this.newFileOption.visible = true;
          this.newFileOption.header = '2Level Router Directory';
          this.newFileOption.parentPageID = node.origin.pageType ? node.key : undefined;
          this.newFileOption.pageType = PageType.router2;
          break;
        case PageContextMenuKey.New.ComponentDir:
          this.newFileOption.visible = true;
          this.newFileOption.header = 'Components Directory';
          this.newFileOption.parentPageID = node.origin.pageType ? node.key : undefined;
          this.newFileOption.pageType = PageType.component;
          break;
        case PageContextMenuKey.Delete:
          this.PageService.delete(node.key).subscribe(() => {
            node.parentNode.children.splice(node.parentNode.children.indexOf(node), 1);
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
