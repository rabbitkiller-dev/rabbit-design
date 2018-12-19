import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DomHandler} from 'rabbit-component';
import {
  RUNTIME_EVENT_ENUM,
  RuntimeEventService,
  RuntimeDataService,
  DragDropService,
} from '../../service';
import {
  DesignTreeModel,
  ToolsComponentDataModel
} from '../../common/model';
import {StageInterfaceDragPage} from '../../ra-design-stage/stage-interface';


@Component({
  template: `
    <div class="ra-design-tools-title">
      <i class="fa fa-first-order"></i>
      <label>组件管理</label>
    </div>
    <ra-design-tree style="display: block;height: calc(100% - 30px);" [isDrag]="isDrag"
                    [model]="toolsComponentData.tree"></ra-design-tree>
  `,
  styles: []
})
export class ToolsInterfaceComponent implements OnInit, OnDestroy {
  dragKey = 'component';
  clearMove: any;
  clearEnd: any;
  toolsComponentData: ToolsComponentDataModel;

  constructor(public RuntimeEventService: RuntimeEventService,
              public RuntimeDataService: RuntimeDataService,
              public DragDropService: DragDropService,
              public DomHandler: DomHandler,
              public HttpClient: HttpClient) {
    this.toolsComponentData = this.RuntimeDataService.toolsComponentData;

    let currentElement: HTMLElement;
    let mode;
    this.clearMove = this.DragDropService.onMove(this.dragKey, ($event) => {
      let target: HTMLElement;
      if (this.DomHandler.hasClass($event.target, 'dynamic-stage')) {
        target = $event.target;
        mode = 'dynamic-stage';
      } else {
        mode = null;
      }
      if (currentElement) {
        this.DomHandler.removeClass(currentElement, 'is-drop');
        this.DomHandler.removeClass(currentElement, 'no-drop');
        currentElement = null;
      }
      if (mode === 'dynamic-stage') {
        currentElement = target;
        this.DomHandler.addClass(currentElement, 'is-drop');
        return;
      } else {
        currentElement = $event.target;
        this.DomHandler.addClass(currentElement, 'no-drop');
      }
    });
    this.clearEnd = this.DragDropService.onEnd(this.dragKey, () => {
      const instance: StageInterfaceDragPage = this.RuntimeDataService.stageData.getSelect().instance;
      if (mode === 'dynamic-stage') {
        instance.stageItem.data.html += '<input nz-input maxlength="214" placeholder="please input connection name">'
      }
      instance.rendererComponent();
      if (currentElement) {
        this.DomHandler.removeClass(currentElement, 'is-drop');
        this.DomHandler.removeClass(currentElement, 'no-drop');
        currentElement = null;
        mode = null;
      }
    });
  }

  ngOnInit() {
    if (!this.toolsComponentData.tree) {
      this.HttpClient.get('assets/resources/component-list.json').subscribe((result: Array<any>) => {
        this.toolsComponentData.tree = result;
        this.RuntimeEventService.emit(RUNTIME_EVENT_ENUM.DesignPageTree_InitTree, this, result);
      });
    }
    // if (!this.DesignToolsComponent.menu) {
    //   this.HttpClient.get('assets/resources/rabbit-dev-menu.json').subscribe((result: Array<DesignMenuModel>) => {
    //     this.DesignToolsComponent.menu = result;
    //     this.RuntimeEventService.emit(RUNTIME_EVENT_ENUM.DesignPageTree_InitMenu, this, result);
    //   });
    // }
  }

  ngOnDestroy() {
    this.clearMove();
    this.clearEnd();
  }

  isDrag(model: DesignTreeModel) {
    return !!model.leaf;
  }
}

