import {RaDesignDragDirective} from '../ra-design-drag.directive';
import {FlowDragRef} from './flow-drag-ref';
import {Point} from './interface/point';
import {TreeNodeModel} from '../../design-tree';
import {RaDesignDropDirective} from '../ra-design-drop.directive';
import {PageEditorChild, PageEditorService} from '../../design-stage/page-editor/page-editor.service';
import {extendStyles, toggleNativeDragInteractions} from '../../cdk-drag-drop/drag-styling';
import {RaDesignDynamicUnitDirective} from '../../design-dynamic/ra-design-dynamic-unit.directive';
import {ComponentService} from '../../design-tools/component/component.service';
import {DynamicUnitInterface} from '../../design-dynamic/interface';
import {deepCloneNode, getTransform} from '../drag-drop-util';
import {ComponentMap} from '../../design-tools/component/registry';

export class ComponentDragRef extends FlowDragRef<TreeNodeModel> {
  lastType: 'page-editor' | 'dynamic-unit' = null;
  targetDrag: RaDesignDragDirective;
  targetDrop: RaDesignDropDirective;
  insertMode: 'insertBefore' | 'insertAfter' | 'append';
  /** Handler for the `mousedown`/`touchstart` events. */
  _pointerDown = (event: MouseEvent | TouchEvent) => {
    // TODO (@angular/cdk/cdk-drag-drop/drag-ref.ts!_pointerDown)
    if (!this.disabled && this.data.children.length === 0) {
      this._initializeDragSequence(this._rootElement, event);
    }
  }

  constructor(public DesignDragDirective: RaDesignDragDirective) {
    super(DesignDragDirective);
  }

  _updateActiveDropContainer(event: MouseEvent | TouchEvent, {x, y}: Point) {
    const target = this.findElementUp(event);
    if (!target) {
      this.lastType = null;
      if (this._placeholder.parentNode) {
        this._placeholder.parentNode.removeChild(this._placeholder);
      }
      const transform = getTransform(x + 5, y + 5);
      this._preview.style.transform = transform;
      return;
    }
    if (target.type === 'placeholder') {
      // 什么都不做就可以啦
    } else if (target.dragDrop.type === 'page-editor') {
      ComponentDragRefUtil.pageEditor_mouseMove.call(this, target.dragDrop, event, {x, y});
      this.lastType = target.dragDrop.type;
      this.targetDrop = target.dragDrop;
    } else if (target.dragDrop.type === 'dynamic-unit') {
      ComponentDragRefUtil.dynamicUnit_mouseMove.call(this, target.dragDrop, event, {x, y});
      this.lastType = target.dragDrop.type;
      this.targetDrag = target.dragDrop as RaDesignDragDirective<any>;
    }
    const transform = getTransform(x + 5, y + 5);
    this._preview.style.transform = transform;
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
      if (drag.type !== 'dynamic-unit') {
        return;
      }
      const dynamicUnit: DynamicUnitInterface = drag as any;
      // 是容器的情况
      if (dynamicUnit.isContainer) {
        // 锁定拖拽了就不行
        if (dynamicUnit.lookDrop || dynamicUnit.lookUnit) {
          return;
        }
        return {
          type: 'drag',
          dragDrop: drag,
        };
      }
      // 不是容器的情况
      if (dynamicUnit.mergeParent || dynamicUnit.lookDrop) {
        return;
      }
      return {
        type: 'drag',
        dragDrop: drag,
      };
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
    const componentService = this.Injector.get(ComponentService);
    placeholder = componentService.getPlaceholder(this.data.key);
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
      switch (this.lastType) {
        case 'page-editor':
          ComponentDragRefUtil.pageEditor_mouseUp.call(this);
          break;
        case 'dynamic-unit':
          ComponentDragRefUtil.dynamicUnit_mouseUp.call(this);
          break;
        default:
      }
    });
  }
}

const ComponentDragRefUtil = new (class {

  pageEditor_mouseMove(this: ComponentDragRef, drop: RaDesignDropDirective, event: MouseEvent | TouchEvent, {x, y}: Point) {
    const target: HTMLElement = drop.ElementRef.nativeElement;
    const dynamic = target.querySelector('ra-design-dynamic');
    dynamic.appendChild(this._placeholder);
  }

  pageEditor_mouseUp(this: ComponentDragRef) {
    const pageEditorService: PageEditorService = this.Injector.get(PageEditorService);
    const pageEditorChild = new PageEditorChild(this.targetDrop.data, pageEditorService);
    pageEditorService.addRoot(this.targetDrop.data, ComponentMap.get(this.data.key).createToPage(pageEditorChild));
  }

  dynamicUnit_mouseMove(this: ComponentDragRef, drop: DynamicUnitInterface, event: MouseEvent | TouchEvent, {x, y}: Point) {
    const target: HTMLElement = drop.ElementRef.nativeElement;
    const parent: HTMLElement = target.parentElement;
    const clientRect = target.getBoundingClientRect();
    if (drop.isContainer && !drop.lookDrop) {
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
      parent.insertBefore(this._placeholder, target);
    } else {
      target.nextSibling ? parent.insertBefore(this._placeholder, target.nextSibling) : parent.appendChild(this._placeholder);
    }
    this.insertMode = index ? 'insertBefore' : 'insertAfter';
  }

  dynamicUnit_mouseUp(this: ComponentDragRef) {
    const pageEditorService: PageEditorService = this.Injector.get(PageEditorService);
    const targetDrag: RaDesignDynamicUnitDirective = this.targetDrag as any;
    const pageEditorChild = new PageEditorChild(targetDrag.stageID, pageEditorService);
    if (this.insertMode === 'insertBefore') {
      pageEditorChild.insertBefore(targetDrag.RabbitPath, ComponentMap.get(this.data.key).createToPage(pageEditorChild));
    } else if (this.insertMode === 'insertAfter') {
      pageEditorChild.insertAfter(targetDrag.RabbitPath, ComponentMap.get(this.data.key).createToPage(pageEditorChild));
    } else if (this.insertMode === 'append') {
      pageEditorChild.append(targetDrag.RabbitPath, ComponentMap.get(this.data.key).createToPage(pageEditorChild));
    }
  }
})
