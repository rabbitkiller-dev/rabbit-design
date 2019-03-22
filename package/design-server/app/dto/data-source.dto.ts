import {DataSourceColumn} from '../entity/data-source-column';
import {DataSourceConnection} from '../entity/data-source-connection';
import {DataSourceTable} from '../entity/data-source-table';
import {Project} from '../entity/project';
import {TreeDto} from './tree.dto';

export interface QueryDataSourceDto extends Project, TreeDto {
  children?: QueryConnectionDto[];
}

export interface QueryConnectionDto extends DataSourceConnection, TreeDto {
  children?: QueryTableDto[];
}

export interface QueryTableDto extends DataSourceTable, TreeDto {
  children?: QueryColumnDto[];
}

export interface QueryColumnDto extends DataSourceColumn, TreeDto {
}
