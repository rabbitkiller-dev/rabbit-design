/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {coerceArray, coerceBooleanProperty} from '@angular/cdk/coercion';
import {
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  QueryList,
  Optional,
  Directive,
  ChangeDetectorRef,
  SkipSelf,
  Inject, HostBinding, Renderer2,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Directionality} from '@angular/cdk/bidi';
import {RaDesignDragDirective} from './ra-design-drag.directive';
import {RaDesignDragRef} from './ra-design-drag.ref';
import {DragRefInternal as DragRef} from '../cdk-drag-drop/drag-ref';
import {DropListRef} from '../cdk-drag-drop/drop-list-ref';
import {CdkDrag, CdkDropListContainer, DragDropRegistry, moveItemInArray} from '../cdk-drag-drop';
import {DesignDragDrop} from './ra-design-drag-events';
/**
 * Object used to cache the position of a drag list, its items. and siblings.
 * @docs-private
 */
interface PositionCache {
  /** Cached positions of the items in the list. */
  items: ItemPositionCacheEntry[];
  /** Cached positions of the connected lists. */
  siblings: ListPositionCacheEntry[];
  /** Dimensions of the list itself. */
  self: ClientRect;
}

/**
 * Entry in the position cache for draggable items.
 * @docs-private
 */
interface ItemPositionCacheEntry {
  /** Instance of the drag item. */
  drag: RaDesignDragRef;
  /** Dimensions of the item. */
  clientRect: ClientRect;
  /** Amount by which the item has been moved since dragging started. */
  offset: number;
}

/**
 * Entry in the position cache for drop lists.
 * @docs-private
 */
interface ListPositionCacheEntry {
  /** Instance of the drop list. */
  drop: DropListRef;
  /** Dimensions of the list. */
  clientRect: ClientRect;
}

/** Counter used to generate unique ids for drop zones. */
let _uniqueIdCounter = 0;

/**
 * Internal compile-time-only representation of a `CdkDropList`.
 * Used to avoid circular import issues between the `CdkDropList` and the `CdkDrag`.
 * @docs-private
 */
// export interface CdkDropListInternal extends CdkDropList {}

// @breaking-change 8.0.0 `CdkDropList` implements `CdkDropListContainer` for backwards
// compatiblity. The implements clause, as well as all the methods that it enforces can
// be removed when `CdkDropListContainer` is deleted.

/**
 * Proximity, as a ratio to width/height, at which a
 * dragged item will affect the drop container.
 */
const DROP_PROXIMITY_THRESHOLD = 0.05;

/** Container that wraps a set of draggable items. */
@Directive({
  selector: '[designDrop], design-drop',
  exportAs: 'designDrop',
  host: {
    'class': 'cdk-drop-list',
    // '[attr.dragging]': 'isDragging()',
    // '[id]': 'id',
    // '[class.cdk-drop-list-dragging]': 'isDragging()',
    // '[class.cdk-drop-list-receiving]': '_dropListRef.isReceiving()',
  }
})
export class RaDesignDropDirective<T> {

  @HostBinding('class.cdk-drop-list-dragging') _isDragging;

  /** Cache of the dimensions of all the items and the sibling containers. */
  private _positionCache: PositionCache = {items: [], siblings: [], self: {} as ClientRect};


  /** Direction in which the list is oriented. */
  @Input() orientation: 'horizontal' | 'vertical' = 'vertical';

  /** Emits when the user drops an item inside the container. */
  @Output('designDropped')
  dropped: EventEmitter<DesignDragDrop<T, any>> = new EventEmitter<DesignDragDrop<T, any>>();

  /** Locks the position of the draggable elements inside the container along the specified axis. */
  lockAxis: 'x' | 'y';
  /** Draggable items in the container. */
  @ContentChildren(forwardRef(() => RaDesignDragDirective)) _draggables: QueryList<RaDesignDragDirective>;
  /**
   * Draggable items that are currently active inside the container. Includes the items
   * from `_draggables`, as well as any items that have been dragged in, but haven't
   * been dropped yet.
   */
  private _activeDraggables: RaDesignDragRef[];


  /**
   * Keeps track of the item that was last swapped with the dragged item, as
   * well as what direction the pointer was moving in when the swap occured.
   */
  private _previousSwap = {drag: null as RaDesignDragRef | null, delta: 0};
  /**
   * Function that is used to determine whether an item
   * is allowed to be moved into a drop container.
   */
  @Input()
  enterPredicate: (drag: RaDesignDragDirective<any>, drop: RaDesignDropDirective<any>) => boolean = () => true;

