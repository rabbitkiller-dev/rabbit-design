import {Common} from './common';
import * as fs from 'fs';
import * as path from 'path';
const shell = require('shelljs');

class I18n extends Common {
  // 暂存变量
  languages: {
    [index: string]: any;
  } = {};

  constructor(mode, option) {
    super(mode, option);
  }
  // 开始
  async start() {
    const sources = this.getSources();
    for (const source of sources) {
      const languageFolderNames = fs.readdirSync(source).// 遍历文件获取文件夹名
      filter((filename, index) => {
        return fs.statSync(path.join(source, filename)).isDirectory();
      });
      for (const languageFolderName of languageFolderNames) {
        const json = await this.getLanguageJson(path.join(source, languageFolderName));
        if (!this.languages[languageFolderName]) {
          this.languages[languageFolderName] = {};
        }
        Object.assign(this.languages[languageFolderName], json);
        // fs.writeFileSync(path.join(src, languageFolderName) + '.json', JSON.stringify(json, null, 2));
      }
    }
    await this.saveLanguages();
  }
  // 获取源目录
  getSources(): string[] {
    if (!this.config.i18n) {
      throw new Error('请配置i18n,例: {"i18n":{"source" : "./src/assets/i18n", "target":"./src/assets/i18n"}');
    }
    if (Array.isArray(this.config.i18n.source)) {
      return Array.from(new Set(this.config.i18n.source).values());
    } else {
      return [this.config.i18n.source]
    }
  }
  // 遍历某个语言目录的所有json文件, 合并然后返回
  async getLanguageJson(languageFolder: string): Promise<any> {
    const languageFiles = fs.readdirSync(languageFolder).// 遍历文件获取文件
    filter((filename, index) => {
      return !fs.statSync(path.join(languageFolder, filename)).isDirectory();
    });
    const result = {};
    languageFiles.forEach((languageFile) => {
      const json = JSON.parse(fs.readFileSync(path.join(languageFolder, languageFile)).toString());
      Object.assign(result, json);
    });
    return result;
  }
  // 保存this.languages到文件
  async saveLanguages() {
    if(!this.config.i18n.target){
      throw new Error('请配置18n输入目录,例: {"i18n":{"target":"./src/assets/i18n"}');
    }
    for(const language of Object.keys(this.languages)){
      shell.mkdir('-p', path.join(this.config.i18n.target));
      fs.writeFileSync(path.join(this.config.i18n.target, language) + '.json', JSON.stringify(this.languages[language], null, 2));
    }
  }

}

// @ts-ignore
export = I18n;
