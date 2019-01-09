import {Component, OnDestroy, OnInit} from '@angular/core';
import {RaDesignDragDirective, RaDesignDropDirective} from '../../design-drag-drop';

@Component({
  template: `
    <div style="height: 100%;display: flex;flex-direction: column;">
      <div id="tools-page-editor__dropList" style="flex: 1;" designDrop [enterPredicate]="enterPredicate"
           (designDropped)="onDesignDropped($event)"></div>
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

  enterPredicate(drag: RaDesignDragDirective<any>, drop: RaDesignDropDirective<any>) {
    return drag.designDragType === 'tools-component';
  }

  onDesignDropped($event) {

  }
}
