// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTest from '../../../app/service/Test';
import ExportAuth from '../../../app/service/auth';
import ExportProject from '../../../app/service/project';
import ExportToolsIcon from '../../../app/service/tools-icon';
import ExportToolsPage from '../../../app/service/tools-page';
import ExportUser from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    test: ExportTest;
    auth: ExportAuth;
    project: ExportProject;
    toolsIcon: ExportToolsIcon;
    toolsPage: ExportToolsPage;
    user: ExportUser;
  }
}
