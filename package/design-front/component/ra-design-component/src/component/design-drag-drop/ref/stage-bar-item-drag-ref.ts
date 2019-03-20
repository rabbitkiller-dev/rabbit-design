import {RaDesignDragDirective} from '../ra-design-drag.directive';
import {FlowDragRef} from './flow-drag-ref';
import {Point} from './interface/point';
import {RaDesignStageService} from '../../design-stage/ra-design-stage.service';

export class StageBarItemDragRef extends FlowDragRef {
  newIndex: number;
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
      this.newIndex = Array.prototype.indexOf.call(this._placeholder.parentNode.children, this._placeholder);
    }
    super._updateActiveDropContainer(event, {x, y});
  }

  _cleanupDragArtifacts(event: MouseEvent | TouchEvent) {
    super._cleanupDragArtifacts(event);
    this.NgZone.run(() => {
      const currentIndex = Array.prototype.indexOf.call(this._rootElement.parentNode.children, this._rootElement);
      this.Injector.get(RaDesignStageService).moveItemInArray(currentIndex, this.newIndex);
    });
  }
}
