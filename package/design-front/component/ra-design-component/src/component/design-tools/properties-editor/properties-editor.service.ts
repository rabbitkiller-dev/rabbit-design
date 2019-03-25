import {Injectable} from '@angular/core';
import {HtmlJson} from 'himalaya';
import {PropertiesEditorInterface} from './properties-editor.interface';
import {parserDirective} from '../../design-dynamic/parser-directive';

@Injectable({providedIn: 'root'})
export class PropertiesEditorService {
  PropertiesEditorInterface: PropertiesEditorInterface;

  openPropertiePanel(htmlJson: HtmlJson, instan?: any) {
    this.PropertiesEditorInterface.panel = getDirective(htmlJson).join();
    this.PropertiesEditorInterface.createModule();
  }
}

function getDirective(htmlJson: HtmlJson) {
  return parserDirective(htmlJson).map((directiveName) => {
    return getDirectiveProperties(directiveName);
  });
}

function getDirectiveProperties(directiveName): string {
  switch (directiveName) {
    case 'nz-icon':
      return 'a';
    case 'nz-input':
      return 'b';
  }
}
