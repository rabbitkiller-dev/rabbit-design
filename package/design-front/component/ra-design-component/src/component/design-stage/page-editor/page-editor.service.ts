import {Injectable} from '@angular/core';
import {HtmlJson, parse, stringify} from 'himalaya';
import {PageEditorInterface} from './page-editor.interface';

@Injectable({providedIn: 'root'})
export class PageEditorService {
  PageEditorInterface: PageEditorInterface;

  addRoot(htmlJson: string);
  addRoot(htmlJson: HtmlJson[]);
  addRoot(htmlJson: HtmlJson);
  addRoot(htmlJson: any) {
    const add = [];
    if (typeof htmlJson === 'string') {
      add.push(...parse(htmlJson));
    } else if (Array.isArray(htmlJson)) {
      add.push(...htmlJson);
    } else {
      add.push(htmlJson);
    }
    this.PageEditorInterface.htmlJson.push(...add);
    this.PageEditorInterface.html = stringify(this.PageEditorInterface.htmlJson);
    this.PageEditorInterface.ChangeDetectorRef.markForCheck();
    // this.PageEditorInterface.createModule();
  }
}
