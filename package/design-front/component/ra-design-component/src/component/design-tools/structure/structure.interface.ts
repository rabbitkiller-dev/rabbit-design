import {Component} from '@angular/core';
import {PageEditorService} from '../../design-stage/page-editor/page-editor.service';
import {RaDesignStageService} from '../../design-stage';
import {NzFormatEmitEvent, RaDesignTreeService} from '../../design-tree';

@Component({
  template: `
    <div class="ra-design-tools-title">
      <i class="fa fa-first-order"></i>
      <label>页面管理</label>
    </div>
    <ra-design-tree [nzData]="data" (nzDblClick)="onDblclick($event)" (nzContextMenu)="onContextMenu($event)"
                    (nzTouchStart)="onTouchStart($event)"
                    [cdkDrag]="true"></ra-design-tree>
  `,
  styles: [],
})
export class StructureInterface {
  data: any[];

  constructor(
    public RaDesignStageService: RaDesignStageService,
    public PageEditorService: PageEditorService,
  ) {
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
