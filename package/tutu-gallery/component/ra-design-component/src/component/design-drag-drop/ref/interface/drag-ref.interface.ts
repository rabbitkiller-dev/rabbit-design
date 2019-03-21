import {ElementRef, NgZone, ViewContainerRef} from '@angular/core';
import {DragDropRegistry} from '../../drag-drop-registry';
import {Directionality} from '@angular/cdk/bidi';
import {ViewportRuler} from '@angular/cdk/overlay';

export interface DragRefInterface<T = any> {
  data: T;
  DragDropRegistry: DragDropRegistry<DragRefInterface<T>>;
  NgZone: NgZone;
  ViewContainerRef: ViewContainerRef;
  Document: Document;
  Directionality: Directionality;
  ViewportRuler: ViewportRuler;

  readonly disabled: boolean;
  _rootElement: HTMLElement;


  /**
   * Sets an alternate drag root element. The root element is the element that will be moved as
   * the user is dragging. Passing an alternate root element is useful when trying to enable
   * dragging on an element that you might not have access to.
   */
  withRootElement(rootElement: ElementRef<HTMLElement> | HTMLElement): DragRefInterface<T>;

  /**
   * Returns the element that is being used as a placeholder
   * while the current element is being dragged.
   */
  getPlaceholderElement(): HTMLElement;

  /** Returns the root draggable element. */
  getRootElement(): HTMLElement;
}
