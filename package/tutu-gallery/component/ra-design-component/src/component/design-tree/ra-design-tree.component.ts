import {
  forwardRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  TemplateRef
} from '@angular/core';
import {Observable, ReplaySubject, Subscription} from 'rxjs';
import {isNotNil} from 'ng-zorro-antd';
import {InputBoolean} from 'ng-zorro-antd';
import {NzFormatBeforeDropEvent, NzFormatEmitEvent} from './interface';
import {TreeNodeModel} from './tree-node.model';
import {RaDesignTreeService} from './ra-design-tree.service';
import {RaDesignDragDirective, RaDesignDropDirective} from '../design-drag-drop';


@Component({
  selector: 'ra-design-tree',
  templateUrl: './ra-design-tree.component.html',
  providers: [
    RaDesignTreeService
  ]
})

export class RaDesignTreeComponent implements OnInit, OnChanges, OnDestroy {
  @Input() @InputBoolean() nzShowIcon = false;
  @Input() @InputBoolean() nzShowLine = false;
  @Input() @InputBoolean() nzCheckStrictly = false;
  @Input() @InputBoolean() nzCheckable = false;
  @Input() @InputBoolean() nzShowExpand = true;
  @Input() @InputBoolean() nzAsyncData = false;
  @Input() @InputBoolean() nzMultiple = false;
  @Input() @InputBoolean() nzExpandAll: boolean = false;
  @Input() @InputBoolean() nzHideUnMatched = false;
  /**
   * drag-drop
   */
  @Input() @InputBoolean() designDragDisabled = true;
  @Input() designDragType: string;
  @Input() designDropType: string;
  @Input() enterPredicate: (drag: RaDesignDragDirective<any>, drop: RaDesignDropDirective<any>) => boolean = () => true;
  /**
   * @deprecated use
   * nzExpandAll instead
   */
  @Input() @InputBoolean() nzDefaultExpandAll: boolean = false;
  @Input() nzBeforeDrop: (confirm: NzFormatBeforeDropEvent) => Observable<boolean>;

  @Input()
  // tslint:disable-next-line:no-any
  set nzData(value: any[]) {
    if (Array.isArray(value)) {
      if (!this.RaDesignTreeService.isArrayOfNzTreeNode(value)) {
        // has not been new TreeNodeModel
        this.nzNodes = value.map(item => (new TreeNodeModel(item)));
      } else {
        this.nzNodes = value;
      }
      this.RaDesignTreeService.conductOption.isCheckStrictly = this.nzCheckStrictly;
      this.RaDesignTreeService.initTree(this.nzNodes);
    } else {
      if (value !== null) {
        console.warn('ngModel only accepts an array and must be not empty');
      }
    }
  }

  /**
   * @deprecated use
   * nzExpandedKeys instead
   */
  @Input()
  set nzDefaultExpandedKeys(value: string[]) {
    this.nzDefaultSubject.next({type: 'nzExpandedKeys', keys: value});
  }

  /**
   * @deprecated use
   * nzSelectedKeys instead
   */
  @Input()
  set nzDefaultSelectedKeys(value: string[]) {
    this.nzDefaultSubject.next({type: 'nzSelectedKeys', keys: value});
  }

  /**
   * @deprecated use
   * nzCheckedKeys instead
   */
  @Input()
  set nzDefaultCheckedKeys(value: string[]) {
    this.nzDefaultSubject.next({type: 'nzCheckedKeys', keys: value});
  }

  @Input()
  set nzExpandedKeys(value: string[]) {
    this.nzDefaultSubject.next({type: 'nzExpandedKeys', keys: value});
  }

  @Input()
  set nzSelectedKeys(value: string[]) {
    this.nzDefaultSubject.next({type: 'nzSelectedKeys', keys: value});
  }

  @Input()
  set nzCheckedKeys(value: string[]) {
    this.nzDefaultSubject.next({type: 'nzCheckedKeys', keys: value});
  }

