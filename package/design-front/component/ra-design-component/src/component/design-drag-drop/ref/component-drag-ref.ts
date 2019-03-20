import {RaDesignDragDirective} from '../ra-design-drag.directive';
import {FlowDragRef} from './flow-drag-ref';
import {Point} from './interface/point';
import {RaDesignDropDirective} from 'ra-design-component';
import {Inject, Injector} from '@angular/core';
import {PageEditorService} from '../../design-stage/page-editor/page-editor.service';
import {parse} from 'himalaya';

export class ComponentDragRef extends FlowDragRef<{ children: any[] }> {
  constructor(public DesignDragDirective: RaDesignDragDirective) {
    super(DesignDragDirective);
  }

  /** Handler for the `mousedown`/`touchstart` events. */
  _pointerDown = (event: MouseEvent | TouchEvent) => {
    // TODO (@angular/cdk/cdk-drag-drop/drag-ref.ts!_pointerDown)
    if (!this.disabled && this.data.children.length === 0) {
      this._initializeDragSequence(this._rootElement, event);
    }
  }

  _updateActiveDropContainer(event: MouseEvent | TouchEvent, {x, y}: Point) {
    const drag = this.findElementUp(event);
    if (!drag) {
      super._updateActiveDropContainer(event, {x, y});
      return;
    }
    if (drag.dragDrop.type === 'page-editor') {
      ComponentDragRefUtil.pageEditor_mouseMove.call(this, drag.dragDrop, event, {x, y});
    }
    // if (drag) {
    //   const target = drag.getRootElement();
    //   const clientRect = target.getBoundingClientRect();
    //
    //   const isHorizontal = true; // this._orientation === 'horizontal';
    //   const index = isHorizontal ?
    //     // Round these down since most browsers report client rects with
    //     // sub-pixel precision, whereas the pointer coordinates are rounded to pixels.
    //     x >= Math.floor(clientRect.left - (clientRect.width / 2)) && x <= Math.floor(clientRect.right - (clientRect.width / 2)) :
    //     y >= Math.floor(clientRect.top - (clientRect.height / 2)) && y <= Math.floor(clientRect.bottom - (clientRect.height / 2));
    //   if (index) {
    //     target.parentNode.insertBefore(this._placeholder, target);
    //   } else {
    //     target.nextSibling ? target.parentNode.insertBefore(this._placeholder, target.nextSibling) : target.parentNode.appendChild(this._placeholder);
    //   }
    // }
    super._updateActiveDropContainer(event, {x, y});
  }

  protected filterElementUp(currentElement: HTMLElement & any): { type: 'drop' | 'drag', dragDrop: RaDesignDropDirective | RaDesignDragDirective } {
    if (currentElement.classList.contains('cdk-drop-list') && currentElement.designDragDrop) {
      const drop: RaDesignDropDirective = currentElement.designDragDrop;
      if (drop.type === 'page-editor') {
        return {
          type: 'drop',
          dragDrop: drop,
        };
      }
    } else if (currentElement.classList.contains('cdk-drag') && currentElement.designDragDrop) {
      const drag: RaDesignDragDirective = currentElement.designDragDrop;
      if (drag.type === 'dynamic-component') {
        return {
          type: 'drag',
          dragDrop: drag,
        };
      }
    }
  }

}

const ComponentDragRefUtil = {
  pageEditor_mouseMove: function (this: ComponentDragRef, drop: RaDesignDropDirective, event: MouseEvent | TouchEvent, {x, y}: Point) {
    const pageEditorService: PageEditorService = this.Injector.get(PageEditorService);
    pageEditorService.addRoot('<i>asdasd</i>');
  }
}
