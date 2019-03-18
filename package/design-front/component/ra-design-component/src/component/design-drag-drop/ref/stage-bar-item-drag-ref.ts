import {RaDesignDragDirective} from '../ra-design-drag.directive';
import {FlowDragRef} from './flow-drag-ref';
import {Point} from './interface/point';

export class StageBarItemDragRef extends FlowDragRef {
  constructor(public DesignDragDirective: RaDesignDragDirective) {
    super(DesignDragDirective);
  }

  _updateActiveDropContainer(event: MouseEvent | TouchEvent, {x, y}: Point) {
    const drag = this.findDrag(event, 'stage-bar-item');
    if (drag) {
      // console.log(drag);
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
