// import {DataSourceConnection} from '../entity/data-source-connection';
// import {DataSourceTable} from '../entity/data-source-table';
// import UserService from '../service/user';
// import {DataSourceTableDto} from '../dto/data-source.dto';
// import {DataSourceColumn} from '../entity/data-source-column';
import {EntityManager} from 'typeorm';
import {Controller} from '../lib';
import {Result} from '../lib/web/result';

export default class DataSourceController extends Controller {
  async index() {
    await this.app.typeorm.transaction(async (entityManager: EntityManager) => {
      this.ctx.body = new Result(await this.ctx.service.dataSource.index(entityManager, {projectID: this.config.user.projectID}));
    });
  }

/*  async findAll() {
    this.ctx.result(await this.ctx.service.dataSource.findAll(UserService.PROJECT_NAME, UserService.BRANCH_NAME));
  }

  async saveConnection() {
    const connection: object = this.ctx.getParams();
    this.ctx.validate({
      connectionName: {type: 'string'},
      type: {type: 'string'},
      host: {type: 'string'},
      port: {type: 'string'},
      username: {type: 'string'},
      password: {type: 'string'},
      database: {type: 'string'},
    }, connection);
    const entity: DataSourceConnection & TreeDto = this.ctx.app.typeorm.getRepository(DataSourceConnection).create(connection);
    entity.projectID = UserService.PROJECT_ID;
    entity.branchName = UserService.BRANCH_NAME;
    await this.ctx.service.dataSource.saveConnection(entity);
    entity.title = entity.connectionName;
    entity.icon = 'fa-database';
    entity.expanded = true;
    entity.children = [];
    this.ctx.result(entity);
  }

  async findTable() {
    const params: any = this.ctx.getParams();
    this.ctx.validate({
      tableID: {type: 'string'},
    }, params);
    this.ctx.result(await this.ctx.service.dataSource.findTable(params.tableID));
  }

  async saveTable() {
    const table: object & { column: any[] } = this.ctx.getParams();
    this.ctx.validate({
      tableName: {type: 'string'},
      tableDescription: {type: 'string'},
      connectionID: {type: 'string'},
    }, table);
    const entity: DataSourceTable & any = this.ctx.app.typeorm.getRepository(DataSourceTable).create(table);
    entity.column = this.ctx.app.typeorm.getRepository(DataSourceColumn).create(table.column);
    entity.projectID = UserService.PROJECT_ID;
    entity.branchName = UserService.BRANCH_NAME;
    await this.ctx.service.dataSource.saveTable(entity);
    // entity.title = entity.tableName;
    // entity.icon = 'fa-table';
    this.ctx.result(entity);
  }

  async updateTable() {
    const table: object & { column: any[] } = this.ctx.getParams();
    this.ctx.validate({
      tableID: {type: 'string'},
      tableName: {type: 'string'},
      tableDescription: {type: 'string'},
      connectionID: {type: 'string'},
      projectID: {type: 'string'},
      branchName: {type: 'string'},
    }, table);
    const entity: DataSourceTableDto & any = this.ctx.app.typeorm.getRepository(DataSourceTable).create(table);
    entity.column = this.ctx.app.typeorm.getRepository(DataSourceColumn).create(table.column);
    await this.ctx.service.dataSource.updateTable(entity);
    // entity.title = entity.tableName;
    // entity.icon = 'fa-table';
    this.ctx.result(entity);
  }*/
}
