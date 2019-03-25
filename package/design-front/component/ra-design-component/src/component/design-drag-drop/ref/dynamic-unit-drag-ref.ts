import {RaDesignDragDirective} from '../ra-design-drag.directive';
import {FlowDragRef} from './flow-drag-ref';
import {Point} from './interface/point';

export class DynamicUnitDragRef extends FlowDragRef<null> {
  constructor(public DesignDragDirective: RaDesignDragDirective) {
    super(DesignDragDirective);
  }

  _updateActiveDropContainer(event: MouseEvent | TouchEvent, {x, y}: Point) {
    const drag = this.findDrag(event, 'dynamic-unit');
    super._updateActiveDropContainer(event, {x, y});
  }
}
