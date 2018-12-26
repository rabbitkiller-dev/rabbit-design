import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  template: `
    <div style="height: 100%;display: flex;flex-direction: column;">
      <div id="tools-page-editor__dropList" style="flex: 1;" cdkDropList (cdkDropListEntered)="oncdkDropListEntered($event)"></div>
      <div class="editor-stage-footer">
      </div>
    </div>
  `,
  styles: []
})
export class PageEditorInterface {
  constructor() {
  }

  oncdkDropListEntered($event) {
    console.log($event);
  }
}
