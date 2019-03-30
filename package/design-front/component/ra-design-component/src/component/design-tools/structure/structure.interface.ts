import {Component, Injector} from '@angular/core';
import {PageEditorService} from '../../design-stage/page-editor/page-editor.service';
import {RaDesignStageService} from '../../design-stage';
import {NzFormatEmitEvent, RaDesignTreeService} from '../../design-tree';
import {RaDesignToolsInterface} from '../ra-design-tools.interface';
import {PropertiesEditorService} from '../properties-editor/properties-editor.service';


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
export class StructureInterface extends RaDesignToolsInterface{
  data: any[];

  constructor(
    public RaDesignStageService: RaDesignStageService,
    public PageEditorService: PageEditorService,
    public Injector: Injector
  ) {
    super(Injector);
    this.RaDesignStageService.subscribe((event) => {
      if (event.type === 'open') {
        this.PageEditorService.subscribe(event.data.id, () => {
          this.data = JSON.parse(JSON.stringify(this.PageEditorService.getHtmlJson(event.data.id)));

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
        });
      }
    });
  }

  onDblclick($event: NzFormatEmitEvent) {
    $event.node.setExpanded(!$event.node.isExpanded);
  }
}
