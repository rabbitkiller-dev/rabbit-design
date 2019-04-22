import {Component, Input} from '@angular/core';
import {NzMenuDirective} from '../../design-dynamic/nz-module/menu';
import {DesignHtmlJson} from '../../design-stage/page-editor/interface';
import {PageEditorService} from '../../design-stage/page-editor/page-editor.service';
import {RaDesignStageService} from '../../design-stage';

@Component({
  selector: 'ra-design-menu-panel',
  template: `
    <ra-design-tree [nzData]="nodeJson"></ra-design-tree>
    <button nz-button (click)="add()">添加一个菜单先</button>
  `
})
export class MenuPanelComponent {
  @Input() nodeJson: DesignHtmlJson;
  @Input() instance: NzMenuDirective;

  id: any;

  constructor(
    public PageEditorService: PageEditorService,
    public RaDesignStageService: RaDesignStageService,
  ) {
  }

  ngOnInit() {
    console.log(this.nodeJson);
    console.log(this.nodeJson.children);
  }

  add() {
    const currentStage = this.RaDesignStageService.stageList.find(stage => stage.select);
    const selection = this.PageEditorService.getSelection(currentStage.id);
    this.PageEditorService.append(selection[0], '<li nz-menu-item>菜单项</li>');
  }

  change(key, $event) {
    let attr;
    switch (key) {
    }
    clearTimeout(this.id);
    this.id = setTimeout(() => {
      this.instance.ngOnChanges({theme: true} as any);
    }, 200);
  }
}
