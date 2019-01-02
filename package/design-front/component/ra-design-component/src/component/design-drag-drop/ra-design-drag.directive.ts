/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directionality} from '@angular/cdk/bidi';
import {ViewportRuler} from '@angular/cdk/scrolling';
import {DOCUMENT} from '@angular/common';
import {
  AfterViewInit,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter, forwardRef, HostBinding,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  Optional,
  ViewContainerRef,
} from '@angular/core';
import {DragDropRegistry} from '../cdk-drag-drop';
import {DragRefConfig} from './ra-design-drag.ref';
import {RaDesignDragRef} from './ra-design-drag.ref';

/** Injection token that can be used to configure the behavior of `CdkDrag`. */
export const DESIGN_DRAG_CONFIG = new InjectionToken<DragRefConfig>('DESIGN_DRAG_CONFIG', {
  providedIn: 'root',
  factory: DESIGN_DRAG_CONFIG_FACTORY
});

/** @docs-private */
export function DESIGN_DRAG_CONFIG_FACTORY(): DragRefConfig {
  return {dragStartThreshold: 5, pointerDirectionChangeThreshold: 5};
}

/** Element that can be moved inside a CdkDropList container. */
@Directive({
  selector: '[designDrag]',
  exportAs: 'designDrag',
  host: {
    '[class.cdk-drag]': 'true',
    '[class.cdk-drag-dragging]': '_dragRef.isDragging()',
  }
})
export class RaDesignDragDirective<T = any> {

  /** Reference to the underlying drag instance. */
  _dragRef: RaDesignDragRef<RaDesignDragDirective<T>>;

  /** Arbitrary data to attach to this drag instance. */
  @Input() dragData: T;
  @Input() dragType: 'stage-task' | string;

  constructor(
    public element: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private _document: any,
    private _ngZone: NgZone,
    private _viewContainerRef: ViewContainerRef,
    private _viewportRuler: ViewportRuler,
    private _dragDropRegistry: DragDropRegistry<RaDesignDragRef, any>,
    @Inject(DESIGN_DRAG_CONFIG) private _config: DragRefConfig,
    @Optional() private _dir: Directionality) {

    const ref = this._dragRef = new RaDesignDragRef(
      element,
      this._document,
      this._ngZone,
      this._viewContainerRef,
      this._viewportRuler,
      this._dragDropRegistry,
      this._config,
      this._dir);
    ref.data = this;
  }
}
