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
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  SkipSelf,
  ViewContainerRef,
  OnChanges,
  SimpleChanges, Renderer2,
} from '@angular/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Observable, Subscription, Observer} from 'rxjs';
import {startWith, take, map} from 'rxjs/operators';
import {CdkDragHandle, CdkDragPlaceholder, CdkDragPreview, DragDropRegistry} from '../cdk-drag-drop';
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
export class RaDesignDragDirective<T = any> implements AfterViewInit, OnChanges, OnDestroy  {
  /** Subscription to the stream that initializes the root element. */
  private _rootElementInitSubscription = Subscription.EMPTY;

  /** Reference to the underlying drag instance. */
  _dragRef: RaDesignDragRef<RaDesignDragDirective<T>>;

  /** Elements that can be used to drag the draggable item. */
  @ContentChildren(CdkDragHandle, {descendants: true}) _handles: QueryList<CdkDragHandle>;

  /** Element that will be used as a template to create the draggable item's preview. */
  @ContentChild(CdkDragPreview) _previewTemplate: CdkDragPreview;

  /** Template for placeholder element rendered to show where a draggable would be dropped. */
  @ContentChild(CdkDragPlaceholder) _placeholderTemplate: CdkDragPlaceholder;

  /** Design: model */
  @Input('cdkDrag') model: 'tools-component';

  /** Arbitrary data to attach to this drag instance. */
  @Input() dragData: T;
  @Input('designDragType') designDragType: 'stage-task' | string;

  /** Locks the position of the dragged element along the specified axis. */
  @Input('cdkDragLockAxis') lockAxis: 'x' | 'y';

  /**
   * Selector that will be used to determine the root draggable element, starting from
   * the `cdkDrag` element and going up the DOM. Passing an alternate root element is useful
   * when trying to enable dragging on an element that you might not have access to.
   */
  @Input('cdkDragRootElement') rootElementSelector: string;

  /**
   * Selector that will be used to determine the element to which the draggable's position will
   * be constrained. Matching starts from the element's parent and goes up the DOM until a matching
   * element has been found.
   */
  @Input('cdkDragBoundary') boundaryElementSelector: string;

  /** Whether starting to drag this element is disabled. */
  @Input('designDragDisabled')
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._dragRef.disabled = this._disabled;
  }
  private _disabled = false;

  constructor(
    public element: ElementRef<HTMLElement>,
    public Renderer2: Renderer2,
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
    ref.beforeStarted.subscribe(() => {
      if (!ref.isDragging()) {
        ref.disabled = this.disabled;
        ref.lockAxis = this.lockAxis;
        ref
          .withBoundaryElement(this._getBoundaryElement())
          .withPlaceholderTemplate(this._placeholderTemplate)
          .withPreviewTemplate(this._previewTemplate);
      }
    });
  }

  /**
   * Returns the element that is being used as a placeholder
   * while the current element is being dragged.
   */
  getPlaceholderElement(): HTMLElement {
    return this._dragRef.getPlaceholderElement();
  }

  /** Returns the root draggable element. */
  getRootElement(): HTMLElement {
    return this._dragRef.getRootElement();
  }

  /** Resets a standalone drag item to its initial position. */
  reset(): void {
    this._dragRef.reset();
  }

  ngAfterViewInit() {
    // We need to wait for the zone to stabilize, in order for the reference
    // element to be in the proper place in the DOM. This is mostly relevant
    // for draggable elements inside portals since they get stamped out in
    // their original DOM position and then they get transferred to the portal.
    this._rootElementInitSubscription = this._ngZone.onStable.asObservable()
      .pipe(take(1))
      .subscribe(() => {
        this._updateRootElement();
        this._handles.changes
          .pipe(startWith(this._handles))
          .subscribe((handleList: QueryList<CdkDragHandle>) => {
            this._dragRef.withHandles(handleList.filter(handle => handle._parentDrag === this));
          });
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    const rootSelectorChange = changes.rootElementSelector;

    // We don't have to react to the first change since it's being
    // handled in `ngAfterViewInit` where it needs to be deferred.
    if (rootSelectorChange && !rootSelectorChange.firstChange) {
      this._updateRootElement();
    }
  }

  ngOnDestroy() {
    this._rootElementInitSubscription.unsubscribe();
    this._dragRef.dispose();
  }

  /** Syncs the root element with the `DragRef`. */
  private _updateRootElement() {
    const element = this.element.nativeElement;
    const rootElement = this.rootElementSelector ?
        getClosestMatchingAncestor(element, this.rootElementSelector) : element;

    if (rootElement && rootElement.nodeType !== this._document.ELEMENT_NODE) {
      throw Error(`cdkDrag must be attached to an element node. ` +
                  `Currently attached to "${rootElement.nodeName}".`);
    }

    this._dragRef.withRootElement(rootElement || element);
  }

  /** Gets the boundary element, based on the `boundaryElementSelector`. */
  private _getBoundaryElement() {
    const selector = this.boundaryElementSelector;
    return selector ? getClosestMatchingAncestor(this.element.nativeElement, selector) : null;
  }
}

/** Gets the closest ancestor of an element that matches a selector. */
function getClosestMatchingAncestor(element: HTMLElement, selector: string) {
  let currentElement = element.parentElement as HTMLElement | null;

  while (currentElement) {
    // IE doesn't support `matches` so we have to fall back to `msMatchesSelector`.
    if (currentElement.matches ? currentElement.matches(selector) :
        (currentElement as any).msMatchesSelector(selector)) {
      return currentElement;
    }

    currentElement = currentElement.parentElement;
  }

  return null;
}

