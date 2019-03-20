import {RaDesignDragDirective} from '../ra-design-drag.directive';
import {FlowDragRef} from './flow-drag-ref';
import {Point} from './interface/point';
import {RaDesignDropDirective} from 'ra-design-component';
import {PageEditorService} from '../../design-stage/page-editor/page-editor.service';
import {extendStyles, toggleNativeDragInteractions} from '../../cdk-drag-drop/drag-styling';

export class ComponentDragRef extends FlowDragRef<{ children: any[] }> {
  constructor(public DesignDragDirective: RaDesignDragDirective) {
    super(DesignDragDirective);
  }

  /** Handler for the `mousedown`/`touchstart` events. */
  _pointerDown = (event: MouseEvent | TouchEvent) => {
    // TODO (@angular/cdk/cdk-drag-drop/drag-ref.ts!_pointerDown)
    if (!this.disabled && this.data.children.length === 0) {
      this._initializeDragSequence(this._rootElement, event);
    }
  }

  _updateActiveDropContainer(event: MouseEvent | TouchEvent, {x, y}: Point) {
    const drag = this.findElementUp(event);
    if (!drag) {
      if (this._placeholder.parentNode) {
        this._placeholder.parentNode.removeChild(this._placeholder);
      }
      super._updateActiveDropContainer(event, {x, y});
      return;
    }
    if (drag.dragDrop.type === 'page-editor') {
      ComponentDragRefUtil.pageEditor_mouseMove.call(this, drag.dragDrop, event, {x, y});
    }
    super._updateActiveDropContainer(event, {x, y});
  }

  filterElementUp(currentElement: HTMLElement & any): { type: 'drop' | 'drag', dragDrop: RaDesignDropDirective | RaDesignDragDirective } {
    if (currentElement.classList.contains('cdk-drop-list') && currentElement.designDragDrop) {
      const drop: RaDesignDropDirective = currentElement.designDragDrop;
      if (drop.type === 'page-editor') {
        return {
          type: 'drop',
          dragDrop: drop,
        };
      }
    } else if (currentElement.classList.contains('cdk-drag') && currentElement.designDragDrop) {
      const drag: RaDesignDragDirective = currentElement.designDragDrop;
      if (drag.type === 'dynamic-component') {
        return {
          type: 'drag',
          dragDrop: drag,
        };
      }
    }
  }

  protected _createPreviewElement(event: MouseEvent | TouchEvent): HTMLElement {
    let preview: HTMLElement;

    const element: HTMLElement = this._rootElement;
    if (!element) {
      return;
    }
    const elementRect = element.getBoundingClientRect();

    preview = deepCloneNode(element);
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
      zIndex: '1000'
    });

    toggleNativeDragInteractions(preview, false);

    preview.classList.add('cdk-drag-preview');
    preview.setAttribute('dir', this.Directionality ? this.Directionality.value : 'ltr');

    return preview;
  }

  /** Creates an element that will be shown instead of the current element while dragging. */
  protected _createPlaceholderElement(event: MouseEvent | TouchEvent): HTMLElement {
    let placeholder: HTMLElement;
    placeholder = ComponentDragRefUtil.pageEditor_createPlaceholder.call(this);
    placeholder.classList.add('cdk-drag-placeholder');
    return placeholder;
  }

  /** Starts the dragging sequence. */
  protected _startDragSequence(event: MouseEvent | TouchEvent) {
    const element = this._rootElement;

    const preview = this._preview = this._createPreviewElement(event);
    const placeholder = this._placeholder = this._createPlaceholderElement(event);

    this._nextSibling = element.nextSibling;
    this.Document.body.appendChild(preview);
  }

  /** Cleans up the DOM artifacts that were added to facilitate the element being dragged. */
  protected _cleanupDragArtifacts(event: MouseEvent | TouchEvent) {
    this._destroyPreview();
    this._destroyPlaceholder();
    this.NgZone.run(() => {
      ComponentDragRefUtil.pageEditor_mouseUp.call(this);
    });
  }
}

const ComponentDragRefUtil = {
  pageEditor_createPlaceholder: function (this: ComponentDragRef) {
    const div = document.createElement('div');
    div.innerHTML = '<i nz-icon="" class="anticon anticon-rabbit-design:icon-iconfont"><svg viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1127" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" fill="currentColor" class="ng-tns-c4-24" data-icon="rabbit-design:icon-iconfont" aria-hidden="true"><defs><style type="text/css"></style></defs><path d="M1.703827 0h1022.296173v1022.296173H1.703827z" fill="#E94618"></path><path d="M501.799188 865.690622c-38.777398-23.478735-30.512133-64.416586-55.495348-90.18356-45.955621-47.388539-126.495521-49.818196-173.427434-104.054416-157.356938-181.844339-6.25986-521.808932 291.356113-471.721531 173.442769 29.18826 305.577957 272.184652 187.299993 443.973005-50.872865 73.896679-148.708313 79.747621-208.112239 159.553171-17.406296 17.273398-8.592399 60.780619-41.621085 62.433331zM252.06416 470.276686c-6.982283 131.959694 180.363714 125.277285 180.363714 6.937983 0-60.245617-54.101617-108.603634-124.866663-83.245577-49.779008 17.835661-53.437125 37.388779-55.497051 76.307594z m381.53797 97.11984c158.950017 44.573817 162.964233-230.536306 0-173.427434-77.096466 27.017584-68.110483 154.329238 0 173.427434z m-159.551468 83.247281c25.407468 5.697597 32.996313-68.502363 6.93628-69.374722-14.470602 14.327481-48.605072 59.225025-6.93628 69.374722z m62.429924 0h13.879374c17.914037-28.413018-6.004286-65.42014-34.686509-69.374722 2.320612 27.740007-8.91783 69.037364 20.807135 69.374722z" fill="#FFFFFF"></path></svg></i>'
    return div.children[0];
  },
  pageEditor_mouseMove: function (this: ComponentDragRef, drop: RaDesignDropDirective, event: MouseEvent | TouchEvent, {x, y}: Point) {
    const pageEditorService: PageEditorService = this.Injector.get(PageEditorService);
    const target = drop.ElementRef.nativeElement;
    target.appendChild(this._placeholder);
  },
  pageEditor_mouseUp: function (this: ComponentDragRef) {
    const pageEditorService: PageEditorService = this.Injector.get(PageEditorService);
    pageEditorService.addRoot('<i nz-icon type="rabbit-design:icon-iconfont"></i>');
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
 * Gets a 3d `transform` that can be applied to an element.
 * @param x Desired position of the element along the X axis.
 * @param y Desired position of the element along the Y axis.
 */
function getTransform(x: number, y: number): string {
  // Round the transforms since some browsers will
  // blur the elements for sub-pixel transforms.
  return `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
}
