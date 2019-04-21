import {Component, ElementRef, Injector, ViewChild} from '@angular/core';
import {PageEditorService} from '../../design-stage/page-editor/page-editor.service';
import {StageFactoryType, StageTabModel} from '../../design-stage';
import {
  NzFormatEmitEvent,
  NzTreeNodeOptions,
  RaDesignTreeComponent,
  RaDesignTreeService,
  TreeNodeModel,
} from '../../design-tree';
import {RaDesignToolsInterface} from '../ra-design-tools.interface';
import {RUNTIME_EVENT_ENUM} from '../../design-runtime/runtime-event.service';
import {HtmlJson} from 'himalaya';
import {DesignHtmlJson} from '../../design-stage/page-editor/interface';
import {RaDesignKeyMapService, WINDOW_NAME} from '../../design-key-map/ra-design-key-map.service';
import {RaDesignStageService} from '../../design-stage/ra-design-stage.service';

@Component({
  template: `
    <div class="ra-design-side-bar-interface-title">
      <label>{{'structure' | translate}}</label>
      <li class="minimize" (click)="minimize()"><i nz-icon type="rabbit-design:icon-nav-left"></i></li>
    </div>
    <div class="ra-design-side-bar-interface-content">
      <ra-design-tree #structureTree [nzData]="data" (nzDblClick)="onDblclick($event)" (nzClick)="onClick($event)"
                      (nzTouchStart)="onTouchStart($event)"
                      [cdkDrag]="true"></ra-design-tree>
    </div>
  `,
  styles: [],
})
export class StructureInterface extends RaDesignToolsInterface {
  currentStage: StageTabModel;
  data: Array<HtmlJson & NzTreeNodeOptions>;
  selection: string[] = [];
  @ViewChild('structureTree') structureTree: RaDesignTreeComponent;

  constructor(
    public ElementRef: ElementRef,
    public PageEditorService: PageEditorService,
    public RaDesignKeyMapService: RaDesignKeyMapService,
    public RaDesignStageService: RaDesignStageService,
    public Injector: Injector,
  ) {
    super(Injector);
    this.initEvent();
  }

  initEvent() {
    this.RaDesignKeyMapService.registerListenerWindow(WINDOW_NAME.SideBar_Structure, this.ElementRef.nativeElement, {}).subscribe((event) => {
      switch (event.emitKey) {
        case 'delete':
          const selection = this.PageEditorService.getSelection(this.currentStage.id);
          if (selection.length > 0) {
            this.PageEditorService.deleteNodeJson(selection[0]);
          }
          break;
      }
    });
    this.RuntimeEventService.on(RUNTIME_EVENT_ENUM.Stage_Click, (value) => {
      this.currentStage = value;
      this.updateStructure();
    });
    this.RuntimeEventService.on(RUNTIME_EVENT_ENUM.StagePageEditor_DynamicAfterViewInit, (value) => {
      this.currentStage = this.RaDesignStageService.stageMap.get(value);
      this.updateStructure();
    });
    this.RuntimeEventService.on(RUNTIME_EVENT_ENUM.StagePageEditor_SelectionChange, (value) => {
      this.selection = this.PageEditorService.getSelection(this.currentStage.id);
      this.updateSelection();
    });
  }

  updateStructure() {
    if (!this.currentStage) {
      this.destroy();
      return;
    }
    if (this.currentStage.factory !== StageFactoryType.PageEditor) {
      this.destroy();
      return;
    }
    if (!this.PageEditorService.getHtmlJson(this.currentStage.id)) {
      this.destroy();
      return;
    }
    this.data = JSON.parse(JSON.stringify(this.PageEditorService.getHtmlJson(this.currentStage.id)));
    this.data = this.data.filter((node) => {
      return node.type === 'element';
    });
    RaDesignTreeService.forEachTree(this.data, (node) => {
      node.title = node.tagName;
      if (this.selection.indexOf(node.RabbitPath) !== -1) {
        node.selected = true;
      }
      if (node.children) {
        node.children = node.children.filter((node) => {
          return node.type === 'element';
        });
      }
    });
  }

  updateSelection() {
    if (!this.currentStage) {
      this.destroy();
      return;
    }
    if (this.currentStage.factory !== StageFactoryType.PageEditor) {
      this.destroy();
      return;
    }
    if (!this.PageEditorService.getHtmlJson(this.currentStage.id)) {
      this.destroy();
      return;
    }
    let selectNode: TreeNodeModel;
    const dynamicUnit = this.PageEditorService.dynamicUnits.get(this.currentStage.id);
    RaDesignTreeService.forEachTree(this.structureTree.nzNodes, (node) => {
      if (this.selection.indexOf(dynamicUnit.get(node.origin.RabbitID).RabbitPath) !== -1) {
        selectNode = node;
      }
    });
    const raDesignTreeService = this.structureTree.RaDesignTreeService;
    raDesignTreeService.setNodeActive(selectNode, false);
    raDesignTreeService.expandParent(selectNode);
  }

  destroy() {
    this.data = [];
  }

  onDblclick($event: NzFormatEmitEvent) {
    $event.node.setExpanded(!$event.node.isExpanded);
  }

  onClick($event: NzFormatEmitEvent) {
    const htmlJson: DesignHtmlJson = $event.node.origin;
    this.PageEditorService.select(this.PageEditorService.dynamicUnits.get(this.currentStage.id).get(htmlJson.RabbitID).RabbitPath);
  }
}
