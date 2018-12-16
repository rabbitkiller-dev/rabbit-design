import {animate, state, style, transition, trigger} from '@angular/animations';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChange,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {fromEvent, Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {InputBoolean} from 'ng-zorro-antd';
import {NzFormatBeforeDropEvent, NzFormatEmitEvent} from './interface';
import {TreeNodeModel} from './tree-node.model';
import {isCheckDisabled} from './nz-tree-util';
import {RaDesignTreeService} from './ra-design-tree.service';

@Component({
  selector: 'ra-design-tree-node',
  templateUrl: './ra-design-tree-node.component.html',
  preserveWhitespaces: false,
  animations: [
    trigger('nodeState', [
      state('inactive', style({
        opacity: '0',
        height: '0',
        display: 'none'
      })),
      state('active', style({
        opacity: '1',
        height: '*'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ]
})

export class RaDesignTreeNodeComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('dragElement') dragElement: ElementRef;

  @Input() @InputBoolean() nzShowLine: boolean;
  @Input() @InputBoolean() nzShowExpand: boolean;
  @Input() @InputBoolean() nzMultiple: boolean;
  @Input() @InputBoolean() nzCheckable: boolean;
  @Input() @InputBoolean() nzAsyncData: boolean;
  @Input() @InputBoolean() nzCheckStrictly: boolean;
  @Input() @InputBoolean() nzHideUnMatched = false;
  @Input() nzTreeTemplate: TemplateRef<void>;
  @Input() nzBeforeDrop: (confirm: NzFormatBeforeDropEvent) => Observable<boolean>;

  @Input()
  set nzTreeNode(value: TreeNodeModel) {
    // add to checked list & selected list
    if (value.isChecked) {
      this.RaDesignTreeService.setCheckedNodeList(value);
    }
    // add select list
    if (value.isSelected) {
      this.RaDesignTreeService.setSelectedNodeList(value, this.nzMultiple);
    }
    if (!value.isLeaf) {
      this.RaDesignTreeService.setExpandedNodeList(value);
    }
    this._nzTreeNode = value;
  }

  get nzTreeNode(): TreeNodeModel {
    return this._nzTreeNode;
  }

  @Input()
  set nzDraggable(value: boolean) {
    this._nzDraggable = value;
    this.handDragEvent();
  }

  get nzDraggable(): boolean {
    return this._nzDraggable;
  }

  /**
   * @deprecated use
   * nzExpandAll instead
   */
  @Input()
  set nzDefaultExpandAll(value: boolean) {
    this._nzExpandAll = value;
    if (value && this.nzTreeNode && !this.nzTreeNode.isLeaf) {
      this.nzTreeNode.setExpanded(true);
      this.RaDesignTreeService.setExpandedNodeList(this.nzTreeNode);
    }
  }

  get nzDefaultExpandAll(): boolean {
    return this._nzExpandAll;
  }

  // default set
  @Input()
  set nzExpandAll(value: boolean) {
    this._nzExpandAll = value;
    if (value && this.nzTreeNode && !this.nzTreeNode.isLeaf) {
      this.nzTreeNode.setExpanded(true);
      this.RaDesignTreeService.setExpandedNodeList(this.nzTreeNode);
    }
  }

  get nzExpandAll(): boolean {
    return this._nzExpandAll;
  }

  @Input()
  set nzSearchValue(value: string) {
    this.highlightKeys = [];
    if (value && this.nzTreeNode.title.includes(value)) {
      // match the search value
      const index = this.nzTreeNode.title.indexOf(value);
      this.highlightKeys.push(this.nzTreeNode.title.slice(0, index));
      this.highlightKeys.push(this.nzTreeNode.title.slice(index + value.length, this.nzTreeNode.title.length));
    }
    this._searchValue = value;
  }

  get nzSearchValue(): string {
    return this._searchValue;
  }

  // Output
  @Output() readonly clickNode: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly dblClick: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly contextMenu: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly clickCheckBox: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly clickExpand: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly nzDragStart: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly nzDragEnter: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly nzDragOver: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly nzDragLeave: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly nzDrop: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly nzDragEnd: EventEmitter<NzFormatEmitEvent> = new EventEmitter();

  // default var
  prefixCls = 'ant-tree';
  highlightKeys = [];
  nzNodeClass = {};
  nzNodeSwitcherClass = {};
  nzNodeContentClass = {};
  nzNodeContentIconClass = {};
  nzNodeContentLoadingClass = {};
  nzNodeChildrenClass = {};

  /**
   * drag var
   */
  destory$ = new Subject();
  dragPos = 2;
  dragPosClass: object = {
    '0': 'drag-over',
    '1': 'drag-over-gap-bottom',
    '-1': 'drag-over-gap-top'
  };

  /**
   * default set
   */
  _nzTreeNode: TreeNodeModel;
  _searchValue = '';
  _nzExpandAll = false;
  _nzDraggable = false;
  oldAPIIcon = true;

  get nzIcon(): string {
    if (this.nzTreeNode && this.nzTreeNode.origin.icon) {
      this.oldAPIIcon = this.nzTreeNode.origin.icon.indexOf('anticon') > -1;
    }
    return this.nzTreeNode && this.nzTreeNode.origin.icon;
  }

  get canDraggable(): boolean | null {
    return (this.nzDraggable && this.nzTreeNode && !this.nzTreeNode.isDisabled) ? true : null;
  }

  get isShowLineIcon(): boolean {
    return !this.nzTreeNode.isLeaf && this.nzShowLine;
  }

  get isShowSwitchIcon(): boolean {
    return !this.nzTreeNode.isLeaf && !this.nzShowLine;
  }

  get isSwitcherOpen(): boolean {
    return (this.nzTreeNode.isExpanded && !this.nzTreeNode.isLeaf);
  }

  get isSwitcherClose(): boolean {
    return (!this.nzTreeNode.isExpanded && !this.nzTreeNode.isLeaf);
  }

  get displayStyle(): string {
    // TODO
    return (this.nzSearchValue && this.nzHideUnMatched && !this.nzTreeNode.isMatched && !this.nzTreeNode.isExpanded) ? 'none' : '';
  }

  /**
   * reset node class
   */
  setClassMap(): void {
    this.nzNodeClass = {
      [`${this.prefixCls}-treenode-disabled`]: this.nzTreeNode.isDisabled
    };
    this.nzNodeSwitcherClass = {
      [`${this.prefixCls}-switcher`]: true,
      [`${this.prefixCls}-switcher-noop`]: this.nzTreeNode.isLeaf
    };
    this.nzNodeContentClass = {
      [`${this.prefixCls}-node-content-wrapper`]: true
    };
    this.nzNodeContentIconClass = {
      [`${this.prefixCls}-iconEle`]: true,
      [`${this.prefixCls}-icon__customize`]: true
    };
    this.nzNodeContentLoadingClass = {
      [`${this.prefixCls}-iconEle`]: true
    };
    this.nzNodeChildrenClass = {
      [`${this.prefixCls}-child-tree`]: true,
      [`${this.prefixCls}-child-tree-open`]: true
    };
  }

  /**
   * click node to select, 200ms to dbl click
   */
  @HostListener('click', ['$event'])
  nzClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.nzTreeNode.isSelectable) {
      this.RaDesignTreeService.setNodeActive(this.nzTreeNode, this.nzMultiple);
    }
    this.clickNode.emit(this.RaDesignTreeService.formatEvent('click', this.nzTreeNode, event));
  }

  @HostListener('dblclick', ['$event'])
  nzDblClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dblClick.emit(this.RaDesignTreeService.formatEvent('dblclick', this.nzTreeNode, event));
  }

  /**
   * @param event
   */
  @HostListener('contextmenu', ['$event'])
  nzContextMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.contextMenu.emit(this.RaDesignTreeService.formatEvent('contextmenu', this.nzTreeNode, event));
  }

  /**
   * collapse node
   * @param event
   */
  _clickExpand(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.nzTreeNode.isLoading && !this.nzTreeNode.isLeaf) {
      // set async state
      if (this.nzAsyncData && this.nzTreeNode.getChildren().length === 0 && !this.nzTreeNode.isExpanded) {
        this.nzTreeNode.isLoading = true;
      }
      this.nzTreeNode.setExpanded(!this.nzTreeNode.isExpanded);
      this.RaDesignTreeService.setExpandedNodeList(this.nzTreeNode);
      this.clickExpand.emit(this.RaDesignTreeService.formatEvent('expand', this.nzTreeNode, event));
    }
  }

  /**
   * check node
   * @param event
   */
  _clickCheckBox(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // return if node is disabled
    if (isCheckDisabled(this.nzTreeNode)) {
      return;
    }
    this.nzTreeNode.setChecked(!this.nzTreeNode.isChecked);
    this.RaDesignTreeService.setCheckedNodeList(this.nzTreeNode);
    if (!this.nzCheckStrictly) {
      this.RaDesignTreeService.conduct(this.nzTreeNode);
    }
    this.clickCheckBox.emit(this.RaDesignTreeService.formatEvent('check', this.nzTreeNode, event));
  }

  /**
   * drag event
   * @param e
   */
  clearDragClass(): void {
    const dragClass = ['drag-over-gap-top', 'drag-over-gap-bottom', 'drag-over'];
    dragClass.forEach(e => {
      this.renderer.removeClass(this.dragElement.nativeElement, e);
    });
  }

  handleDragStart(e: DragEvent): void {
    e.stopPropagation();
    try {
      // ie throw error
      // firefox-need-it
      e.dataTransfer.setData('text/plain', '');
    } catch (error) {
      // empty
    }
    this.RaDesignTreeService.setSelectedNode(this.nzTreeNode);
    this.nzTreeNode.setExpanded(false);
    this.nzDragStart.emit(this.RaDesignTreeService.formatEvent('dragstart', null, e));
  }

  handleDragEnter(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    // reset position
    this.dragPos = 2;
    this.ngZone.run(() => {
      if ((this.nzTreeNode !== this.RaDesignTreeService.getSelectedNode()) && !this.nzTreeNode.isLeaf) {
        this.nzTreeNode.setExpanded(true);
      }
    });
    this.nzDragEnter.emit(this.RaDesignTreeService.formatEvent('dragenter', this.nzTreeNode, e));
  }

  handleDragOver(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    const dropPosition = this.RaDesignTreeService.calcDropPosition(e);
    if (this.dragPos !== dropPosition) {
      this.clearDragClass();
      this.dragPos = dropPosition;
      // leaf node will pass
      if (!(this.dragPos === 0 && this.nzTreeNode.isLeaf)) {
        this.renderer.addClass(this.dragElement.nativeElement, this.dragPosClass[this.dragPos]);
      }
    }
    this.nzDragOver.emit(this.RaDesignTreeService.formatEvent('dragover', this.nzTreeNode, e));
  }

  handleDragLeave(e: DragEvent): void {
    e.stopPropagation();
    this.ngZone.run(() => {
      this.clearDragClass();
    });
    this.nzDragLeave.emit(this.RaDesignTreeService.formatEvent('dragleave', this.nzTreeNode, e));
  }

  handleDragDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.ngZone.run(() => {
      this.clearDragClass();
      if (this.RaDesignTreeService.getSelectedNode() === this.nzTreeNode) {
        return;
      } else if (this.dragPos === 0 && this.nzTreeNode.isLeaf) {
        return;
      }
      // pass if node is leafNo
      if (this.nzBeforeDrop) {
        this.nzBeforeDrop({
          dragNode: this.RaDesignTreeService.getSelectedNode(),
          node: this.nzTreeNode,
          pos: this.dragPos
        }).subscribe((canDrop: boolean) => {
          if (canDrop) {
            this.RaDesignTreeService.dropAndApply(this.nzTreeNode, this.dragPos);
          }
          this.nzDrop.emit(this.RaDesignTreeService.formatEvent('drop', this.nzTreeNode, e));
          this.nzDragEnd.emit(this.RaDesignTreeService.formatEvent('dragend', this.nzTreeNode, e));
        });
      } else if (this.nzTreeNode) {
        this.RaDesignTreeService.dropAndApply(this.nzTreeNode, this.dragPos);
        this.nzDrop.emit(this.RaDesignTreeService.formatEvent('drop', this.nzTreeNode, e));
      }
    });
  }

  handleDragEnd(e: DragEvent): void {
    e.stopPropagation();
    this.ngZone.run(() => {
      // if user do not custom beforeDrop
      if (!this.nzBeforeDrop) {
        this.RaDesignTreeService.setSelectedNode(null);
        this.nzDragEnd.emit(this.RaDesignTreeService.formatEvent('dragend', this.nzTreeNode, e));
      }
    });
  }

  /**
   * 监听拖拽事件
   */
  handDragEvent(): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.nzDraggable) {
        this.destory$ = new Subject();
        fromEvent<DragEvent>(this.elRef.nativeElement, 'dragstart').pipe(takeUntil(this.destory$)).subscribe((e: DragEvent) => this.handleDragStart(e));
        fromEvent<DragEvent>(this.elRef.nativeElement, 'dragenter').pipe(takeUntil(this.destory$)).subscribe((e: DragEvent) => this.handleDragEnter(e));
        fromEvent<DragEvent>(this.elRef.nativeElement, 'dragover').pipe(takeUntil(this.destory$)).subscribe((e: DragEvent) => this.handleDragOver(e));
        fromEvent<DragEvent>(this.elRef.nativeElement, 'dragleave').pipe(takeUntil(this.destory$)).subscribe((e: DragEvent) => this.handleDragLeave(e));
        fromEvent<DragEvent>(this.elRef.nativeElement, 'drop').pipe(takeUntil(this.destory$)).subscribe((e: DragEvent) => this.handleDragDrop(e));
        fromEvent<DragEvent>(this.elRef.nativeElement, 'dragend').pipe(takeUntil(this.destory$)).subscribe((e: DragEvent) => this.handleDragEnd(e));
      } else {
        this.destory$.next();
        this.destory$.complete();
      }
    });
  }

  constructor(private RaDesignTreeService: RaDesignTreeService, private ngZone: NgZone, private renderer: Renderer2, private elRef: ElementRef) {
  }

  ngOnInit(): void {
    this.setClassMap();
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {
    this.setClassMap();
  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }
}
