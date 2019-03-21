import {
  ChangeDetectorRef,
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
        <ng-template [design-dynamic]="html"></ng-template>
      </div>
      <div class="editor-stage-footer">
      </div>
    </div>
  `,
  styles: []
})
export class PageEditorInterface implements OnInit {
  html: string;

  constructor(
    public PageEditorService: PageEditorService,
    public ChangeDetectorRef: ChangeDetectorRef,
  ) {
    this.PageEditorService.PageEditorInterface = this;
    this.PageEditorService.subscribe((event) => {
      switch (event.type) {
        case 'html':
          this.html = event.data;
          break;
      }
    });
  }

  ngOnInit() {
  }
}
