import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DomHandler, Throttle, TreeHelper, TreeNodeModel} from 'rabbit-component';
import {
  DesignMenuModel, ToolsDatabaseDataModel,
} from '../../common/model';
import {
  RUNTIME_EVENT_ENUM,
  RuntimeEventService,
  RuntimeDataService,
  DragDropService,
  DragMoveService
} from '../../service';
import {ProjectService} from '../../common/serivce/backend/project.service';
import {ConnectionService} from '../../common/serivce/backend/connection.service';
import {TableObjectService} from '../../common/serivce/backend/table-object.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// password
// database

@Component({
  template: `
    <div class="ra-design-side-bar-interface-title">
      <i class="fa fa-first-order"></i>
      <label>数据源管理</label>
    </div>
    <ra-design-tree style="display: block;height: calc(100% - 30px);"
                    [(selection)]="toolsDatabaseData.selection"
                    [model]="toolsDatabaseData.tree" [contextMenuModel]="toolsDatabaseData.menu"
                    (dbclickEvent)="dbclick($event)"
                    (contextMenu)="onContextMenu($event)" (clickMenu)="onClickMenu($event)"></ra-design-tree>

    <!-- 新增数据库连接 -->
    <nz-modal [(nzVisible)]="newConnection.visible" nzTitle="New Project" (nzOnCancel)="handleNewConnectionCancel()"
              (nzOnOk)="handleNewConnectionOk()" [nzOkLoading]="newConnection.loading">
      <form nz-form [formGroup]="newConnection.validateForm">
        <nz-form-item>
          <nz-form-label [nzSpan]="7" nzRequired>Connection Name</nz-form-label>
          <nz-form-control [nzSpan]="12" nzHasFeedback>
            <input nz-input formControlName="connectionName" maxlength="214" placeholder="please input connection name">
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="7" nzRequired>Host</nz-form-label>
          <nz-form-control [nzSpan]="12" nzHasFeedback>
            <input nz-input formControlName="host" placeholder="Host: 127.0.0.1">
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="7" nzRequired>Port</nz-form-label>
          <nz-form-control [nzSpan]="12" nzHasFeedback>
            <input nz-input formControlName="port" placeholder="Port: 3306">
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="7" nzRequired>User</nz-form-label>
          <div>
            <nz-form-control [nzSpan]="12" nzHasFeedback>
              <input nz-input formControlName="username" placeholder="please input username">
            </nz-form-control>
          </div>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="7" nzRequired>Password</nz-form-label>
          <div>
            <nz-form-control [nzSpan]="12" nzHasFeedback>
              <input type="password" nz-input formControlName="password" placeholder="please input password">
            </nz-form-control>
          </div>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="7" nzRequired>Database</nz-form-label>
          <div>
            <nz-form-control [nzSpan]="12" nzHasFeedback>
              <input nz-input formControlName="database" placeholder="please input database">
            </nz-form-control>
          </div>
        </nz-form-item>
      </form>
    </nz-modal>
    <!-- 新增表 -->
    <nz-modal [(nzVisible)]="newTable.visible" nzTitle="New Project" (nzOnCancel)="handleNewTableCancel()"
              (nzOnOk)="handleNewTableOk()" [nzOkLoading]="newTable.loading">
      <form nz-form [formGroup]="newTable.validateForm">
        <nz-form-item>
          <nz-form-label [nzSpan]="7" nzRequired>Table Name</nz-form-label>
          <nz-form-control [nzSpan]="12" nzHasFeedback>
            <input nz-input formControlName="tableName" maxlength="214" placeholder="please input connection name">
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="7" nzRequired>Description</nz-form-label>
          <nz-form-control [nzSpan]="12" nzHasFeedback>
            <input nz-input formControlName="tableDescription" placeholder="Host: 127.0.0.1">
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-modal>

  `,
  styles: []
})
export class ToolsInterfaceDataSource implements OnInit, OnDestroy {
  toolsDatabaseData: ToolsDatabaseDataModel;
  newConnection: {
    validateForm?: FormGroup,
    visible?: boolean,
    loading?: boolean,
  } = {
    visible: false,
    loading: false,
  };
  newTable: {
    validateForm?: FormGroup,
    visible?: boolean,
    loading?: boolean,
  } = {
    visible: false,
    loading: false,
  };
  treeHelper: TreeHelper;

