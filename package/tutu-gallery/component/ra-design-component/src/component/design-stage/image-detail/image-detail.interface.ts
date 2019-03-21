import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {parse, stringify, HtmlJson} from 'himalaya';
import {ImageDetailService} from './image-detail.service';

@Component({
  selector: 'ra-design-page-editor',
  template: `
    <div class="page-editor">
      <div class="page-editor__form">
        <img src="img">
      </div>
      <div class="editor-stage-footer">
      </div>
    </div>
  `,
  styles: []
})
export class ImageDetailInterface implements OnInit {
  img: string;
  html: string;

  constructor(
    public PageEditorService: ImageDetailService,
    public ChangeDetectorRef: ChangeDetectorRef,
  ) {
    this.PageEditorService.ImageDetailInterface = this;
    this.PageEditorService.subscribe((event) => {
      switch (event.type) {
        case 'detail':
          this.img = event.data;
          break;
      }
    });
  }

  ngOnInit() {
  }
}