  constructor(
    public element: ElementRef<HTMLElement>,
    // dragDropRegistry: DragDropRegistry<DragRef, DropListRef>,
    private _changeDetectorRef: ChangeDetectorRef,
    private Renderer2: Renderer2,
    private _dragDropRegistry: DragDropRegistry<RaDesignDragRef, any>,
    @Optional() private dir?: Directionality,
    // @breaking-change 8.0.0 `_document` parameter to be made required.
    @Optional() @Inject(DOCUMENT) _document?: any) {
    this.Renderer2.setProperty(this.element.nativeElement, 'designDrop', this);
  }

  start(): void {
    // this.beforeStarted.next();
    this._isDragging = true;
    this._changeDetectorRef.markForCheck();
    this._activeDraggables = this._draggables.map(drag => drag._dragRef).slice();
    this._cachePositions();
    this._positionCache.siblings.forEach(sibling => sibling.drop._toggleIsReceiving(true));
  }

  @Input()
  enter: (item: RaDesignDragDirective, pointerX: number, pointerY: number, pointerDelta: { x: number, y: number }) => void =
    (item: RaDesignDragDirective, pointerX: number, pointerY: number, pointerDelta: { x: number, y: number }) => {
      // Don't sort the item if it's out of range.
      if (!this._isPointerNearDropContainer(pointerX, pointerY)) {
        return;
      }

      const siblings = this._positionCache.items;
      const newIndex = this._getItemIndexFromPointerPosition(item._dragRef, pointerX, pointerY, pointerDelta);
      if (newIndex === -1 && siblings.length > 0) {
        return;
      }

      const isHorizontal = this.orientation === 'horizontal';
      const currentIndex = findIndex(siblings, currentItem => currentItem.drag === item._dragRef);
      const siblingAtNewPosition = siblings[newIndex];
      const currentPosition = siblings[currentIndex].clientRect;
      const newPosition = siblingAtNewPosition.clientRect;
      const delta = currentIndex > newIndex ? 1 : -1;

      this._previousSwap.drag = siblingAtNewPosition.drag;
      this._previousSwap.delta = isHorizontal ? pointerDelta.x : pointerDelta.y;

      // How many pixels the item's placeholder should be offset.
      const itemOffset = this._getItemOffsetPx(currentPosition, newPosition, delta);

      // How many pixels all the other items should be offset.
      const siblingOffset = this._getSiblingOffsetPx(currentIndex, siblings, delta);

      // Save the previous order of the items before moving the item to its new index.
      // We use this to check whether an item has been moved as a result of the sorting.
      const oldOrder = siblings.slice();

      // Shuffle the array in place.
      moveItemInArray(siblings, currentIndex, newIndex);

      // this.sorted.next({
      //   previousIndex: currentIndex,
      //   currentIndex: newIndex,
      //   container: this,
      //   item
      // });

      siblings.forEach((sibling, index) => {
        // Don't do anything if the position hasn't changed.
        if (oldOrder[index] === sibling) {
          return;
        }

        const isDraggedItem = sibling.drag === item._dragRef;
        console.log(isDraggedItem);
        const offset = isDraggedItem ? itemOffset : siblingOffset;
        const elementToOffset = isDraggedItem ? item._dragRef.getPlaceholderElement() :
          sibling.drag.getRootElement();

        // Update the offset to reflect the new position.
        sibling.offset += offset;

        // Since we're moving the items with a `transform`, we need to adjust their cached
        // client rects to reflect their new position, as well as swap their positions in the cache.
        // Note that we shouldn't use `getBoundingClientRect` here to update the cache, because the
        // elements may be mid-animation which will give us a wrong result.
        if (isHorizontal) {
          // Round the transforms since some browsers will
          // blur the elements, for sub-pixel transforms.
          elementToOffset.style.transform = `translate3d(${Math.round(sibling.offset)}px, 0, 0)`;
          adjustClientRect(sibling.clientRect, 0, offset);
        } else {
          elementToOffset.style.transform = `translate3d(0, ${Math.round(sibling.offset)}px, 0)`;
          adjustClientRect(sibling.clientRect, offset, 0);
        }
      });
    };

