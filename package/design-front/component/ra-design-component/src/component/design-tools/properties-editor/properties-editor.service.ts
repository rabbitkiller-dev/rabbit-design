import {Injectable} from '@angular/core';
import {DesignHtmlJson} from '../../design-stage/page-editor/interface';
import {parserDirective} from '../../design-dynamic/parser-directive';

@Injectable({providedIn: 'root'})
export class PropertiesEditorService {
  constructor() {
  }

  static getNzIcon() {
    return `
            <ra-design-icon-panel [instance]="instance['nz-icon']" [nodeJson]="nodeJson"></ra-design-icon-panel>
`;
  }

  static getNzInput() {
    return `
            <ra-design-icon-panel [instance]="instance['nz-icon']" [nodeJson]="nodeJson"></ra-design-icon-panel>
`;
  }

  static getNzButton() {
    return `
            <nz-form-item>
        <nz-form-label [nzSm]="6">type: {{proxy.type}}</nz-form-label>
        <nz-form-control [nzSm]="14">
          <input design-input [(ngModel)]="instance.type">
        </nz-form-control>
      </nz-form-item>
`;
  }

  getPanel(nodeJson: DesignHtmlJson): string {
    return this.getDirective(nodeJson);
  }

  getDirective(htmlJson: DesignHtmlJson): string {
    return [`
    <ra-design-input-properties label="RabbitID" [value]="RabbitID.value" (valueChange)="RabbitID.value = $event; nodeJson.RabbitID = $event;"></ra-design-input-properties>
    `].concat(parserDirective(htmlJson).map((directiveName) => {
      return this.getDirectiveProperties(directiveName);
    })).join('');
    //    return parserDirective(htmlJson).map((directiveName) => {
    //      return this.getDirectiveProperties(directiveName);
    //    }).concat(`
    // <nz-form-item>
    //   <nz-form-label [nzSm]="6">RabbitID</nz-form-label>
    //   <nz-form-control [nzSm]="14">
    //     <input design-input [(ngModel)]="instance.RabbitID">
    //   </nz-form-control>
    // </nz-form-item>
    //    `).join();
//     return `
// <nz-form-item>
//   <nz-form-label [nzSm]="6">RabbitID</nz-form-label>
//   <nz-form-control [nzSm]="14">
//     <input design-input [(ngModel)]="instance.RabbitID">
//   </nz-form-control>
// </nz-form-item>
// <nz-form-item *ngFor="let attr of nodeJson?.attributes">
//   <nz-form-label [nzSm]="6">{{attr.key}}</nz-form-label>
//   <nz-form-control [nzSm]="14">
//     <input design-input [(ngModel)]="attr.value" (ngModelChange)="instance[attr.key] = $event">
//   </nz-form-control>
// </nz-form-item>
//   `;
  }

  getDirectiveProperties(directiveName): string {
    switch (directiveName) {
      case 'nz-icon':
        return PropertiesEditorService.getNzIcon();
      case 'nz-input':
        return PropertiesEditorService.getNzInput();
    }
  }
}


