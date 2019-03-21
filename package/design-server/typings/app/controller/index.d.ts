// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAuth from '../../../app/controller/auth';
import ExportHome from '../../../app/controller/home';
import ExportProject from '../../../app/controller/project';
import ExportToolsIcon from '../../../app/controller/tools-icon';
import ExportToolsPage from '../../../app/controller/tools-page';

declare module 'egg' {
  interface IController {
    auth: ExportAuth;
    home: ExportHome;
    project: ExportProject;
    toolsIcon: ExportToolsIcon;
    toolsPage: ExportToolsPage;
  }
}
