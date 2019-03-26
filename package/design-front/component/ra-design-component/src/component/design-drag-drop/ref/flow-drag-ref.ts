import {ElementRef, EmbeddedViewRef, Injector, NgZone, TemplateRef, ViewContainerRef} from '@angular/core';
import {normalizePassiveListenerOptions} from '@angular/cdk/platform';
import {Directionality} from '@angular/cdk/bidi';
import {ViewportRuler} from '@angular/cdk/overlay';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Subscription} from 'rxjs';

import {DragDropRegistry} from '../drag-drop-registry';
import {RaDesignDragDirective} from '../ra-design-drag.directive';
import {extendStyles, toggleNativeDragInteractions} from '../../cdk-drag-drop/drag-styling';
import {DragRefInterface} from './interface/drag-ref.interface';
import {Point} from './interface/point';
import {RaDesignDropDirective} from '../ra-design-drop.directive';
import {getTransformTransitionDurationInMs} from '../../cdk-drag-drop/transition-duration';

/** Options that can be used to bind a passive event listener. */
const passiveEventListenerOptions = normalizePassiveListenerOptions({passive: true});

/** Options that can be used to bind an active event listener. */
const activeEventListenerOptions = normalizePassiveListenerOptions({passive: false});

const DRAG_START_THRESHOLD = 5;

/**
 * Gets a 3d `transform` that can be applied to an element.
 * @param x Desired position of the element along the X axis.
 * @param y Desired position of the element along the Y axis.
 */
