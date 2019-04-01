import {Common} from './common';
import * as fs from 'fs';
import * as path from 'path';

class I18n extends Common {
  constructor(mode, option) {
    super(mode, option);
  }

  async start() {
    const i18nPaths = this.config.i18nPaths;
    for (const src of i18nPaths) {
      const folderNames = fs.readdirSync(src).// 遍历文件获取文件夹
      filter((filename, index) => {
        return fs.statSync(path.join(src, filename)).isDirectory();
      });
      for (const folderName of folderNames) {
        const json = await this.getI18nJson(path.join(src, folderName));
        fs.writeFileSync(path.join(src, folderName) + '.json', JSON.stringify(json, null, 2));
      }
    }
  }

  async getI18nJson(i18nPath: string): Promise<any> {
    const filenames = fs.readdirSync(i18nPath).// 遍历文件获取文件
    filter((filename, index) => {
      return !fs.statSync(path.join(i18nPath, filename)).isDirectory();
    });
    const result = {};
    filenames.forEach((filename) => {
      const json = JSON.parse(fs.readFileSync(path.join(i18nPath, filename)).toString());
      Object.assign(result, json);
    });
    return result;
  }
}

// @ts-ignore
export = I18n;
