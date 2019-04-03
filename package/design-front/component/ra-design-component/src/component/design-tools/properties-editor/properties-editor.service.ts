import {Injectable} from '@angular/core';
import {parserDirective} from '../../design-dynamic/parser-directive';
import {DesignHtmlJson} from '../../design-stage/page-editor/interface';

@Injectable({providedIn: 'root'})
export class PropertiesEditorService {
  constructor() {
  }

  getPanel(nodeJson: DesignHtmlJson): string {
    return getDirective(nodeJson).join();
  }
}

function getDirective(htmlJson: DesignHtmlJson) {
  return parserDirective(htmlJson).map((directiveName) => {
    return getDirectiveProperties(directiveName);
  });
}

function getDirectiveProperties(directiveName): string {
  switch (directiveName) {
    case 'nz-icon':
      return `
        <nz-form-item>
        <nz-form-label [nzSm]="6">type: {{proxy.type}}</nz-form-label>
        <nz-form-control [nzSm]="14">
          <input design-input [(ngModel)]="proxy.type">
        </nz-form-control>
      </nz-form-item>
      `;
    case 'nz-input':
      return 'b';
  }
}
