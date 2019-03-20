import {
  AfterViewInit,
  Directive,
  OnDestroy,
  OnChanges, Input, OnInit, ElementRef, NgZone, ViewContainerRef, Inject, Renderer2, Injector,
} from '@angular/core';
import {Directionality} from '@angular/cdk/bidi';
import {DOCUMENT} from '@angular/common';
import {ViewportRuler} from '@angular/cdk/overlay';

import {DragDropRegistry} from './drag-drop-registry';
import {ComponentDragRef, DragRefInterface, RelativeDragRef, FlowDragRef} from './ref/index';
import {StageBarItemDragRef} from './ref/stage-bar-item-drag-ref';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

type DesignDragType = 'relative' | 'stage-bar-item' | string;

/** Element that can be moved inside a CdkDropList container. */
@Directive({
  selector: '[designDrag]',
  exportAs: 'designDrag',
  host: {
    '[class.cdk-drag]': 'true',
    '[class.cdk-drag-dragging]': 'isDragging',
  }
})
export class RaDesignDragDirective<T = any> implements AfterViewInit, OnChanges, OnDestroy, OnInit {

  isDragging = false; // TODO
  @Input('designData') data: T;
  @Input('designDrag') type: DesignDragType;
  /** Whether starting to drag this element is disabled. */
  @Input('designDragDisabled')
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  dragRef: DragRefInterface<any>;

  constructor(public DragDropRegistry: DragDropRegistry<DragRefInterface>,
              public ElementRef: ElementRef,
              public Injector: Injector,
              public NgZone: NgZone,
              public Directionality: Directionality,
              public ViewContainerRef: ViewContainerRef,
              public ViewportRuler: ViewportRuler,
              public Renderer2: Renderer2,
              @Inject(DOCUMENT) public Document: Document
  ) {
    this.Renderer2.setProperty(ElementRef.nativeElement, 'designDragDrop', this);
  }

  ngOnInit() {
    switch (this.type) {
      case 'relative':
        this.dragRef = new RelativeDragRef(this);
        break;
      case 'stage-bar-item':
        this.dragRef = new StageBarItemDragRef(this);
        break;
      case 'component':
        this.dragRef = new ComponentDragRef(this);
        break;
      default :
        this.dragRef = new FlowDragRef(this);
    }
    this.DragDropRegistry.registerDragItem(this.dragRef);
  }

  ngAfterViewInit() {
    this.dragRef.withRootElement(this.ElementRef);
  }

  ngOnChanges() {

  }

  ngOnDestroy() {

  }
}

