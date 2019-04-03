import {RaDesignDragDirective} from '../ra-design-drag.directive';
import {FlowDragRef} from './flow-drag-ref';
import {Point} from './interface/point';
import {PageEditorService} from '../../design-stage/page-editor/page-editor.service';
import {RaDesignDynamicUnitDirective} from '../../design-dynamic/ra-design-dynamic-unit.directive';
import {RaDesignDropDirective} from 'ra-design-component';
import {DynamicUnitInterface} from '../../design-dynamic/interface';
import {ComponentService} from '../../design-tools/component/component.service';
import {ComponentDragRef} from './component-drag-ref';

export class DynamicUnitDragRef<HtmlJson> extends FlowDragRef {
  targetDrag: RaDesignDragDirective;
  insertMode: 'insertBefore' | 'insertAfter' | 'append';
  RaDesignDynamicUnitDirective: RaDesignDynamicUnitDirective;
  placeholderMask: HTMLElement;

  constructor(public DesignDragDirective: RaDesignDragDirective) {
    super(DesignDragDirective);
    this.RaDesignDynamicUnitDirective = DesignDragDirective as RaDesignDynamicUnitDirective;
  }

  get disabled(): boolean {
    let isDisabled = this.RaDesignDragDirective.disabled && this.DragDropRegistry.isDragging(this);
    if (this.RaDesignDynamicUnitDirective.lookDrag || this.RaDesignDynamicUnitDirective.lookUnit || this.RaDesignDynamicUnitDirective.mergeParent) {
      isDisabled = true;
    }
    return isDisabled;
  }

  _updateActiveDropContainer(event: MouseEvent | TouchEvent, {x, y}: Point) {
    const target = this.findElementUp(event);
    if (!target) {
      const transform = getTransform(x + 5, y + 5);
      this._preview.style.transform = transform;
      return;
    }
    if (target.type === 'placeholder') {
      // 什么都不做就可以啦
    } else if (target.dragDrop.type === 'page-editor') {
    } else if (target.dragDrop.type === 'dynamic-unit') {
      DynamicUnitDragRefUtil.dynamicUnit_mouseMove.call(this, target.dragDrop, event, {x, y});
      this.targetDrag = target.dragDrop as RaDesignDragDirective<any>;
    }
    const transform = getTransform(x, y);
    this._preview.style.transform = transform;
  }

  _createPlaceholderElement(event: MouseEvent | TouchEvent) {
    const placeholder: HTMLElement = super._createPlaceholderElement(event);
    // const placeholderMask: HTMLElement = this.placeholderMask = this.Document.createElement('div');
    // const rect: ClientRect = this._rootElement.getBoundingClientRect();
    // placeholderMask.classList.add('cdk-drag-placeholder-mask');
    // placeholder.getBoundingClientRect();
    // extendStyles(placeholderMask.style, {
    //   // It's important that we disable the pointer events on the preview, because
    //   // it can throw off the `document.elementFromPoint` calls in the `CdkDropList`.
    //   pointerEvents: 'none',
    //   position: 'fixed',
    //   top: rect.top + 'px',
    //   left: rect.left + 'px',
    //   bottom: rect.bottom + 'px',
    //   right: window.screenX - rect.right + 'px',
    //   zIndex: '1000',
    // });
    // this.Document.body.append(placeholderMask);
    return placeholder;
  }

  _cleanupDragArtifacts(event: MouseEvent | TouchEvent) {
    super._cleanupDragArtifacts(event);
    this.NgZone.run(() => {
      const pageEditorService: PageEditorService = this.Injector.get(PageEditorService);
      const targetDrag: RaDesignDynamicUnitDirective = this.targetDrag as any;
      if (this.insertMode === 'insertBefore') {
        pageEditorService.insertBefore(targetDrag.RabbitPath, this.data, this.RaDesignDynamicUnitDirective.RabbitPath);
      } else if (this.insertMode === 'insertAfter') {
        pageEditorService.insertAfter(targetDrag.RabbitPath, this.data, this.RaDesignDynamicUnitDirective.RabbitPath);
      } else if (this.insertMode === 'append') {
        pageEditorService.append(targetDrag.RabbitPath, this.data, this.RaDesignDynamicUnitDirective.RabbitPath);
      }
    });
  }

  filterElementUp(currentElement: HTMLElement & any): { type: 'drop' | 'drag' | 'placeholder', dragDrop: RaDesignDropDirective | RaDesignDragDirective } {
    if (currentElement.classList.contains('cdk-drag-placeholder')) {
      return {
        type: 'placeholder',
        dragDrop: null,
      };
    } else if (currentElement.classList.contains('cdk-drop-list') && currentElement.designDragDrop) {
      const drop: RaDesignDropDirective = currentElement.designDragDrop;
      if (drop.type === 'page-editor') {
        return {
          type: 'drop',
          dragDrop: drop,
        };
      }
    } else if (currentElement.classList.contains('cdk-drag') && currentElement.designDragDrop) {
      const drag: RaDesignDragDirective = currentElement.designDragDrop;
      if (drag.type === 'dynamic-unit') {
        const dynamicUnit: DynamicUnitInterface = drag as any;
        if (!dynamicUnit.lookDrop && !dynamicUnit.lookUnit) {
          return {
            type: 'drag',
            dragDrop: drag,
          };
        }
      }
    }
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


const DynamicUnitDragRefUtil = new (class {

  pageEditor_mouseMove(this: ComponentDragRef, drop: RaDesignDropDirective, event: MouseEvent | TouchEvent, {x, y}: Point) {
    const target: HTMLElement = drop.ElementRef.nativeElement;
    const dynamic = target.querySelector('ra-design-dynamic');
    dynamic.appendChild(this._placeholder);
  }

  pageEditor_mouseUp(this: ComponentDragRef) {
    const pageEditorService: PageEditorService = this.Injector.get(PageEditorService);
    const componentService: ComponentService = this.Injector.get(ComponentService);
    pageEditorService.addRoot(this.targetDrop.data, componentService.getHtmlJson(this.data.key));
  }

  dynamicUnit_mouseMove(this: ComponentDragRef, drag: DynamicUnitInterface, event: MouseEvent | TouchEvent, {x, y}: Point) {
    const target = drag.ElementRef.nativeElement;
    const clientRect = target.getBoundingClientRect();
    if (drag.isContainer) {
      // TODO target目标需要特殊处理
      target.append(this._placeholder);
      this.insertMode = 'append';
      return;
    }
    const isHorizontal = false; // this._orientation === 'horizontal';
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
    this.insertMode = index ? 'insertBefore' : 'insertAfter';
  }

  dynamicUnit_mouseUp(this: ComponentDragRef) {
    const pageEditorService: PageEditorService = this.Injector.get(PageEditorService);
    const componentService: ComponentService = this.Injector.get(ComponentService);
    const targetDrag: RaDesignDynamicUnitDirective = this.targetDrag as any;
    if (this.insertMode === 'insertBefore') {
      pageEditorService.insertBefore(targetDrag.RabbitPath, componentService.getHtmlJson(this.data.key));
    } else if (this.insertMode === 'insertAfter') {
      pageEditorService.insertAfter(targetDrag.RabbitPath, componentService.getHtmlJson(this.data.key));
    } else if (this.insertMode === 'append') {
      pageEditorService.append(targetDrag.RabbitPath, componentService.getHtmlJson(this.data.key));
    }
  }
})
