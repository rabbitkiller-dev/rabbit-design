import {Injectable} from '@angular/core';
import {DesignHtmlJson} from '../../design-stage/page-editor/interface';
import {parserDirective} from '../../design-dynamic/parser-directive';

@Injectable({providedIn: 'root'})
export class PropertiesEditorService {
  constructor() {
  }

  static getNzIcon() {
    return `
<nz-form-item>
  <nz-form-label [nzSm]="6">type</nz-form-label>
  <nz-form-control [nzSm]="14">
    <input design-input [(ngModel)]="instance['nz-icon'].type">
  </nz-form-control>
</nz-form-item>
<nz-form-item>
  <nz-form-label [nzSm]="6">nzTheme</nz-form-label>
  <nz-form-control [nzSm]="14">
    <input design-input [(ngModel)]="instance['nz-icon'].nzTheme">
  </nz-form-control>
</nz-form-item>
`;
  }

  static getNzInput() {
    return `
            <nz-form-item>
        <nz-form-label [nzSm]="6">type: {{proxy.type}}</nz-form-label>
        <nz-form-control [nzSm]="14">
          <input design-input [(ngModel)]="instance.type">
        </nz-form-control>
      </nz-form-item>
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
    return parserDirective(htmlJson).map((directiveName) => {
      return this.getDirectiveProperties(directiveName);
    }).concat(`
 <nz-form-item>
   <nz-form-label [nzSm]="6">RabbitID</nz-form-label>
   <nz-form-control [nzSm]="14">
     <input design-input [(ngModel)]="instance.RabbitID">
   </nz-form-control>
 </nz-form-item>
    `).join();
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


