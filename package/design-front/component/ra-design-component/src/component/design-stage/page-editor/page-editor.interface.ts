import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {parse, stringify, HtmlJson} from 'himalaya';
import {PageEditorService} from './page-editor.service';

@Component({
  selector: 'ra-design-page-editor',
  template: `
    <div class="page-editor" style="">
      <div class="page-editor__form" designDrop="page-editor">
        <ng-template [ra-design-dynamic]="html"></ng-template>
      </div>
      <div class="editor-stage-footer">
      </div>
    </div>
  `,
  styles: []
})
export class PageEditorInterface implements OnInit {
  htmlJson: HtmlJson[] = [];
  html: string;

  constructor(public PageEditorService: PageEditorService) {
    this.PageEditorService.PageEditorInterface = this;
  }

  ngOnInit() {
  }
}
