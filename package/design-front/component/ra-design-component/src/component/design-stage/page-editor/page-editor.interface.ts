import {
  AfterViewInit,
  Component, OnChanges, OnDestroy,
  OnInit, SimpleChanges,
} from '@angular/core';
import {PageEditorService} from './page-editor.service';
import {DesignHtmlJson, PageInfoModel} from './interface';
import {HtmlJson, parse, stringify} from 'himalaya';

@Component({
  selector: 'ra-design-page-editor',
  template: `
    <div class="page-editor" style="">
      <div class="page-editor__form" designDrop="page-editor" [designData]="htmlJson">
        <ng-template [design-dynamic]="dynamicHtml"></ng-template>
      </div>
      <div class="editor-stage-footer">
      </div>
    </div>
  `,
  styles: []
})
export class PageEditorInterface implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  pageInfo: PageInfoModel;
  stageID: string;
  htmlJson: HtmlJson[];
  private dynamicHtml: string;

  constructor(
    public PageEditorService: PageEditorService,
  ) {
  }

  ngOnInit() {
    this.PageEditorService.findOne(this.stageID).subscribe((pageInfo) => {
      this.pageInfo = pageInfo;
      this.PageEditorService.addRoot(this.stageID, pageInfo.content || '');
    });
  }
  ngAfterViewInit() {
    this.PageEditorService.subscribe(this.stageID, (event) => {
      switch (event.type) {
        case 'update-dynamic-html':
          this.dynamicHtml = event.data;
          this.pageInfo.content = stringify(this.PageEditorService.getHtmlJson(this.stageID));
          this.PageEditorService.modify(this.pageInfo).subscribe(() => {
          });
          break;
      }
    });
  }

  addChildren(path) {

  }


  ngOnChanges(simple: SimpleChanges) {
    console.log(simple);
  }

  ngOnDestroy() {

  }
}