function getTransform(x: number, y: number): string {
  // Round the transforms since some browsers will
  // blur the elements for sub-pixel transforms.
  return `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
}

/**
 * Template that can be used to create a drag helper element (e.g. a preview or a placeholder).
 */
interface DragHelperTemplate<T = any> {
  templateRef: TemplateRef<T>;
  data: T;
}

export class FlowDragRef<T = any> implements DragRefInterface {
  data: T;
  DragDropRegistry: DragDropRegistry<FlowDragRef>;
  NgZone: NgZone;
  ViewContainerRef: ViewContainerRef;
  Document: Document;
  Directionality: Directionality;
  ViewportRuler: ViewportRuler;
  Injector: Injector;

  _rootElement: HTMLElement;

  /** Element displayed next to the user's pointer while the element is dragged. */
  protected _preview: HTMLElement;

  /** Reference to the view of the preview element. */
  private _previewRef: EmbeddedViewRef<any> | null;

  /** Reference to the view of the placeholder element. */
  private _placeholderRef: EmbeddedViewRef<any> | null;

  /** Element that is rendered instead of the draggable item while it is being sorted. */
  protected _placeholder: HTMLElement;

  _hasStartedDragging: boolean = false; // 是否在拖拽中

  /** Subscription to pointer movement events. */
  private _pointerMoveSubscription = Subscription.EMPTY;
  /** Subscription to the event that is dispatched when the user lifts their pointer. */
  private _pointerUpSubscription = Subscription.EMPTY;

  /** Coordinates within the element at which the user picked up the element. */
  protected _pickupPositionInElement: Point;

  /** Coordinates on the page at which the user picked up the element. */
  private _pickupPositionOnPage: Point;

  /**
   * Reference to the element that comes after the draggable in the DOM, at the time
   * it was picked up. Used for restoring its initial position when it's dropped.
   */
  protected _nextSibling: Node | null;

  /** Element that will be used as a template to create the draggable item's preview. */
  private _previewTemplate: DragHelperTemplate | null;
  /** Template for placeholder element rendered to show where a draggable would be dropped. */
  private _placeholderTemplate: DragHelperTemplate | null;

  /** CSS `transform` that is applied to the element while it's being dragged. */
  private _activeTransform: Point = {x: 0, y: 0};

  /** Inline `transform` value that the element had before the first dragging sequence. */
  private _initialTransform?: string;

  /** Cached scroll position on the page when the element was picked up. */
  protected _scrollPosition: { top: number, left: number };

  /** Whether starting to drag this element is disabled. */
  get disabled(): boolean {
    return this.RaDesignDragDirective.disabled;
  }


  constructor(public RaDesignDragDirective: RaDesignDragDirective) {
    this.DragDropRegistry = this.RaDesignDragDirective.DragDropRegistry as DragDropRegistry<FlowDragRef>;
    this.NgZone = this.RaDesignDragDirective.NgZone;
    this.ViewContainerRef = this.RaDesignDragDirective.ViewContainerRef;
    this.Document = this.RaDesignDragDirective.Document;
    this.Directionality = this.RaDesignDragDirective.Directionality;
    this.ViewportRuler = this.RaDesignDragDirective.ViewportRuler;
    this.Injector = this.RaDesignDragDirective.Injector;
    this.data = this.RaDesignDragDirective.data;
  }


  withRootElement(rootElement: ElementRef<HTMLElement> | HTMLElement): DragRefInterface {
    const element = rootElement instanceof ElementRef ? rootElement.nativeElement : rootElement;

    // TODO 下一步做切欢根节点(@angular/cdk/cdk-drag-drop/drag-ref.ts!withRootElement)
    element.addEventListener('mousedown', this._pointerDown, activeEventListenerOptions);
    element.addEventListener('touchstart', this._pointerDown, passiveEventListenerOptions);

    this._rootElement = element;

    return this;
  }

  /** Handler for the `mousedown`/`touchstart` events. */
  protected _pointerDown = (event: MouseEvent | TouchEvent) => {
    // TODO (@angular/cdk/cdk-drag-drop/drag-ref.ts!_pointerDown)
    if (!this.disabled) {
      this._initializeDragSequence(this._rootElement, event);
    }
  };

  /**
   * Sets up the different variables and subscriptions
   * that will be necessary for the dragging sequence.
   * @param referenceElement Element that started the drag sequence.
   * @param event Browser event object that started the sequence.
   */
  protected _initializeDragSequence(referenceElement: HTMLElement, event: MouseEvent | TouchEvent) {
    // Always stop propagation for the event that initializes
    // the dragging sequence, in order to prevent it from potentially
    // starting another sequence for a draggable parent somewhere up the DOM tree.
    event.stopPropagation();

    // const isDragging = this.isDragging();
    // const isTouchSequence = isTouchEvent(event);
    // const isAuxiliaryMouseButton = !isTouchSequence && (event as MouseEvent).button !== 0;
    // const rootElement = this._rootElement;
    // const isSyntheticEvent = !isTouchSequence && this._lastTouchEventTime &&
    //   this._lastTouchEventTime + MOUSE_EVENT_IGNORE_TIME > Date.now();

    // If the event started from an element with the native HTML drag&drop, it'll interfere
    // with our own dragging (e.g. `img` tags do it by default). Prevent the default action
    // to stop it from happening. Note that preventing on `dragstart` also seems to work, but
    // it's flaky and it fails if the user drags it away quickly. Also note that we only want
    // to do this for `mousedown` since doing the same for `touchstart` will stop any `click`
    // events from firing on touch devices.
    // if (event.target && (event.target as HTMLElement).draggable && event.type === 'mousedown') {
    //   event.preventDefault();
    // }

    // Abort if the user is already dragging or is using a mouse button other than the primary one.
    // if (isDragging || isAuxiliaryMouseButton || isSyntheticEvent) {
    //   return;
    // }

    // Cache the previous transform amount only after the first drag sequence, because
    // we don't want our own transforms to stack on top of each other.
    if (this._initialTransform == null) {
      this._initialTransform = this._rootElement.style.transform || '';
    }

    // If we've got handles, we need to disable the tap highlight on the entire root element,
    // otherwise iOS will still add it, even though all the drag interactions on the handle
    // are disabled.
    // if (this._handles.length) {
    //   this._rootElementTapHighlight = rootElement.style.webkitTapHighlightColor;
    //   rootElement.style.webkitTapHighlightColor = 'transparent';
    // }

    // this._toggleNativeDragInteractions();
    this._hasStartedDragging = false; // this._hasMoved = false;
    // this._initialContainer = this.dropContainer!;
    this._pointerMoveSubscription = this.DragDropRegistry.pointerMove.subscribe(this._pointerMove);
    this._pointerUpSubscription = this.DragDropRegistry.pointerUp.subscribe(this._pointerUp);
    this._scrollPosition = this.ViewportRuler.getViewportScrollPosition();

    // if (this._boundaryElement) {
    //   this._boundaryRect = this._boundaryElement.getBoundingClientRect();
    // }

    // If we have a custom preview template, the element won't be visible anyway so we avoid the
    // extra `getBoundingClientRect` calls and just move the preview next to the cursor.
    this._pickupPositionInElement = this._previewTemplate ? {x: 0, y: 0} :
      this._getPointerPositionInElement(referenceElement, event);
    const pointerPosition = this._pickupPositionOnPage = this._getPointerPositionOnPage(event);
    // this._pointerDirectionDelta = {x: 0, y: 0};
    // this._pointerPositionAtLastDirectionChange = {x: pointerPosition.x, y: pointerPosition.y};
    this.DragDropRegistry.startDragging(this, event);
  }

  /** Handler that is invoked when the user moves their pointer after they've initiated a drag. */
  private _pointerMove = (event: MouseEvent | TouchEvent) => {
    if (!this._hasStartedDragging) {
      const pointerPosition = this._getPointerPositionOnPage(event);
      const distanceX = Math.abs(pointerPosition.x - this._pickupPositionOnPage.x);
      const distanceY = Math.abs(pointerPosition.y - this._pickupPositionOnPage.y);

      // Only start dragging after the user has moved more than the minimum distance in either
      // direction. Note that this is preferrable over doing something like `skip(minimumDistance)`
      // in the `pointerMove` subscription, because we're not guaranteed to have one move event
      // per pixel of movement (e.g. if the user moves their pointer quickly).
      if (distanceX + distanceY >= DRAG_START_THRESHOLD) {
        this._hasStartedDragging = true;
        this.NgZone.run(() => this._startDragSequence(event));
      }
      return;
    }
    const constrainedPointerPosition = this._getConstrainedPointerPosition(event);
    this._updateActiveDropContainer(event, constrainedPointerPosition);
  };

  /**
   * Updates the item's position in its drop container, or moves it
   * into a new one, depending on its current drag position.
   */
  protected _updateActiveDropContainer(event: MouseEvent | TouchEvent, {x, y}: Point) {
    const transform = getTransform(x - this._pickupPositionInElement.x, y - this._pickupPositionInElement.y);
    this._preview.style.transform = transform;
  }

  /** Starts the dragging sequence. */
  protected _startDragSequence(event: MouseEvent | TouchEvent) {
    const element = this._rootElement;

    const preview = this._preview = this._createPreviewElement(event);
    const placeholder = this._placeholder = this._createPlaceholderElement(event);

    this._nextSibling = element.nextSibling;
    // We move the element out at the end of the body and we make it hidden, because keeping it in
    // place will throw off the consumer's `:last-child` selectors. We can't remove the element
    // from the DOM completely, because iOS will stop firing all subsequent events in the chain.
    element.style.display = 'none';
    this.Document.body.appendChild(element.parentNode.replaceChild(placeholder, element));
    this.Document.body.appendChild(preview);
  }

  /**
   * Returns the element that is being used as a placeholder
   * while the current element is being dragged.
   */
  getPlaceholderElement(): HTMLElement {
    return this._placeholder;
  }

  /** Returns the root draggable element. */
  getRootElement(): HTMLElement {
    return this._rootElement;
  }

  /**
   * Creates the element that will be rendered next to the user's pointer
   * and will be used as a preview of the element that is being dragged.
   */
  protected _createPreviewElement(event: MouseEvent | TouchEvent): HTMLElement {
    let preview: HTMLElement;

    if (this._previewTemplate) {
      const viewRef = this.ViewContainerRef.createEmbeddedView(this._previewTemplate.templateRef,
        this._previewTemplate.data);

      preview = viewRef.rootNodes[0];
      this._previewRef = viewRef;
      preview.style.transform =
        getTransform(this._pickupPositionOnPage.x, this._pickupPositionOnPage.y);
    } else {
      const element = this._rootElement;
      const elementRect = element.getBoundingClientRect();

      preview = deepCloneNode(element);
      preview.style.width = `${elementRect.width}px`;
      preview.style.height = `${elementRect.height}px`;
      preview.style.transform = getTransform(elementRect.left, elementRect.top);
    }

    extendStyles(preview.style, {
      // It's important that we disable the pointer events on the preview, because
      // it can throw off the `document.elementFromPoint` calls in the `CdkDropList`.
      pointerEvents: 'none',
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '1000',
    });

    toggleNativeDragInteractions(preview, false);

    preview.classList.add('cdk-drag-preview');
    preview.setAttribute('dir', this.Directionality ? this.Directionality.value : 'ltr');

    return preview;
  }

  /** Creates an element that will be shown instead of the current element while dragging. */
  protected _createPlaceholderElement(event: MouseEvent | TouchEvent): HTMLElement {
    let placeholder: HTMLElement;

    if (this._placeholderTemplate) {
      this._placeholderRef = this.ViewContainerRef.createEmbeddedView(
        this._placeholderTemplate.templateRef,
        this._placeholderTemplate.data
      );
      placeholder = this._placeholderRef.rootNodes[0];
    } else {
      placeholder = deepCloneNode(this._rootElement);
    }

    placeholder.classList.add('cdk-drag-placeholder');
    return placeholder;
  }

  /** Gets the pointer position on the page, accounting for any position constraints. */
  protected _getConstrainedPointerPosition(event: MouseEvent | TouchEvent): Point {
    const point = this._getPointerPositionOnPage(event);
    return point;
  }

  /** Handler that is invoked when the user lifts their pointer up, after initiating a drag. */
  protected _pointerUp = (event: MouseEvent | TouchEvent) => {
    // Note that here we use `isDragging` from the service, rather than from `this`.
    // The difference is that the one from the service reflects whether a dragging sequence
    // has been initiated, whereas the one on `this` includes whether the user has passed
    // the minimum dragging threshold.
    if (!this.DragDropRegistry.isDragging(this)) {
      return;
    }

    this._removeSubscriptions();
    this.DragDropRegistry.stopDragging(this);

    if (!this._hasStartedDragging) {
      return;
    }

    this._animatePreviewToPlaceholder().then(() => {
      this._cleanupDragArtifacts(event);
      this.DragDropRegistry.stopDragging(this);
    });
  };

  /**
   * Animates the preview element from its current position to the location of the drop placeholder.
   * @returns Promise that resolves when the animation completes.
   */
  private _animatePreviewToPlaceholder(): Promise<void> {
    // If the user hasn't moved yet, the transitionend event won't fire.
    if (!this._hasStartedDragging) {
      return Promise.resolve();
    }

    const placeholderRect = this._placeholder.getBoundingClientRect();

    // Apply the class that adds a transition to the preview.
    this._preview.classList.add('cdk-drag-animating');

    // Move the preview to the placeholder position.
    this._preview.style.transform = getTransform(placeholderRect.left, placeholderRect.top);

    // If the element doesn't have a `transition`, the `transitionend` event won't fire. Since
    // we need to trigger a style recalculation in order for the `cdk-drag-animating` class to
    // apply its style, we take advantage of the available info to figure out whether we need to
    // bind the event in the first place.
    const duration = getTransformTransitionDurationInMs(this._preview);

    if (duration === 0) {
      return Promise.resolve();
    }

    return this.NgZone.runOutsideAngular(() => {
      return new Promise(resolve => {
        const handler = ((event: TransitionEvent) => {
          if (!event || (event.target === this._preview && event.propertyName === 'transform')) {
            this._preview.removeEventListener('transitionend', handler);
            resolve();
            clearTimeout(timeout);
          }
        }) as EventListenerOrEventListenerObject;

        // If a transition is short enough, the browser might not fire the `transitionend` event.
        // Since we know how long it's supposed to take, add a timeout with a 50% buffer that'll
        // fire if the transition hasn't completed when it was supposed to.
        const timeout = setTimeout(handler as Function, duration * 1.5);
        this._preview.addEventListener('transitionend', handler);
      });
    });
  }

  /** Cleans up the DOM artifacts that were added to facilitate the element being dragged. */
  protected _cleanupDragArtifacts(event: MouseEvent | TouchEvent) {
    // Restore the element's visibility and insert it at its old position in the DOM.
    // It's important that we maintain the position, because moving the element around in the DOM
    // can throw off `NgFor` which does smart diffing and re-creates elements only when necessary,
    // while moving the existing elements in all other cases.
    this._rootElement.style.display = '';

    if (this._nextSibling) {
      this._placeholder.parentNode.insertBefore(this._rootElement, this._nextSibling);
    } else {
      this._placeholder.parentNode.appendChild(this._rootElement);
    }
    this._destroyPreview();
    this._destroyPlaceholder();
  }

  /** Unsubscribes from the global subscriptions. */
  protected _removeSubscriptions() {
    this._pointerMoveSubscription.unsubscribe();
    this._pointerUpSubscription.unsubscribe();
  }

  /** Destroys the preview element and its ViewRef. */
  protected _destroyPreview() {
    if (this._preview) {
      removeElement(this._preview);
    }

    if (this._previewRef) {
      this._previewRef.destroy();
    }

    this._preview = this._previewRef = null!;
  }

  /** Destroys the placeholder element and its ViewRef. */
  protected _destroyPlaceholder() {
    if (this._placeholder) {
      removeElement(this._placeholder);
    }

    if (this._placeholderRef) {
      this._placeholderRef.destroy();
    }

    this._placeholder = this._placeholderRef = null!;
  }

  /**
   * Figures out the coordinates at which an element was picked up.
   * @param referenceElement Element that initiated the dragging.
   * @param event Event that initiated the dragging.
   */
  protected _getPointerPositionInElement(referenceElement: HTMLElement,
                                         event: MouseEvent | TouchEvent): Point {
    const elementRect = this._rootElement.getBoundingClientRect();
    const handleElement = referenceElement === this._rootElement ? null : referenceElement;
    const referenceRect = handleElement ? handleElement.getBoundingClientRect() : elementRect;
    const point = isTouchEvent(event) ? event.targetTouches[0] : event;
    const x = point.pageX - referenceRect.left - this._scrollPosition.left;
    const y = point.pageY - referenceRect.top - this._scrollPosition.top;

    return {
      x: referenceRect.left - elementRect.left + x,
      y: referenceRect.top - elementRect.top + y
    };
  }

  /** Determines the point of the page that was touched by the user. */
  protected _getPointerPositionOnPage(event: MouseEvent | TouchEvent): Point {
    // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
    const point = isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
    return {
      x: point.pageX - this._scrollPosition.left,
      y: point.pageY - this._scrollPosition.top
    };
  }

  protected findDrag(eventTarget: MouseEvent | TouchEvent, type: string): RaDesignDragDirective {
    const element = this.findElementUp(eventTarget);
    if (element && element.type === 'drag' && !!type && element.dragDrop.type === type) {
      const drag: RaDesignDragDirective = element.dragDrop as any;
      return drag;
    } else {
      return null;
    }
  }

  protected findDrop(eventTarget: MouseEvent | TouchEvent, type?: string): RaDesignDropDirective {
    const element = this.findElementUp(eventTarget);
    if (element && element.type === 'drop' && !!type && element.dragDrop.type === type) {
      const drag: RaDesignDropDirective = element.dragDrop as any;
      return drag;
    } else {
      return null;
    }
  }

  /** Find element up */
  protected findElementUp(eventTarget: MouseEvent | TouchEvent): {
    type: 'drop' | 'drag' | 'placeholder',
    dragDrop: RaDesignDropDirective | RaDesignDragDirective
  } {
    let currentElement: HTMLElement = eventTarget.target as HTMLElement;
    do {
      const dragDrop = this.filterElementUp(currentElement);
      if (dragDrop) {
        return dragDrop;
      }
      currentElement = currentElement.parentElement;
    } while (currentElement);
    return null;
  }

  protected filterElementUp(currentElement: HTMLElement & any): {
    type: 'drop' | 'drag' | 'placeholder',
    dragDrop: RaDesignDropDirective | RaDesignDragDirective
  } {
    if (currentElement.classList.contains('cdk-drag-placeholder')) {
      return {
        type: 'placeholder',
        dragDrop: null,
      };
    } else if (currentElement.classList.contains('cdk-drop-list') && currentElement.designDragDrop) {
      const drop: RaDesignDropDirective = currentElement.designDragDrop;
      return {
        type: 'drop',
        dragDrop: drop,
      };
    } else if (currentElement.classList.contains('cdk-drag') && currentElement.designDragDrop) {
      const drag: RaDesignDragDirective = currentElement.designDragDrop;
      return {
        type: 'drag',
        dragDrop: drag,
      };
    }
  }
}

/** Creates a deep clone of an element. */
function deepCloneNode(node: HTMLElement): HTMLElement {
  const clone = node.cloneNode(true) as HTMLElement;
  // Remove the `id` to avoid having multiple elements with the same id on the page.
  clone.removeAttribute('id');
  return clone;
}

/**
 * Helper to remove an element from the DOM and to do all the necessary null checks.
 * @param element Element to be removed.
 */
function removeElement(element: HTMLElement | null) {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

/** Determines whether an event is a touch event. */
function isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return event.type.startsWith('touch');
}