  constructor(public RuntimeEventService: RuntimeEventService,
              public RuntimeDataService: RuntimeDataService,
              private FormBuilder: FormBuilder,
              public DragDropService: DragDropService,
              public DragMoveService: DragMoveService,
              public DomHandler: DomHandler,
              public ProjectService: ProjectService,
              public ConnectionService: ConnectionService,
              public TableObjectService: TableObjectService,
              public HttpClient: HttpClient) {
    this.toolsDatabaseData = this.RuntimeDataService.toolsDatabaseData;
    this.HttpClient.get('api/dataSource/findAll').subscribe((result: any) => {
      this.toolsDatabaseData.tree = [result.data];
    });
  }

  ngOnInit() {
    this.newConnection.validateForm = this.FormBuilder.group({
      connectionName: ['', [Validators.required],],
      host: ['', [Validators.required]],
      port: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      database: ['', [Validators.required]],
    });
    this.newTable.validateForm = this.FormBuilder.group({
      tableName: ['', [Validators.required],],
      tableDescription: ['', [Validators.required]],
    });
  }

  ngOnDestroy() {
  }

  onContextMenu($event: TreeNodeModel) {
    if ($event.icon == 'fa-folder') {
      this.toolsDatabaseData.menu = [
        {
          label: 'New Connection',
          items: [
            {
              label: 'Mysql',
              key: 'newMysql',
              icon: 'fa-database',
            }
          ]
        }
      ]
    } else if ($event.icon == 'fa-database') {
      this.toolsDatabaseData.menu = [
        {
          label: 'New Table',
          items: [
            {
              label: 'Table',
              key: 'newTable',
              icon: 'fa-table',
            }
          ]
        }
      ]
    } else {
      this.toolsDatabaseData.menu = []
    }
  }

  onClickMenu($event: DesignMenuModel) {
    console.log($event);
    if ($event.key === 'newMysql') {
      this.newConnection.visible = true;
      this.newConnection.validateForm.reset({
        host: '127.0.0.1',
        port: '3306',
      });
    }
    if ($event.key === 'newTable') {
      this.newTable.visible = true;
    }
  }

  dbclick($event: TreeNodeModel) {
    if ($event.icon !== 'fa-table') {
      return;
    }
    this.RuntimeEventService.emit(RUNTIME_EVENT_ENUM.DateSource_DoubleClick, $event, this);
  }

  handleNewConnectionCancel() {
    this.newConnection.visible = false;
  }

  handleNewConnectionOk() {
    this.newConnection.loading = true;
    this.newConnection.validateForm.value.type = 'mysql';
    this.HttpClient.post('api/dataSource/connection', this.newConnection.validateForm.value).subscribe((result: any) => {
      this.newConnection.loading = false;
      this.newConnection.visible = false;
      TreeHelper.forEach(this.toolsDatabaseData.tree, (node) => {
        if (result.data.projectID === node.projectID) {
          node.children.push(result.data);
          return true;
        }
      })
    }, () => this.newConnection.loading = false);
  }

  handleNewTableCancel() {
    this.newTable.visible = false;
  }

  handleNewTableOk() {
    this.newTable.loading = true;
    this.newTable.validateForm.value.connectionID = this.toolsDatabaseData.selection[0].connectionID;
    this.HttpClient.post('api/dataSource/table', this.newTable.validateForm.value).subscribe((result: any) => {
      this.newTable.loading = false;
      this.newTable.visible = false;
      TreeHelper.forEach(this.toolsDatabaseData.tree, (node) => {
        if (result.data.connectionID === node.connectionID) {
          node.expanded = true;
          node.children.push(result.data);
          return true;
        }
      });
    }, () => this.newTable.loading = false);
  }
}
