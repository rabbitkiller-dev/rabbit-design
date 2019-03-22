import {Service} from 'egg';
import {EntityManager} from 'typeorm';
import {
  QueryConnectionDto,
  QueryDataSourceDto,
} from '../dto/data-source.dto';
import {DataSourceConnection} from '../entity/data-source-connection';
import {Project} from '../entity/project';
import {TreeUtil} from '../lib/web/tree-util';
// import {DataSourceTable} from '../entity/data-source-table';
// import {DataSourceColumn} from '../entity/data-source-column';

export default class DataSourceService extends Service {
  async index(entityManager: EntityManager, params: {projectID: string}): Promise<QueryDataSourceDto[]> {
    const projectRepo = entityManager.getRepository(Project);
    const connectionRepo = entityManager.getRepository(DataSourceConnection);
    // const tableRepo = entityManager.getRepository(DataSourceTable);
    // const columnRepo = entityManager.getRepository(DataSourceColumn);
    const result: QueryDataSourceDto = TreeUtil.autoSet({
      key: 'projectID',
      title: 'projectName',
    }, await projectRepo.findOne({projectID: params.projectID, enable: true}), {
      icon: 'rabbit-design:icon-server',
      expanded: true,
      parentKey: '-1',
    });
    // 把[链接]塞进去
    const connectionList: QueryConnectionDto[] = await connectionRepo.find({
      projectID: result.projectID,
    });
    // const tableList = await tableRepo.find({
    //   projectID: result.projectID,
    // });
    // const columnList = await columnRepo.find({
    //   projectID: result.projectID,
    // });
    result.children = connectionList;
    return [result];
  }

/*  public async findAll(projectName: string, branchName: string): Promise<DataSourceTreeDto> {
    const dto: DataSourceTreeDto = await this.ctx.service.project.findByName(projectName);
    dto.title = dto.projectName;
    dto.icon = 'fa-folder';
    dto.expanded = true;
    // 把[链接]塞进去
    const connectionList: DataSourceConnectionDto[] = await this.ctx.app.typeorm.getRepository(DataSourceConnection).find({
      projectID: dto.projectID,
      branchName: branchName,
    });
    const connectionMap = new Map();
    const tableList = await this.ctx.app.typeorm.getRepository(DataSourceTable).find({
      projectID: dto.projectID,
      branchName: branchName,
    });

    (dto.children as any) = connectionList.map((connection) => {
      connection.title = connection.connectionName;
      connection.icon = 'fa-database';
      connection.children = [];
      connectionMap.set(connection.connectionID, connection);
      return connection;
    });
    tableList.map((table: DataSourceTable & TreeDto) => {
      table.title = table.tableName;
      table.icon = 'fa-table';
      const connection = connectionMap.get(table.connectionID);
      if (connection) {
        connection.children.push(table);
      } else {
        connectionList.push(table as any);
      }
    });
    return dto;
  }

  public async saveConnection(dataSourceConnection: DataSourceConnection): Promise<DataSourceConnection> {
    dataSourceConnection.enable = true;
    dataSourceConnection.branchName = UserService.BRANCH_NAME;
    return await this.ctx.getRepository(DataSourceConnection).save(dataSourceConnection);
  }

  public async findTable(tableID: string): Promise<DataSourceTableDto> {
    const result: ProjectTableDto & any = await this.ctx.getRepository(DataSourceTable).findOne(tableID);
    if (!result) {
      throw ErrorService.RuntimeErrorNotFind();
    }
    result.column = await this.ctx.app.typeorm.getRepository(DataSourceColumn).find({
      where: {
        tableID: tableID,
      },
    });
    return result;
  }

  public async saveTable(dataSourceTable: DataSourceTableDto) {
    // 保存自己
    await this.ctx.getRepository(DataSourceTable).save(dataSourceTable);
    await this.ctx.getRepository(DataSourceColumn).save(dataSourceTable.column);
    // 保存本地版本
    const localTable = this.ctx.getRepository(LocalDataSourceTable).create(dataSourceTable);
    const localColumn = this.ctx.getRepository(LocalDataSourceColumn).create(dataSourceTable.column);
    localColumn.map((column) => {
      column.localTableID = localTable.id;
    });
    await this.ctx.getRepository(LocalDataSourceTable).save(localTable);
    await this.ctx.getRepository(LocalDataSourceColumn).save(localColumn);
  }

  public async updateTable(dataSourceTable: DataSourceTableDto) {
    // 保存自己
    await this.ctx.getRepository(DataSourceTable).save(dataSourceTable);
    await this.ctx.app.typeorm.getRepository(DataSourceColumn).delete({
      tableID: dataSourceTable.tableID,
      branchName: dataSourceTable.branchName,
    });
    dataSourceTable.column.map((column) => {
      column.tableID = dataSourceTable.tableID;
      column.branchName = dataSourceTable.branchName;
      column.projectID = dataSourceTable.projectID;
    });
    await this.ctx.getRepository(DataSourceColumn).save(dataSourceTable.column);
    // 保存本地版本
    const localTable = this.ctx.getRepository(LocalDataSourceTable).create(dataSourceTable);
    await this.ctx.getRepository(LocalDataSourceTable).save(localTable);
    const localColumn = this.ctx.getRepository(LocalDataSourceColumn).create(dataSourceTable.column);
    localColumn.map((column) => {
      column.localTableID = localTable.id;
    });
    await this.ctx.getRepository(LocalDataSourceColumn).save(localColumn);
  }

  public async findProjectDataSource(projectID: string, branchName: string): Promise<ProjectDataSourceDto> {
    const project: ProjectDataSourceDto & any = await this.ctx.service.project.findOne(projectID);
    project.children = await this.findProjectConnection(projectID, branchName);
    return project;
  }

  public async findProjectConnection(projectID: string, branchName: string): Promise<ProjectConnectionDto[]> {
    const repo = this.ctx.app.typeorm.getRepository(DataSourceConnection);
    const connectionList: ProjectConnectionDto[] & any = await repo.find({
      where: {
        projectID: projectID,
        branchName: branchName,
      },
    });
    const tableList: ProjectTableDto[] = await this.findProjectTable(projectID, branchName);
    connectionList.map((connection) => {
      connection.children = tableList.filter((table) => {
        return connection.connectionID = table.connectionID;
      });
    });
    return connectionList;
  }

  public async findProjectTable(projectID: string, branchName: string): Promise<ProjectTableDto[]> {
    const repo = this.ctx.app.typeorm.getRepository(DataSourceTable);
    const tableList: ProjectTableDto[] & any = await repo.find({
      where: {
        projectID: projectID,
        branchName: branchName,
      },
    });
    const columnList: DataSourceColumn[] = await this.findProjectColumn(projectID, branchName);
    tableList.map((table) => {
      table.children = columnList.filter((column) => {
        return table.tableID === column.tableID;
      });
    });
    return tableList;
  }

  public async findProjectColumn(projectID: string, branchName: string): Promise<DataSourceColumn[]> {
    const repo = this.ctx.app.typeorm.getRepository(DataSourceColumn);
    return await repo.find({
      where: {
        projectID: projectID,
        branchName: branchName,
      },
    });
  }*/
}
