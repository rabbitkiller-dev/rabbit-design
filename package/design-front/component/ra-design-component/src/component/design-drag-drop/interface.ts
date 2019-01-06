import {RaDesignDragDirective} from 'ra-design-component';

/** Event emitted as the user is dragging a draggable item. */
export interface DesignDragMove<T = any> {
  /** Item that is being dragged. */
  source: RaDesignDragDirective<T>;
  /** Position of the user's pointer on the page. */
  pointerPosition: {x: number, y: number};
  /** Native event that is causing the dragging. */
  event: MouseEvent | TouchEvent;
  /**
   * Indicates the direction in which the user is dragging the element along each axis.
   * `1` means that the position is increasing (e.g. the user is moving to the right or downwards),
   * whereas `-1` means that it's decreasing (they're moving to the left or upwards). `0` means
   * that the position hasn't changed.
   */
  delta: {x: -1 | 0 | 1, y: -1 | 0 | 1};
}




export * from './ref/drop.interface';
