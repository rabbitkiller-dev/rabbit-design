import {Injectable} from '@angular/core';
import {HtmlJson} from 'himalaya';
import {PropertiesEditorInterface} from './properties-editor.interface';
import {parserDirective} from '../../design-dynamic/parser-directive';
import {RaDesignKeyMapService} from '../../design-key-map/ra-design-key-map.service';

@Injectable({providedIn: 'root'})
export class PropertiesEditorService {
  path: string;
  currentHtmlJsonL: HtmlJson;
  PropertiesEditorInterface: PropertiesEditorInterface;

  constructor(public RaDesignKeyMapService: RaDesignKeyMapService) {
  }

  openPropertiePanel(htmlJson: HtmlJson, path: string) {
    this.PropertiesEditorInterface.panel = getDirective(htmlJson).join();
    this.PropertiesEditorInterface.createModule();
    this.currentHtmlJsonL = htmlJson;
    this.path = path;
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
