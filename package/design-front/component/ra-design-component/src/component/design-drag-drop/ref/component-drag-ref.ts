import {RaDesignDragDirective} from '../ra-design-drag.directive';
import {FlowDragRef} from './flow-drag-ref';
import {Point} from './interface/point';
import {RaDesignDropDirective, TreeNodeModel} from 'ra-design-component';
import {PageEditorService} from '../../design-stage/page-editor/page-editor.service';
import {extendStyles, toggleNativeDragInteractions} from '../../cdk-drag-drop/drag-styling';

export class ComponentDragRef extends FlowDragRef<TreeNodeModel> {
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
    placeholder = ComponentDragRefUtil.getPlaceholder(this.data.key);
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

const ComponentDragRefUtil = new (class {
  private placeholderTemp: Map<string, HTMLElement> = new Map<string, HTMLElement>();

  pageEditor_mouseMove(this: ComponentDragRef, drop: RaDesignDropDirective, event: MouseEvent | TouchEvent, {x, y}: Point) {
    const target: HTMLElement = drop.ElementRef.nativeElement;
    const dynamic = target.querySelector('ra-design-dynamic');
    dynamic.appendChild(this._placeholder);
  }

  pageEditor_mouseUp(this: ComponentDragRef) {
    const pageEditorService: PageEditorService = this.Injector.get(PageEditorService);
    pageEditorService.addRoot(ComponentDragRefUtil.getHtmlJson(this.data.key));
  }

  getPlaceholder(key: string): HTMLElement {
    if (this.placeholderTemp.get(key)) {
      return this.placeholderTemp.get(key);
    }

    const div = document.createElement('div');
    switch (key) {
      case 'icon':
        div.innerHTML = '<i class="anticon anticon-rabbit-design:icon-iconfont"><svg viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1127" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" fill="currentColor" class="ng-tns-c4-24" data-icon="rabbit-design:icon-iconfont" aria-hidden="true"><defs><style type="text/css"></style></defs><path d="M1.703827 0h1022.296173v1022.296173H1.703827z" fill="#E94618"></path><path d="M501.799188 865.690622c-38.777398-23.478735-30.512133-64.416586-55.495348-90.18356-45.955621-47.388539-126.495521-49.818196-173.427434-104.054416-157.356938-181.844339-6.25986-521.808932 291.356113-471.721531 173.442769 29.18826 305.577957 272.184652 187.299993 443.973005-50.872865 73.896679-148.708313 79.747621-208.112239 159.553171-17.406296 17.273398-8.592399 60.780619-41.621085 62.433331zM252.06416 470.276686c-6.982283 131.959694 180.363714 125.277285 180.363714 6.937983 0-60.245617-54.101617-108.603634-124.866663-83.245577-49.779008 17.835661-53.437125 37.388779-55.497051 76.307594z m381.53797 97.11984c158.950017 44.573817 162.964233-230.536306 0-173.427434-77.096466 27.017584-68.110483 154.329238 0 173.427434z m-159.551468 83.247281c25.407468 5.697597 32.996313-68.502363 6.93628-69.374722-14.470602 14.327481-48.605072 59.225025-6.93628 69.374722z m62.429924 0h13.879374c17.914037-28.413018-6.004286-65.42014-34.686509-69.374722 2.320612 27.740007-8.91783 69.037364 20.807135 69.374722z" fill="#FFFFFF"></path></svg></i>'
        break;
      case 'input':
        div.innerHTML = '<i class="anticon anticon-rabbit-design:icon-input"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1127" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" fill="currentColor" class="ng-tns-c4-25" data-icon="rabbit-design:icon-input" aria-hidden="true"><defs><style type="text/css"></style></defs><path d="M53.248 359.08266667v305.83466666h917.504V359.08266667H53.248z m-43.69066667-43.69066667h1004.88533334v393.216H9.55733333V315.392z" fill="#ffffff"></path><path d="M838.22364445 383.84071111h104.8576v33.49617778h-34.95253334v200.97706666h34.95253334V651.81013333h-104.8576v-33.49617778h34.95253333v-200.97706666h-34.95253333zM129.70084125 435.50055538h29.4416839L219.57545529 593.55591111h-27.67075556l-14.38879288-39.62452196H111.32745955L96.93866667 593.55591111H69.26791111l60.43293014-158.05535573z m-10.62557014 97.17969351h50.69282418l-24.79299698-69.28757191h-0.88546418l-25.01436302 69.28757191z m115.99580729-97.17969351h72.38669653c15.71698915 0 28.11348765 3.76322275 36.96812942 11.28966827 8.19054365 7.08371342 12.39649849 16.60245333 12.3964985 28.55621973 0 8.85464178-2.21366045 16.38108729-6.4196153 22.57933653-4.20595485 5.75551715-10.18283805 9.961472-18.15201564 13.06059662 10.40420409 1.9922944 18.15201565 6.19824925 23.46480071 12.61786454 5.09141902 6.19824925 7.74781155 14.83152498 7.74781156 25.45709511 0 15.9383552-5.53415111 27.67075555-16.38108729 35.19720107-9.29737387 6.19824925-22.57933653 9.29737387-39.40315591 9.29737386h-72.60806258V435.50055538z m25.8998272 21.25114027v45.15867306h39.62452195c11.06830222 0 18.81611378-1.9922944 23.46480072-5.53415111 4.42732089-3.76322275 6.86234738-9.74010595 6.86234738-17.9306496 0-7.52644551-2.43502649-13.06059662-6.86234738-16.38108729-4.87005298-3.54185671-12.39649849-5.31278507-23.02206862-5.31278506h-40.06725405z m0 66.40981333v49.14326187h42.94501262c9.74010595 0 17.48791751-1.54956231 23.02206863-4.64868694 7.08371342-3.9845888 10.62557013-10.18283805 10.62557013-19.03747982 0-9.07600782-2.65639253-15.49562311-7.74781156-19.48021191-5.31278507-3.9845888-13.72469475-5.9768832-25.23572907-5.9768832h-43.60911075z m195.46621725-90.76007823c18.59474773 0 34.09037085 4.87005298 46.04413724 14.61015894 11.51103431 9.29737387 18.37338169 22.13660445 20.80840818 38.07495964h-25.23572907c-2.65639253-10.40420409-7.52644551-17.9306496-14.83152498-22.80070258-7.08371342-4.87005298-16.15972125-7.08371342-27.22802347-7.08371342-16.60245333 0-28.99895182 5.53415111-37.4108615 17.04518542-7.74781155 10.18283805-11.51103431 24.35026489-11.51103432 42.50228054 0 18.59474773 3.76322275 32.98354062 11.28966827 42.94501262 8.19054365 10.62557013 21.02977422 16.15972125 38.29632569 16.15972124 11.28966827 0 20.58704213-2.87775858 27.67075556-8.19054364 7.52644551-5.9768832 12.83923058-15.05289102 15.9383552-27.00665742h25.23572906c-3.54185671 18.59474773-11.73240035 32.98354062-24.79299698 43.38774471-12.17513245 9.74010595-26.78529138 14.61015893-43.8304768 14.61015893-26.34255929 0-46.04413725-8.41190969-58.88336782-24.79299698-11.28966827-14.16742685-16.82381938-33.20490667-16.82381938-57.11243946 0-23.46480071 5.75551715-42.72364658 17.48791752-57.33380551 13.28196267-16.82381938 32.54080853-25.01436302 57.7765376-25.01436303z" fill="#ffffff"></path></svg></i>'
        break;
    }
    this.placeholderTemp.set(key, div.children[0] as HTMLElement);
    return div.children[0] as HTMLElement;
  }

  getHtmlJson(key): string {
    switch (key) {
      case 'icon':
        return '<i nz-icon type="rabbit-design:icon-iconfont"></i>';
        break;
      case 'input':
        return '<input nz-input>';
        break;
    }
  }
})

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
