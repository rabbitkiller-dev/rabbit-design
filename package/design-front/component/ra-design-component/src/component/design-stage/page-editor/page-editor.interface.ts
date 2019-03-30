import {
  AfterViewInit,
  Component, ElementRef, OnChanges, OnDestroy,
  OnInit, SimpleChanges,
} from '@angular/core';
import {PageEditorService} from './page-editor.service';
import {DesignHtmlJson, PageInfoModel} from './interface';
import {HtmlJson, parse, stringify} from 'himalaya';
import {RaDesignKeyMapService} from '../../design-key-map/ra-design-key-map.service';

@Component({
  selector: 'ra-design-page-editor',
  template: `
    <div class="page-editor" style="">
      <div class="page-editor-content" designDrop="page-editor" [designData]="stageID">
        <ng-template [design-dynamic]="dynamicHtml"></ng-template>
      </div>
      <div class="page-editor-footer">
      </div>
    </div>
  `,
  styles: []
})
export class PageEditorInterface implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  pageInfo: PageInfoModel;
  stageID: string;
  private dynamicHtml: string;

  constructor(
    public ElementRef: ElementRef,
    public PageEditorService: PageEditorService,
    public RaDesignKeyMapService: RaDesignKeyMapService,
  ) {
  }

  ngOnInit() {
    this.PageEditorService.findOne(this.stageID).subscribe((pageInfo) => {
      this.pageInfo = pageInfo;
      this.PageEditorService.addRoot(this.stageID, pageInfo.content || '');
    });
    this.RaDesignKeyMapService.registerListenerWindow('stage_page_editor', this.ElementRef.nativeElement, {stageID: this.stageID}).subscribe((event) => {
      switch (event.emitKey) {
        case 'delete':
          const selection = this.PageEditorService.getSelection(this.stageID);
          if (selection.length > 0) {
            this.PageEditorService.deleteNodeJson(selection[0]);
          }
          break;
      }
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

  ngOnChanges(simple: SimpleChanges) {
    console.log(simple);
  }

  ngOnDestroy() {
    this.PageEditorService.modify(this.pageInfo).subscribe(() => {
    });
    this.PageEditorService.deleteHtmlJson(this.stageID);
  }
}
