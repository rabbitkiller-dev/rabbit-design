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
import {CdkDropListContainer, DragDropRegistry} from '../cdk-drag-drop';
import {DesignDragDrop} from './ra-design-drag-events';
import {RaDesignDropRef} from './ra-design-drop.ref';
import {DropListRef} from '../cdk-drag-drop/drop-list-ref';

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
  drop: RaDesignDropRef;
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

/** Container that wraps a set of draggable items. */
@Directive({
  selector: '[designDrop], design-drop',
  exportAs: 'designDrop',
  host: {
    'class': 'cdk-drop-list',
    // '[attr.dragging]': 'isDragging()',
    // '[id]': 'id',
    '[class.cdk-drop-list-dragging]': '_dropListRef.isDragging()',
    // '[class.cdk-drop-list-receiving]': '_dropListRef.isReceiving()',
  }
})
export class RaDesignDropDirective<T = any> implements OnDestroy {
  /** Keeps track of the drop lists that are currently on the page. */
  private static _dropLists: RaDesignDropDirective[] = [];

  /** Reference to the underlying drop list instance. */
  _dropListRef: RaDesignDropRef<RaDesignDropDirective<T>>;

  /** Draggable items in the container. */
  @ContentChildren(forwardRef(() => RaDesignDragDirective)) _draggables: QueryList<RaDesignDragDirective>;


  /** Arbitrary data to attach to this container. */
  @Input('cdkDropListData') data: T;
  @Input() designDropType: string;

  /** Direction in which the list is oriented. */
  @Input() orientation: 'horizontal' | 'vertical' = 'vertical';


  /** Locks the position of the draggable elements inside the container along the specified axis. */
  @Input('cdkDropListLockAxis') lockAxis: 'x' | 'y';

  /** Whether starting a dragging sequence from this container is disabled. */
  @Input('cdkDropListDisabled')
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  /**
   * Function that is used to determine whether an item
   * is allowed to be moved into a drop container.
   */
  @Input()
  enterPredicate: (drag: RaDesignDragDirective<any>, drop: RaDesignDropDirective<any>) => boolean = () => true;

  /** Emits when the user drops an item inside the container. */
  @Output('designDropped')
  dropped: EventEmitter<DesignDragDrop<T, any>> = new EventEmitter<DesignDragDrop<T, any>>();

  constructor(
    public element: ElementRef<HTMLElement>,
    dragDropRegistry: DragDropRegistry<RaDesignDragRef, RaDesignDropRef>,
    private _changeDetectorRef: ChangeDetectorRef,
    private Renderer2: Renderer2,
    @Optional() dir?: Directionality,
    // @breaking-change 8.0.0 `_document` parameter to be made required.
    @Optional() @Inject(DOCUMENT) _document?: any) {


    this.Renderer2.setProperty(this.element.nativeElement, 'designDrop', this);
    // @breaking-change 8.0.0 Remove || once `_document` parameter is required.
    const ref = this._dropListRef = new RaDesignDropRef(element, dragDropRegistry,
        _document || document, dir);
    ref.data = this;
    ref.enterPredicate = (drag: RaDesignDragRef<RaDesignDragDirective>, drop: RaDesignDropRef<RaDesignDropDirective>) => {
      return this.enterPredicate(drag.data, drop.data);
    };
    this._syncInputs(ref);
    this._proxyEvents(ref);
    RaDesignDropDirective._dropLists.push(this);

  }

  ngOnDestroy() {
    const index = RaDesignDropDirective._dropLists.indexOf(this);
    this._dropListRef.dispose();

    if (index > -1) {
      RaDesignDropDirective._dropLists.splice(index, 1);
    }
  }

  /** Starts dragging an item. */
  start(): void {
    this._dropListRef.start();
  }

  /**
   * Drops an item into this container.
   * @param item Item being dropped into the container.
   * @param currentIndex Index at which the item should be inserted.
   * @param previousContainer Container from which the item got dragged in.
   * @param isPointerOverContainer Whether the user's pointer was over the
   *    container when the item was dropped.
   */
  drop(item: RaDesignDragDirective, currentIndex: number, previousContainer: Partial<RaDesignDropDirective>,
    isPointerOverContainer: boolean): void {
    this._dropListRef.drop(item._dragRef, currentIndex,
      (previousContainer as RaDesignDropDirective)._dropListRef, isPointerOverContainer);
  }

  /**
   * Emits an event to indicate that the user moved an item into the container.
   * @param item Item that was moved into the container.
   * @param pointerX Position of the item along the X axis.
   * @param pointerY Position of the item along the Y axis.
   */
  enter(item: RaDesignDragDirective, pointerX: number, pointerY: number): void {
    this._dropListRef.enter(item._dragRef, pointerX, pointerY);
  }

  /**
   * Removes an item from the container after it was dragged into another container by the user.
   * @param item Item that was dragged out.
   */
  exit(item: RaDesignDragDirective): void {
    this._dropListRef.exit(item._dragRef);
  }

  /**
   * Figures out the index of an item in the container.
   * @param item Item whose index should be determined.
   */
  getItemIndex(item: RaDesignDragDirective): number {
    return this._dropListRef.getItemIndex(item._dragRef);
  }

  /**
   * Sorts an item inside the container based on its position.
   * @param item Item to be sorted.
   * @param pointerX Position of the item along the X axis.
   * @param pointerY Position of the item along the Y axis.
   * @param pointerDelta Direction in which the pointer is moving along each axis.
   */
  _sortItem(item: RaDesignDragDirective, pointerX: number, pointerY: number,
            pointerDelta: {x: number, y: number}): void {
    return this._dropListRef._sortItem(item._dragRef, pointerX, pointerY, pointerDelta);
  }

  /**
   * Figures out whether an item should be moved into a sibling
   * drop container, based on its current position.
   * @param item Drag item that is being moved.
   * @param x Position of the item along the X axis.
   * @param y Position of the item along the Y axis.
   */
  _getSiblingContainerFromPosition(item: RaDesignDragDirective, x: number, y: number):
    CdkDropListContainer | null {
    const result = this._dropListRef._getSiblingContainerFromPosition(item._dragRef, x, y);
    return result ? result.data : null;
  }

  /**
   * Checks whether the user's pointer is positioned over the container.
   * @param x Pointer position along the X axis.
   * @param y Pointer position along the Y axis.
   */
  _isOverContainer(x: number, y: number): boolean {
    return this._dropListRef._isOverContainer(x, y);
  }

  /** Syncs the inputs of the CdkDropList with the options of the underlying DropListRef. */
  private _syncInputs(ref: RaDesignDropRef<RaDesignDropDirective>) {
    ref.beforeStarted.subscribe(() => {
      ref.lockAxis = this.lockAxis;
      ref
        .connectedTo([].filter(drop => drop && drop !== this).map(list => list._dropListRef))
        .withOrientation(this.orientation)
        .withItems(this._draggables.map(drag => drag._dragRef));
    });
  }
  /**
   * Proxies the events from a DropListRef to events that
   * match the interfaces of the CdkDropList outputs.
   */
  private _proxyEvents(ref: RaDesignDropRef<RaDesignDropDirective>) {
    ref.beforeStarted.subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });

    ref.dropped.subscribe(event => {
      this.dropped.emit({
        previousIndex: event.previousIndex,
        currentIndex: event.currentIndex,
        previousContainer: event.previousContainer.data,
        container: event.container.data,
        item: event.item.data,
        isPointerOverContainer: event.isPointerOverContainer
      });
    });
  }

}
