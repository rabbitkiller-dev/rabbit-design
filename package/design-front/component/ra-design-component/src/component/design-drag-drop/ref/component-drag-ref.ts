import {RaDesignDragDirective} from '../ra-design-drag.directive';
import {FlowDragRef} from './flow-drag-ref';
import {Point} from './interface/point';

export class ComponentDragRef extends FlowDragRef<{children: any[]}> {
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
    const drag = this.findDrag(event, 'stage-bar-item');
    if (drag) {
      const target = drag.getRootElement();
      const clientRect = target.getBoundingClientRect();

      const isHorizontal = true; // this._orientation === 'horizontal';
      const index = isHorizontal ?
        // Round these down since most browsers report client rects with
        // sub-pixel precision, whereas the pointer coordinates are rounded to pixels.
        x >= Math.floor(clientRect.left - (clientRect.width / 2)) && x <= Math.floor(clientRect.right - (clientRect.width / 2)) :
        y >= Math.floor(clientRect.top - (clientRect.height / 2)) && y <= Math.floor(clientRect.bottom - (clientRect.height / 2));
      if (index) {
        target.parentNode.insertBefore(this._placeholder, target);
      } else {
        target.nextSibling ? target.parentNode.insertBefore(this._placeholder, target.nextSibling) : target.parentNode.appendChild(this._placeholder);
      }
    }
    super._updateActiveDropContainer(event, {x, y});
  }
}
