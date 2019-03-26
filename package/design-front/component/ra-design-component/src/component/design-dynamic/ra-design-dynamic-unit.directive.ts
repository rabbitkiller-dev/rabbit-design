import {
  ComponentFactory,
  ComponentRef,
  Directive,
  ElementRef,
  Host,
  HostListener,
  Injector,
  Input,
  OnInit,
  ViewContainerRef,
  Inject,
  InjectFlags,
  NgZone,
  Renderer2, AfterViewInit
} from '@angular/core';
import {NzIconDirective} from './icon';
import {PageEditorService} from '../design-stage/page-editor/page-editor.service';
import {HtmlJson} from 'himalaya';
import {PropertiesEditorService} from '../design-tools/properties-editor/properties-editor.service';
import {parserDirective} from './parser-directive';
import {NzInputDirective} from './input';
import {RaDesignDragDirective} from '../design-drag-drop/ra-design-drag.directive';
import {DragDropRegistry} from '../design-drag-drop/drag-drop-registry';
import {DragRefInterface} from '../design-drag-drop/ref';
import {Directionality} from '@angular/cdk/bidi';
import {ViewportRuler} from '@angular/cdk/overlay';
import {DOCUMENT} from '@angular/common';
import {DesignDragType} from '../design-drag-drop/interface';


@Directive({
  selector: '[design-dynamic-unit]',
  host: {
    '[class.cdk-drag]': 'true',
    '[class.cdk-drag-dragging]': 'isDragging',
  }
})
export class RaDesignDynamicUnitDirective extends RaDesignDragDirective<HtmlJson> implements OnInit, AfterViewInit {
  @Input('design-stage-id') stageID: string;
  @Input('design-dynamic-unit') path: string;
  type: DesignDragType = 'dynamic-unit';
  ref: any[] = [];

  @HostListener('click', ['$event']) onClick($event) {
    this.PropertiesEditorService.openPropertiePanel(this.data);
  }

  constructor(
    public ElementRef: ElementRef,
    public ViewC: ViewContainerRef,
    public PageEditorService: PageEditorService,
    public PropertiesEditorService: PropertiesEditorService,
    public Injector: Injector,
    public DragDropRegistry: DragDropRegistry<DragRefInterface>,
    public NgZone: NgZone,
    public Directionality: Directionality,
    public ViewContainerRef: ViewContainerRef,
    public ViewportRuler: ViewportRuler,
    public Renderer2: Renderer2,
    @Inject(DOCUMENT) public Document: Document
  ) {
    super(DragDropRegistry, ElementRef, Injector, NgZone, Directionality, ViewContainerRef, ViewportRuler, Renderer2, Document);
  }

  ngOnInit(): void {
    this.data = this.PageEditorService.getNodeJson(this.path);
    this.getRef();
    super.ngOnInit();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  getRef() {
    const directives = parserDirective(this.data);
    directives.forEach((directives) => {
      if (directives === 'nz-icon') {
        this.ref.push(this.Injector.get(NzIconDirective, null, InjectFlags.SkipSelf));
      } else {
        this.ref.push(this.Injector.get(NzInputDirective, null, InjectFlags.SkipSelf));
      }
    });
  }

}


