import {RaDesignDragDirective} from '../ra-design-drag.directive';
import {FlowDragRef} from './flow-drag-ref';

export class DynamicUnitDragRef extends FlowDragRef<null> {
  constructor(public DesignDragDirective: RaDesignDragDirective) {
    super(DesignDragDirective);
  }
}