  /**
   * Drops an item into this container.
   * @param item Item being dropped into the container.
   * @param currentIndex Index at which the item should be inserted.
   * @param previousContainer Container from which the item got dragged in.
   * @param isPointerOverContainer Whether the user's pointer was over the
   *    container when the item was dropped.
   */
  drop(item: RaDesignDragRef<any>, currentIndex: number, previousContainer: Partial<RaDesignDropDirective<any>>,
       isPointerOverContainer: boolean): void {
    // this._dropListRef.drop(item._dragRef, currentIndex,
    //   (previousContainer as CdkDropList)._dropListRef, isPointerOverContainer);
    this._reset();
    // this.dropped.emit({
    //   previousIndex: event.previousIndex,
    //   currentIndex: event.currentIndex,
    //   previousContainer: event.previousContainer.data,
    //   container: event.container.data,
    // });
    this.dropped.next({
      item: item,
      currentIndex,
      previousIndex: previousContainer.getItemIndex(item),
      container: this,
      previousContainer,
      isPointerOverContainer: isPointerOverContainer
    });
  }

  /** Resets the container to its initial state. */
  private _reset() {
    this._isDragging = false;

    // TODO(crisbeto): may have to wait for the animations to finish.
    this._activeDraggables.forEach(item => item.getRootElement().style.transform = '');
    this._positionCache.siblings.forEach(sibling => sibling.drop._toggleIsReceiving(false));
    this._activeDraggables = [];
    this._positionCache.items = [];
    this._positionCache.siblings = [];
    this._previousSwap.drag = null;
    this._previousSwap.delta = 0;
  }
  /**
   * Gets the offset in pixels by which the item that is being dragged should be moved.
   * @param currentPosition Current position of the item.
   * @param newPosition Position of the item where the current item should be moved.
   * @param delta Direction in which the user is moving.
   */
  private _getItemOffsetPx(currentPosition: ClientRect, newPosition: ClientRect, delta: 1 | -1) {
    const isHorizontal = this.orientation === 'horizontal';
    let itemOffset = isHorizontal ? newPosition.left - currentPosition.left :
      newPosition.top - currentPosition.top;

    // Account for differences in the item width/height.
    if (delta === -1) {
      itemOffset += isHorizontal ? newPosition.width - currentPosition.width :
        newPosition.height - currentPosition.height;
    }

    return itemOffset;
  }

  /**
   * Gets the offset in pixels by which the items that aren't being dragged should be moved.
   * @param currentIndex Index of the item currently being dragged.
   * @param siblings All of the items in the list.
   * @param delta Direction in which the user is moving.
   */
  private _getSiblingOffsetPx(currentIndex: number,
                              siblings: ItemPositionCacheEntry[],
                              delta: 1 | -1) {

    const isHorizontal = this.orientation === 'horizontal';
    const currentPosition = siblings[currentIndex].clientRect;
    const immediateSibling = siblings[currentIndex + delta * -1];
    let siblingOffset = currentPosition[isHorizontal ? 'width' : 'height'] * delta;

    if (immediateSibling) {
      const start = isHorizontal ? 'left' : 'top';
      const end = isHorizontal ? 'right' : 'bottom';

      // Get the spacing between the start of the current item and the end of the one immediately
      // after it in the direction in which the user is dragging, or vice versa. We add it to the
      // offset in order to push the element to where it will be when it's inline and is influenced
      // by the `margin` of its siblings.
      if (delta === -1) {
        siblingOffset -= immediateSibling.clientRect[start] - currentPosition[end];
      } else {
        siblingOffset += currentPosition[start] - immediateSibling.clientRect[end];
      }
    }

    return siblingOffset;
  }

  /**
   * Checks whether the pointer coordinates are close to the drop container.
   * @param pointerX Coordinates along the X axis.
   * @param pointerY Coordinates along the Y axis.
   */
  private _isPointerNearDropContainer(pointerX: number, pointerY: number): boolean {
    const {top, right, bottom, left, width, height} = this._positionCache.self;
    const xThreshold = width * DROP_PROXIMITY_THRESHOLD;
    const yThreshold = height * DROP_PROXIMITY_THRESHOLD;

    return pointerY > top - yThreshold && pointerY < bottom + yThreshold &&
      pointerX > left - xThreshold && pointerX < right + xThreshold;
  }