  @Input()
  set nzSearchValue(value: string) {
    this._searchValue = value;
    this.RaDesignTreeService.searchExpand(value);
    if (isNotNil(value)) {
      this.nzSearchValueChange.emit(this.RaDesignTreeService.formatEvent('search', null, null));
      this.nzOnSearchNode.emit(this.RaDesignTreeService.formatEvent('search', null, null));
    }
  }

  get nzSearchValue(): string {
    return this._searchValue;
  }

  // model bind
  @Output() readonly nzExpandedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() readonly nzSelectedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() readonly nzCheckedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Output() readonly nzSearchValueChange: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  /**
   * @deprecated use
   * nzSearchValueChange instead
   */
  @Output() readonly nzOnSearchNode: EventEmitter<NzFormatEmitEvent> = new EventEmitter();

  @Output() readonly nzClick: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly nzDblClick: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly nzContextMenu: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly nzCheckBoxChange: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly nzExpandChange: EventEmitter<NzFormatEmitEvent> = new EventEmitter();

  @Output() readonly nzOnDragStart: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly nzOnDragEnter: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly nzOnDragOver: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly nzOnDragLeave: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly nzOnDrop: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  @Output() readonly nzOnDragEnd: EventEmitter<NzFormatEmitEvent> = new EventEmitter();
  // tslint:disable-next-line:no-any
  @ContentChild('nzTreeTemplate') nzTreeTemplate: TemplateRef<any>;
  _searchValue = null;
  nzDefaultSubject = new ReplaySubject<{ type: string, keys: string[] }>(6);
  nzDefaultSubscription: Subscription;
  nzNodes: TreeNodeModel[] = [];
  prefixCls = 'ra-design-tree';
  nzTreeClass = {};

  getTreeNodes(): TreeNodeModel[] {
    return this.nzNodes;
  }

  /**
   * public function
   */
  getCheckedNodeList(): TreeNodeModel[] {
    return this.RaDesignTreeService.getCheckedNodeList();
  }

  getSelectedNodeList(): TreeNodeModel[] {
    return this.RaDesignTreeService.getSelectedNodeList();
  }

  getHalfCheckedNodeList(): TreeNodeModel[] {
    return this.RaDesignTreeService.getHalfCheckedNodeList();
  }

  getExpandedNodeList(): TreeNodeModel[] {
    return this.RaDesignTreeService.getExpandedNodeList();
  }

  getMatchedNodeList(): TreeNodeModel[] {
    return this.RaDesignTreeService.getMatchedNodeList();
  }

  setClassMap(): void {
    this.nzTreeClass = {
      [this.prefixCls]: true,
      [this.prefixCls + '-show-line']: this.nzShowLine,
      [`${this.prefixCls}-icon-hide`]: !this.nzShowIcon,
    };
  }

  constructor(public RaDesignTreeService: RaDesignTreeService) {
  }

  ngOnInit(): void {
    this.setClassMap();
    this.nzDefaultSubscription = this.nzDefaultSubject.subscribe((data: { type: string, keys: string[] }) => {
      if (!data || !data.keys) {
        return;
      }
      switch (data.type) {
        case 'nzExpandedKeys':
          this.RaDesignTreeService.calcExpandedKeys(data.keys, this.nzNodes);
          this.nzExpandedKeysChange.emit(data.keys);
          break;
        case 'nzSelectedKeys':
          this.RaDesignTreeService.calcSelectedKeys(data.keys, this.nzNodes, this.nzMultiple);
          this.nzSelectedKeysChange.emit(data.keys);
          break;
        case 'nzCheckedKeys':
          this.RaDesignTreeService.calcCheckedKeys(data.keys, this.nzNodes, this.nzCheckStrictly);
          this.nzCheckedKeysChange.emit(data.keys);
          break;
      }
    });
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {
    if (changes.nzCheckStrictly) {
      this.RaDesignTreeService.conductOption.isCheckStrictly = changes.nzCheckStrictly.currentValue;
    }
  }

  ngOnDestroy(): void {
    if (this.nzDefaultSubscription) {
      this.nzDefaultSubscription.unsubscribe();
      this.nzDefaultSubscription = null;
    }
  }
}
