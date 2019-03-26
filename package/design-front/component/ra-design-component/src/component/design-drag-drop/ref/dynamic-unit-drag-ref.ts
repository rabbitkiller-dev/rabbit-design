import {RaDesignDragDirective} from '../ra-design-drag.directive';
import {FlowDragRef} from './flow-drag-ref';
import {Point} from './interface/point';
import {PageEditorService} from '../../design-stage/page-editor/page-editor.service';
import {RaDesignDynamicUnitDirective} from '../../design-dynamic/ra-design-dynamic-unit.directive';
import {DragRefInterface} from './interface/drag-ref.interface';
import {HtmlJson} from 'himalaya';

export class DynamicUnitDragRef<HtmlJson> extends FlowDragRef {
  targetDrag: RaDesignDynamicUnitDirective;
  isInsertBefore: boolean;
  RaDesignDynamicUnitDirective: RaDesignDynamicUnitDirective;

  constructor(public DesignDragDirective: RaDesignDragDirective) {
    super(DesignDragDirective);
    this.RaDesignDynamicUnitDirective = DesignDragDirective as RaDesignDynamicUnitDirective;
  }

  _updateActiveDropContainer(event: MouseEvent | TouchEvent, {x, y}: Point) {
    const drag = this.findDrag(event, 'dynamic-unit');
    if (drag) {
      const target = drag.dragRef.getRootElement();
      const clientRect = target.getBoundingClientRect();

      const isHorizontal = true; // this._orientation === 'horizontal';
      const index = isHorizontal ?
        // Round these down since most browsers report client rects with
        // sub-pixel precision, whereas the pointer coordinates are rounded to pixels.
        x >= Math.floor(clientRect.left - (clientRect.width / 2)) && x <= Math.floor(clientRect.right - (clientRect.width / 2)) :
        y >= Math.floor(clientRect.top - (clientRect.height / 2)) && y <= Math.floor(clientRect.bottom - (clientRect.height / 2));
      if (index) {
        target.parentNode.insertBefore(this._placeholder, target);
      } else {
        target.nextSibling ? target.parentNode.insertBefore(this._placeholder, target.nextSibling) : target.parentNode.appendChild(this._placeholder);
      }
      this.isInsertBefore = index;
      this.targetDrag = drag as RaDesignDynamicUnitDirective;
    }
    const transform = getTransform(x, y);
    this._preview.style.transform = transform;
  }

  _createPlaceholderElement(event: MouseEvent | TouchEvent) {
    const placeholder: HTMLElement = super._createPlaceholderElement(event);
    /*    const placeholderMask: HTMLElement = this.Document.createElement('div');
        const rect: any = this._rootElement.getBoundingClientRect();
        placeholderMask.classList.add('cdk-drag-placeholder-mask');
        placeholder.getBoundingClientRect();
        extendStyles(placeholderMask.style, {
          // It's important that we disable the pointer events on the preview, because
          // it can throw off the `document.elementFromPoint` calls in the `CdkDropList`.
          pointerEvents: 'none',
          position: 'fixed',
          top: rect.top,
          left: rect.left,
          zIndex: '1000',
        });*/
    return placeholder;
  }

  _cleanupDragArtifacts(event: MouseEvent | TouchEvent) {
    super._cleanupDragArtifacts(event);
    this.NgZone.run(() => {
      const pageEditorService: PageEditorService = this.Injector.get(PageEditorService);
      if (this.isInsertBefore === true) {
        pageEditorService.insertBefore(this.targetDrag.path, this.data, this.RaDesignDynamicUnitDirective.path);
      } else if (this.isInsertBefore === false) {
        pageEditorService.insertAfter(this.targetDrag.path, this.data, this.RaDesignDynamicUnitDirective.path);
      }
    });
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
