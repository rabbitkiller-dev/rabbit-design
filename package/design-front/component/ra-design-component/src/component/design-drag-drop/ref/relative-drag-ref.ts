import {RaDesignDragDirective} from '../ra-design-drag.directive';
import {FlowDragRef} from './flow-drag-ref';
import {extendStyles, toggleNativeDragInteractions} from '../../cdk-drag-drop/drag-styling';

export class RelativeDragRef extends FlowDragRef {

  constructor(public RaDesignDragDirective: RaDesignDragDirective) {
    super(RaDesignDragDirective);
  }

  /** Starts the dragging sequence. */
  protected _startDragSequence(event: MouseEvent | TouchEvent) {
    const element = this._rootElement;

    const preview = this._preview = this._createPreviewElement(event);
    this._placeholder = this._createPlaceholderElement(event);

    this._nextSibling = element.nextSibling;
    // We move the element out at the end of the body and we make it hidden, because keeping it in
    // place will throw off the consumer's `:last-child` selectors. We can't remove the element
    // from the DOM completely, because iOS will stop firing all subsequent events in the chain.
    element.style.display = 'none';
  }

  protected _createPreviewElement(event: MouseEvent | TouchEvent): HTMLElement {
    let preview: HTMLElement;

    const element = this._rootElement;
    const elementRect = element.getBoundingClientRect();

    preview = this._rootElement;
    preview.style.width = `${elementRect.width}px`;
    preview.style.height = `${elementRect.height}px`;
    preview.style.transform = getTransform(elementRect.left, elementRect.top);
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

  protected _createPlaceholderElement(event: MouseEvent | TouchEvent): HTMLElement {
    return this._rootElement;
  }

  /** Destroys the placeholder element and its ViewRef. */
  _destroyPlaceholder() {
  }

  _destroyPreview() {
  }
}

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