  /** Refreshes the position cache of the items and sibling containers. */
  private _cachePositions() {
    const isHorizontal = this.orientation === 'horizontal';

    this._positionCache.self = this.element.nativeElement.getBoundingClientRect();
    this._positionCache.items = this._activeDraggables
      .map(drag => {
        const elementToMeasure = this._dragDropRegistry.isDragging(drag) ?
          // If the element is being dragged, we have to measure the
          // placeholder, because the element is hidden.
          drag.getPlaceholderElement() :
          drag.getRootElement();
        const clientRect = elementToMeasure.getBoundingClientRect();

        return {
          drag,
          offset: 0,
          // We need to clone the `clientRect` here, because all the values on it are readonly
          // and we need to be able to update them. Also we can't use a spread here, because
          // the values on a `ClientRect` aren't own properties. See:
          // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect#Notes
          clientRect: {
            top: clientRect.top,
            right: clientRect.right,
            bottom: clientRect.bottom,
            left: clientRect.left,
            width: clientRect.width,
            height: clientRect.height
          }
        };
      })
      .sort((a, b) => {
        return isHorizontal ? a.clientRect.left - b.clientRect.left :
          a.clientRect.top - b.clientRect.top;
      });

    // this._positionCache.siblings = this._siblings.map(drop => ({
    //   drop,
    //   clientRect: drop.element.nativeElement.getBoundingClientRect()
    // }));
  }

  /**
   * Gets the index of an item in the drop container, based on the position of the user's pointer.
   * @param item Item that is being sorted.
   * @param pointerX Position of the user's pointer along the X axis.
   * @param pointerY Position of the user's pointer along the Y axis.
   * @param delta Direction in which the user is moving their pointer.
   */
  private _getItemIndexFromPointerPosition(item: RaDesignDragRef, pointerX: number, pointerY: number,
                                           delta?: { x: number, y: number }) {

    const isHorizontal = this.orientation === 'horizontal';

    return findIndex(this._positionCache.items, ({drag, clientRect}, _, array) => {
      if (drag === item) {
        // If there's only one item left in the container, it must be
        // the dragged item itself so we use it as a reference.
        return array.length < 2;
      }

      if (delta) {
        const direction = isHorizontal ? delta.x : delta.y;

        // If the user is still hovering over the same item as last time, and they didn't change
        // the direction in which they're dragging, we don't consider it a direction swap.
        if (drag === this._previousSwap.drag && direction === this._previousSwap.delta) {
          return false;
        }
      }

      return isHorizontal ?
        // Round these down since most browsers report client rects with
        // sub-pixel precision, whereas the pointer coordinates are rounded to pixels.
        pointerX >= Math.floor(clientRect.left) && pointerX <= Math.floor(clientRect.right) :
        pointerY >= Math.floor(clientRect.top) && pointerY <= Math.floor(clientRect.bottom);
    });
  }
  /**
   * Figures out the index of an item in the container.
   * @param item Item whose index should be determined.
   */
  getItemIndex(item: RaDesignDragRef): number {
    if (!this._isDragging) {
      return this._draggables.map(drag => drag._dragRef).indexOf(item);
    }

    // Items are sorted always by top/left in the cache, however they flow differently in RTL.
    // The rest of the logic still stands no matter what orientation we're in, however
    // we need to invert the array when determining the index.
    const items = this.orientation === 'horizontal' && this.dir && this.dir.value === 'rtl' ?
      this._positionCache.items.slice().reverse() : this._positionCache.items;

    return findIndex(items, currentItem => currentItem.drag === item);
  }
  /**
   * Checks whether the user's pointer is positioned over the container.
   * @param x Pointer position along the X axis.
   * @param y Pointer position along the Y axis.
   */
  _isOverContainer(x: number, y: number): boolean {
    return isInsideClientRect(this._positionCache.self, x, y);
  }
}

/**
 * Finds the index of an item that matches a predicate function. Used as an equivalent
 * of `Array.prototype.find` which isn't part of the standard Google typings.
 * @param array Array in which to look for matches.
 * @param predicate Function used to determine whether an item is a match.
 */
function findIndex<T>(array: T[],
                      predicate: (value: T, index: number, obj: T[]) => boolean): number {

  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i, array)) {
      return i;
    }
  }

  return -1;
}

/**
 * Updates the top/left positions of a `ClientRect`, as well as their bottom/right counterparts.
 * @param clientRect `ClientRect` that should be updated.
 * @param top Amount to add to the `top` position.
 * @param left Amount to add to the `left` position.
 */
function adjustClientRect(clientRect: ClientRect, top: number, left: number) {
  clientRect.top += top;
  clientRect.bottom = clientRect.top + clientRect.height;

  clientRect.left += left;
  clientRect.right = clientRect.left + clientRect.width;
}


/**
 * Checks whether some coordinates are within a `ClientRect`.
 * @param clientRect ClientRect that is being checked.
 * @param x Coordinates along the X axis.
 * @param y Coordinates along the Y axis.
 */
function isInsideClientRect(clientRect: ClientRect, x: number, y: number) {
  const {top, bottom, left, right} = clientRect;
  return y >= top && y <= bottom && x >= left && x <= right;
}
