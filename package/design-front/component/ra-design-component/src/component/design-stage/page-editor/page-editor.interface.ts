import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  template: `
    <div style="height: 100%;display: flex;">
      <div style="flex: 1;"></div>
      <div class="editor-stage-footer">
      </div>
    </div>
  `,
  styles: []
})
export class PageEditorInterface {
  constructor() {
  }
}
