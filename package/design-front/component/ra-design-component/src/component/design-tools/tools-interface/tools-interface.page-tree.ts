import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DomHandler} from 'rabbit-component';
import {
  ToolsPageTreeDataModel,
  DesignMenuModel,
  DesignTreeModel,
} from '../../common/model';
import {
  RUNTIME_EVENT_ENUM,
  RuntimeEventService,
  RuntimeDataService,
  DragDropService,
  DragMoveService
} from '../../service';

@Component({
  template: `
    <div class="ra-design-tools-title">
      <i class="fa fa-first-order"></i>
      <label>页面管理</label>
    </div>
    <ra-design-tree style="display: block;height: calc(100% - 30px);" [dragKey]="dragKey"
                    [model]="toolsPageTreeData.tree" [contextMenuModel]="toolsPageTreeData.menu"
                    (dbclickEvent)="dbclickPage($event)"
                    (contextMenu)="updateContextMenu($event)"></ra-design-tree>
  `,
  styles: []
})
export class ToolsInterfacePageTree implements OnInit, OnDestroy {
  dragKey = 'page';
  clearMove: any;
  clearEnd: any;
  toolsPageTreeData: ToolsPageTreeDataModel;

  constructor(public RuntimeEventService: RuntimeEventService,
              public RuntimeDataService: RuntimeDataService,
              public DragDropService: DragDropService,
              public DragMoveService: DragMoveService,
              public DomHandler: DomHandler,
              public HttpClient: HttpClient) {
    this.toolsPageTreeData = this.RuntimeDataService.toolsPageTreeData;

    let currentElement: HTMLElement;
    this.clearMove = this.DragDropService.onMove(this.dragKey, ($event) => {
      let target: HTMLElement;
      if (this.DomHandler.hasClass($event.target, 'ra-design-tree-node__content')) {
        target = $event.target;
      } else if (this.DomHandler.hasClass($event.target.parentNode, 'ra-design-tree-node__content')) {
        target = $event.target.parentNode;
      }
      if (currentElement) {
        this.DomHandler.removeClass(currentElement, 'is-drop');
        this.DomHandler.removeClass(currentElement, 'no-drop');
        currentElement = null;
      }
      if (target) {
        currentElement = target;
        const dropdata: DesignTreeModel = target['dropdata'];
        if (dropdata.leaf) {
          this.DomHandler.addClass(currentElement, 'no-drop');
          return;
        }
        this.DomHandler.addClass(target, 'is-drop');
      } else {
        target = this.DragMoveService.upwardFindElementByClass($event.target, 'stage-drag');
        if (target) {
          currentElement = target;
          this.DragMoveService.generateStageMark(target);
          this.DomHandler.addClass(target, 'is-drop');
        } else {
          currentElement = $event.target;
          this.DomHandler.addClass(currentElement, 'no-drop');
        }

      }
    });
    this.clearEnd = this.DragDropService.onEnd(this.dragKey, () => {
      if (currentElement) {
        this.DomHandler.removeClass(currentElement, 'is-drop');
        this.DomHandler.removeClass(currentElement, 'no-drop');
        currentElement = null;
      }
    });
  }

  ngOnInit() {
    if (!this.toolsPageTreeData.tree) {
      this.HttpClient.get('/api/generate/page/queryPageByProjectCode').subscribe((result: any) => {
        this.toolsPageTreeData.tree = result.data;
        this.RuntimeEventService.emit(RUNTIME_EVENT_ENUM.DesignPageTree_InitTree, this, result.data);
      });
    }
    if (!this.toolsPageTreeData.menu) {
      this.HttpClient.get('assets/resources/rabbit-dev-menu.json').subscribe((result: Array<DesignMenuModel>) => {
        this.toolsPageTreeData.menu = result;
        this.RuntimeEventService.emit(RUNTIME_EVENT_ENUM.DesignPageTree_InitMenu, this, result);
      });
    }
  }

  ngOnDestroy() {
    this.clearMove();
    this.clearEnd();
  }

  updateContextMenu($event: DesignTreeModel) {
    console.log($event);
  }

  dbclickPage(model: DesignTreeModel) {
    if (!model.leaf) {
      return;
    }
    this.RuntimeEventService.emit(RUNTIME_EVENT_ENUM.DesignPageTree_DoubleClick, model, this);
  }
}

