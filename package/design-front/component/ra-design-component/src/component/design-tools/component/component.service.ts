import {Injectable} from '@angular/core';
import {ComponentMap} from './registry';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  private placeholderTemp: Map<string, HTMLElement> = new Map<string, HTMLElement>();

  getPlaceholder(key: string): HTMLElement {
    return ComponentMap.get(key).getPlaceholder();
    /*switch (key) {
      case 'input':
        div.innerHTML = '<input class="ant-input">';
        break;
      case 'top-right-content':
        div.innerHTML = `<nz-layout class="ant-layout">
      <nz-header class="ant-layout-header dynamic-blank">Header</nz-header>
      <nz-layout class="ant-layout ant-layout-has-sider">
        <nz-sider class="ant-layout-sider dynamic-blank">Sider</nz-sider>
        <nz-content class="ant-layout-content dynamic-blank">Content</nz-content>
      </nz-layout>
      <nz-footer class="ant-layout-footer dynamic-blank">Footer</nz-footer>
    </nz-layout>`;
        break;
      case 'breadcrumb':
        div.innerHTML = `<nz-breadcrumb>
      <nz-breadcrumb-item>
        Home
      </nz-breadcrumb-item>
      <nz-breadcrumb-item>
        <a>Application List</a>
      </nz-breadcrumb-item>
      <nz-breadcrumb-item>
        An Application
      </nz-breadcrumb-item>
    </nz-breadcrumb>`;
        break;
      case 'header-menu':
        div.innerHTML = `<ul style="width: 100%;display: block;margin: 0;height: 48px;"></ul>`;
        break;
      case 'menu':
        div.innerHTML = `<ul nz-menu [nzMode]="'inline'" style="width: 240px;">
      <li nz-submenu>
        <span title><i nz-icon type="mail"></i> Navigation One</span>
        <ul>
          <li nz-menu-group>
            <span title>Item 1</span>
            <ul>
              <li nz-menu-item>Option 1</li>
              <li nz-menu-item>Option 2</li>
            </ul>
          </li>
          <li nz-menu-group>
            <span title>Item 2</span>
            <ul>
              <li nz-menu-item>Option 3</li>
              <li nz-menu-item>Option 4</li>
            </ul>
          </li>
        </ul>
      </li>
      <li nz-submenu>
        <span title><i nz-icon type="appstore"></i> Navigation Two</span>
        <ul>
          <li nz-menu-item>Option 5</li>
          <li nz-menu-item>Option 6</li>
          <li nz-submenu>
            <span title>Submenu</span>
            <ul>
              <li nz-menu-item>Option 7</li>
              <li nz-menu-item>Option 8</li>
              <li nz-submenu>
                <span title>Submenu</span>
                <ul>
                  <li nz-menu-item>Option 9</li>
                  <li nz-menu-item>Option 10</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li nz-submenu>
        <span title><i nz-icon type="setting"></i> Navigation Three</span>
        <ul>
          <li nz-menu-item>Option 11</li>
          <li nz-menu-item>Option 12</li>
          <li nz-menu-item>Option 13</li>
        </ul>
      </li>
    </ul>`;
        break;
    }*/
  }

  getHtmlJson(key): string {
    return '';
    /*switch (key) {
      case 'input':
        return '<input nz-input>';
        break;
      case 'top-center-bottom':
        return `<nz-layout>
  <nz-header></nz-header>
  <nz-content></nz-content>
  <nz-footer></nz-footer>
</nz-layout>`;
      case 'top-right-content':
        return `<nz-layout>
      <nz-header></nz-header>
      <nz-layout>
        <nz-sider></nz-sider>
        <nz-content></nz-content>
      </nz-layout>
      <nz-footer></nz-footer>
    </nz-layout>`;
        break;
      case 'top-left-content':
        return `<nz-layout>
      <nz-sider></nz-sider>
      <nz-layout>
        <nz-header></nz-header>
        <nz-content></nz-content>
        <nz-footer></nz-footer>
      </nz-layout>
    </nz-layout>`;
        break;
      case 'breadcrumb':
        return `<nz-breadcrumb>
      <nz-breadcrumb-item>
        Home
      </nz-breadcrumb-item>
      <nz-breadcrumb-item>
        <a>Application List</a>
      </nz-breadcrumb-item>
      <nz-breadcrumb-item>
        An Application
      </nz-breadcrumb-item>
    </nz-breadcrumb>`;
        break;
      case 'header-menu':
        return `
        <ul nz-menu [nzMode]="'horizontal'" [nzTheme]="'dark'" style="line-height: 64px;">
      <li nz-menu-item><i nz-icon type="mail"></i> Navigation One</li>
      <li nz-submenu>
        <span title><i nz-icon type="setting"></i> Navigation Three - Submenu</span>
        <ul>
          <li nz-menu-group>
            <span title>Item 1</span>
            <ul>
              <li nz-menu-item>Option 1</li>
              <li nz-menu-item>Option 2</li>
            </ul>
          </li>
          <li nz-menu-group>
            <span title>Item 2</span>
            <ul>
              <li nz-menu-item>Option 3</li>
              <li nz-menu-item>Option 4</li>
              <li nz-submenu>
                <span title>Sub Menu</span>
                <ul>
                  <li nz-menu-item nzDisabled>Option 5</li>
                  <li nz-menu-item>Option 6</li>
                </ul>
              </li>
              <li nz-submenu nzDisabled>
                <span title>Disabled Sub Menu</span>
                <ul>
                  <li nz-menu-item>Option 5</li>
                  <li nz-menu-item>Option 6</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li nz-menu-item>
        <a href="https://ng.ant.design" target="_blank" rel="noopener noreferrer">Navigation Four - Link</a>
      </li>
    </ul>`;
        break;
      case 'menu':
        return `<ul nz-menu [nzMode]="'inline'" style="width: 240px;">
      <li nz-submenu>
        <span title><i nz-icon type="mail"></i> Navigation One</span>
        <ul>
          <li nz-menu-group>
            <span title>Item 1</span>
            <ul>
              <li nz-menu-item>Option 1</li>
              <li nz-menu-item>Option 2</li>
            </ul>
          </li>
          <li nz-menu-group>
            <span title>Item 2</span>
            <ul>
              <li nz-menu-item>Option 3</li>
              <li nz-menu-item>Option 4</li>
            </ul>
          </li>
        </ul>
      </li>
      <li nz-submenu>
        <span title><i nz-icon type="appstore"></i> Navigation Two</span>
        <ul>
          <li nz-menu-item>Option 5</li>
          <li nz-menu-item>Option 6</li>
          <li nz-submenu>
            <span title>Submenu</span>
            <ul>
              <li nz-menu-item>Option 7</li>
              <li nz-menu-item>Option 8</li>
              <li nz-submenu>
                <span title>Submenu</span>
                <ul>
                  <li nz-menu-item>Option 9</li>
                  <li nz-menu-item>Option 10</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li nz-submenu>
        <span title><i nz-icon type="setting"></i> Navigation Three</span>
        <ul>
          <li nz-menu-item>Option 11</li>
          <li nz-menu-item>Option 12</li>
          <li nz-menu-item>Option 13</li>
        </ul>
      </li>
    </ul>`;
        break;
    }*/
  }
}




