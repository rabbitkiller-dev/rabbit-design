import {Injectable} from '@angular/core';
import {HtmlJson} from 'himalaya';
import {PropertiesEditorInterface} from './properties-editor.interface';

@Injectable({providedIn: 'root'})
export class PropertiesEditorService {
  PropertiesEditorInterface: PropertiesEditorInterface;
  openPropertiePanel(htmlJson: HtmlJson, instan?: any) {
    this.PropertiesEditorInterface.panel = getDirective(htmlJson).join();
    this.PropertiesEditorInterface.createModule();
  }
}

const DirectiveNames = ['nz-icon', 'nz-input'];

function getDirective(htmlJson: HtmlJson) {
  const directives = [];
  htmlJson.attributes.forEach((attr) => {
    if (DirectiveNames.indexOf(attr.key) !== -1) {
      directives.push(getDirectiveProperties(attr.key));
    }
  });
  return directives;
}

function getDirectiveProperties(directiveName) {
  switch (directiveName) {
    case 'nz-icon':
      return 'a';
    case 'nz-input':
      return 'a';
  }
}
