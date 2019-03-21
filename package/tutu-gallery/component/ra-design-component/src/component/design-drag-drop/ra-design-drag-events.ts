/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {RaDesignDragDirective} from './ra-design-drag.directive';
import {RaDesignDropDirective} from './ra-design-drop.directive';

/** Event emitted when the user starts dragging a draggable. */
export interface DesignDragStart<T = any> {
  /** Draggable that emitted the event. */
  source: RaDesignDragDirective<T>;
}

/** Event emitted when the user releases an item, before any animations have started. */
export interface DesignDragRelease<T = any> {
  /** Draggable that emitted the event. */
  source: RaDesignDragDirective<T>;
}

/** Event emitted when the user stops dragging a draggable. */
export interface DesignDragEnd<T = any> {
  /** Draggable that emitted the event. */
  source: RaDesignDragDirective<T>;
}

/** Event emitted when the user moves an item into a new drop container. */
export interface DesignDragEnter<T = any, I = T> {
  /** Container into which the user has moved the item. */
  container: RaDesignDropDirective<T>;
  /** Item that was removed from the container. */
  item: RaDesignDragDirective<I>;
}

/**
 * Event emitted when the user removes an item from a
 * drop container by moving it into another one.
 */
export interface DesignDragExit<T = any, I = T> {
  /** Container from which the user has a removed an item. */
  container: RaDesignDropDirective<T>;
  /** Item that was removed from the container. */
  item: RaDesignDragDirective<I>;
}


/** Event emitted when the user drops a draggable item inside a drop container. */
export interface DesignDragDrop<T, O = T> {
  /** Index of the item when it was picked up. */
  previousIndex: number;
  /** Current index of the item. */
  currentIndex: number;
  /** Item that is being dropped. */
  item: RaDesignDragDirective<T>;
  /** Container in which the item was dropped. */
  container: RaDesignDropDirective<T>;
  /** Container from which the item was picked up. Can be the same as the `container`. */
  previousContainer: RaDesignDropDirective<O>;
  /** Whether the user's pointer was over the container when the item was dropped. */
  isPointerOverContainer: boolean;
}

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

/** Event emitted when the user swaps the position of two drag items. */
export interface DesignDragSortEvent<T = any, I = T> {
  /** Index from which the item was sorted previously. */
  previousIndex: number;
  /** Index that the item is currently in. */
  currentIndex: number;
  /** Container that the item belongs to. */
  container: RaDesignDropDirective<T>;
  /** Item that is being sorted. */
  item: RaDesignDragDirective<I>;
}
