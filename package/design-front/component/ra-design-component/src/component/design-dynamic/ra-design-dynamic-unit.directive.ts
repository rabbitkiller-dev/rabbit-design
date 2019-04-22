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
  Renderer2, AfterViewInit, ChangeDetectorRef, HostBinding
} from '@angular/core';
import {
  NzInputDirective,
  NzHeaderComponent,
  NzIconDirective,
  NzLayoutComponent, NzContentComponent, NzFooterComponent, NzSiderComponent, NzButtonComponent
} from './nz-module/ng-zorro-antd.module';
import {PageEditorService} from '../design-stage/page-editor/page-editor.service';
import {HtmlJson} from 'himalaya';
import {PropertiesEditorService} from '../design-tools/properties-editor/properties-editor.service';
import {parserDirective} from './parser-directive';
import {RaDesignDragDirective} from '../design-drag-drop/ra-design-drag.directive';
import {DragDropRegistry} from '../design-drag-drop/drag-drop-registry';
import {DragRefInterface} from '../design-drag-drop/ref';
import {Directionality} from '@angular/cdk/bidi';
import {ViewportRuler} from '@angular/cdk/overlay';
import {DOCUMENT} from '@angular/common';
import {DesignDragType} from '../design-drag-drop/interface';
import {DynamicUnitInterface} from './interface';


@Directive({
  selector: '[design-dynamic-unit]',
  host: {
    '[class.cdk-drag]': 'true',
    '[class.cdk-drag-dragging]': 'isDragging',
  }
})
export class RaDesignDynamicUnitDirective extends RaDesignDragDirective<HtmlJson> implements OnInit, AfterViewInit, DynamicUnitInterface {
  type: DesignDragType = 'dynamic-unit';
  ref: any = {};
  stageID: string;
  @Input('design-dynamic-unit') RabbitPath: string;
  @Input() RabbitID: string;
  @HostBinding('class.dynamic-select') isSelect = false;
  @HostBinding('class.dynamic-blank') isBlank: boolean = false;
  @HostBinding('class.dynamic-look-unit') lookUnit = false;
  lookDrag = false;
  lookDrop = false;
  mergeParent = false;
  isContainer = false;

  @HostListener('click', ['$event']) onClick($event) {
    // 判断是否已经点击,然后结束冒泡
    if ($event['designDynamicUnit_click']) {
      return;
    }
    this.PageEditorService.select(this.RabbitPath);
    // 用事件冒泡告诉他们已经点击了 用这种方法不停止冒泡
    $event['designDynamicUnit_click'] = true;
  }

  @HostListener('mousemove', ['$event']) onMouseEnter($event: MouseEvent) {
    // 判断是否已经点击,然后结束冒泡
    if ($event['designDynamicUnit_mouseenter'] || this.lookUnit || this.mergeParent) {
      return;
    }
    this.PageEditorService.hover($event, this.ElementRef.nativeElement);
    // 用事件冒泡告诉他们已经点击了 用这种方法不停止冒泡
    $event['designDynamicUnit_mouseenter'] = true;
  }

  constructor(
    public ElementRef: ElementRef,
    public ViewC: ViewContainerRef,
    public PageEditorService: PageEditorService,
    public PropertiesEditorService: PropertiesEditorService,
    public Injector: Injector,
    public ChangeDetectorRef: ChangeDetectorRef,
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
    this.stageID = this.RabbitPath.split('|')[0];
    this.data = this.PageEditorService.getNodeJson(this.RabbitPath);
    this.isBlank = this.data.children.length < 1;
    this.getRef();
    this.PageEditorService.registerDynamicUnit(this.stageID, this);
    super.ngOnInit();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.ChangeDetectorRef.markForCheck();
  }

  getRef() {
    const directives = parserDirective(this.data);
    directives.forEach((directives) => {
      if (directives === 'nz-icon') {
        this.ref['nz-icon'] = this.Injector.get(NzIconDirective, null, InjectFlags.SkipSelf);
      } else if (directives === 'nz-button') {
        this.ref['nz-button'] = this.Injector.get(NzButtonComponent, null, InjectFlags.SkipSelf);
      } else if (directives === 'nz-input') {
        this.ref['nz-input'] = this.Injector.get(NzInputDirective, null, InjectFlags.SkipSelf);
      } else if (directives === 'nz-header') {
        this.ref['nz-header'] = this.Injector.get(NzHeaderComponent, null, InjectFlags.SkipSelf);
      } else if (directives === 'nz-content') {
        this.ref['nz-content'] = this.Injector.get(NzContentComponent, null, InjectFlags.SkipSelf);
      } else if (directives === 'nz-footer') {
        this.ref['nz-footer'] = this.Injector.get(NzFooterComponent, null, InjectFlags.SkipSelf);
      } else if (directives === 'nz-layout') {
        this.ref['nz-layout'] = this.Injector.get(NzLayoutComponent, null, InjectFlags.SkipSelf);
      } else if (directives === 'nz-sider') {
        this.ref['nz-sider'] = this.Injector.get(NzSiderComponent, null, InjectFlags.SkipSelf);
      }
    });
  }

}


