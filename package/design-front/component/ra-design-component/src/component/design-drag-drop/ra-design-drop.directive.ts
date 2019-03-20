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
// import {DOCUMENT} from '@angular/common';
// import {Directionality} from '@angular/cdk/bidi';
// import {RaDesignDragDirective} from './ra-design-drag.directive';
// import {RaDesignDragRef} from './ra-design-drag.ref';
// import {CdkDropListContainer, DragDropRegistry} from '../cdk-drag-drop';
// import {DesignDragDrop} from './ra-design-drag-events';
// import {DropListRef} from '../cdk-drag-drop/drop-list-ref';


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
    // '[class.cdk-drop-list-dragging]': '_dropListRef.isDragging()',
    // '[class.cdk-drop-list-receiving]': '_dropListRef.isReceiving()',
  }
})
export class RaDesignDropDirective<T = any> implements OnDestroy {

  @Input('designDrop') type: string;

  constructor(
    public ElementRef: ElementRef,
    public Renderer2: Renderer2,
  ) {
    this.Renderer2.setProperty(ElementRef.nativeElement, 'designDragDrop', this);
  }

  ngOnDestroy() {
  }

}
