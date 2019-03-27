import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  private placeholderTemp: Map<string, HTMLElement> = new Map<string, HTMLElement>();

  getPlaceholder(key: string): HTMLElement {
    if (this.placeholderTemp.get(key)) {
      return this.placeholderTemp.get(key);
    }

    const div = document.createElement('div');
    switch (key) {
      case 'icon':
        div.innerHTML = '<i class="anticon anticon-rabbit-design:icon-iconfont cdk-drag-placeholder"><svg viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1127" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" fill="currentColor" class="ng-tns-c4-24" data-icon="rabbit-design:icon-iconfont" aria-hidden="true"></svg></i>'
        break;
      case 'button':
        div.innerHTML = '<button class="ant-btn ant-btn-primary cdk-drag-placeholder">Button</button>';
        break;
      case 'input':
        div.innerHTML = '<input class="ant-input cdk-drag-placeholder">';
        break;
      case 'layout':
        div.innerHTML = `<nz-layout>
  <nz-header></nz-header>
  <nz-content></nz-content>
  <nz-footer></nz-footer>
</nz-layout>`;
        break;
    }
    this.placeholderTemp.set(key, div.children[0] as HTMLElement);
    return div.children[0] as HTMLElement;
  }

  getHtmlJson(key): string {
    switch (key) {
      case 'icon':
        return '<i nz-icon type="rabbit-design:icon-iconfont"></i>';
        break;
      case 'button':
        return '<button nz-button nzType="primary">Button</button>';
        break;
      case 'input':
        return '<input nz-input>';
        break;
      case 'layout':
        return `<nz-layout>
  <nz-header></nz-header>
  <nz-content></nz-content>
  <nz-footer></nz-footer>
</nz-layout>`;
        break;
    }
  }
}


