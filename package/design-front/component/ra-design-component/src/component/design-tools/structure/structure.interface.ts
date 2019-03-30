import {Component, Injector} from '@angular/core';
import {PageEditorService} from '../../design-stage/page-editor/page-editor.service';
import {StageTabModel} from '../../design-stage';
import {NzFormatEmitEvent, RaDesignTreeService} from '../../design-tree';
import {RaDesignToolsInterface} from '../ra-design-tools.interface';
import {RUNTIME_EVENT_ENUM} from '../../design-runtime/runtime-event.service';
import {PageEditorServiceEvent} from '../../design-stage/page-editor/interface';


@Component({
  template: `
    <div class="ra-design-side-bar-interface-title">
      <label>页面管理</label>
      <li class="minimize" (click)="minimize()"><i nz-icon type="rabbit-design:icon-nav-left"></i></li>
    </div>
    <div class="ra-design-side-bar-interface-content">
      <ra-design-tree [nzData]="data" (nzDblClick)="onDblclick($event)" (nzContextMenu)="onContextMenu($event)"
                      (nzTouchStart)="onTouchStart($event)"
                      [cdkDrag]="true"></ra-design-tree>
    </div>
  `,
  styles: [],
})
export class StructureInterface extends RaDesignToolsInterface {
  currentStage: StageTabModel;
  data: any[];

  constructor(
    public PageEditorService: PageEditorService,
    public Injector: Injector
  ) {
    super(Injector);
    this.initEvent();
  }

  initEvent() {
    this.RuntimeEventService.on<StageTabModel>(RUNTIME_EVENT_ENUM.Stage_Open, (value) => {
      this.currentStage = value;
      this.updateStructure();
    });
    this.RuntimeEventService.on<PageEditorServiceEvent>(RUNTIME_EVENT_ENUM.StagePageEditor_UpdateDynamicHtml, (value) => {
      this.updateStructure();
    });
  }

  updateStructure() {
    if (!this.currentStage || !this.PageEditorService.getHtmlJson(this.currentStage.id)) {
      return;
    }
    this.data = JSON.parse(JSON.stringify(this.PageEditorService.getHtmlJson(this.currentStage.id)));
    this.data = this.data.filter((node) => {
      return node.type === 'element';
    });
    RaDesignTreeService.forEachTree(this.data, (node) => {
      node.title = node.tagName;
      if (node.children) {
        node.children = node.children.filter((node) => {
          return node.type === 'element';
        });
      }
    });
  }

  onDblclick($event: NzFormatEmitEvent) {
    $event.node.setExpanded(!$event.node.isExpanded);
  }
}
