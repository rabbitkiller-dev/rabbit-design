import {Common} from './common';
import * as fs from 'fs';
import * as path from 'path';

const shell = require('shelljs');
import * as chokidar from 'chokidar';

let watcher;

class I18n extends Common {
  // 暂存变量
  // 语言Json
  languages: {
    [languageKey: string]: any;
  } = {};
  // 文件缓存
  files: Map<string, {
    [path: string]: string,
  }> = new Map();
  watcher: chokidar.FSWatcher;

  constructor(public mode, public option) {
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
    if (this.option.watch) {
      this.watchLanguage(sources);
    }
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
    const languageFiles = fs.readdirSync(languageFolder);// 遍历文件获取文件
    const result = {};
    for (const languageFile of languageFiles) {
      if (path.extname(languageFile) !== '.json') {
        continue;
      }
      const filePath = path.join(languageFolder, languageFile);
      if (fs.statSync(filePath).isDirectory()) {
        const json = await this.getLanguageJson(filePath);
        Object.assign(result, json);
      } else {
        const json = JSON.parse(fs.readFileSync(filePath).toString());
        Object.assign(result, json);
      }
    }
    return result;
  }

  // 保存this.languages到文件
  async saveLanguages() {
    if (!this.config.i18n.target) {
      throw new Error('请配置18n输入目录,例: {"i18n":{"target":"./src/assets/i18n"}');
    }
    for (const language of Object.keys(this.languages)) {
      shell.mkdir('-p', path.join(this.config.i18n.target));
      fs.writeFileSync(path.join(this.config.i18n.target, language) + '.json', JSON.stringify(this.languages[language], null, 2));
    }
  }

  /**
   * watch
   */
  watchLanguage(sources) {
    // watcher = this.watcher = chokidar.watch(sources, {ignored: /(^((?!\.json$).)*$)|(\..*___jb_tmp___)/g});
    watcher = this.watcher = chokidar.watch(sources, {depth: 1});
    watcher
      .on('add', () => {
      })
      .on('unlink', () => {
      })
      .on('error', function (error) {
        console.info('Error happened', error);
      })
      .on('ready', () => {
        watcher
          .on('addDir', this.addLanguage.bind(this))
          .on('change', this.watchChange.bind(this))
          .on('unlinkDir', this.deleteLanguage.bind(this));
      })
  }

  watchLanguageFile() {

  }

  watchChange(changeFilePath) {
    console.log(changeFilePath);
  }

  addLanguage(changeFolder) {
    this.files.set(path.basename(changeFolder), {});
    /**
     * 初始化语言目录
     */
      // 如果开启监听
    const watcher = chokidar.watch(changeFolder);
    watcher
      .on('error', function (error) {
        console.info('Error happened', error);
      })
      .on('ready', () => {
        watcher
          .on('add', () => {
          })
          .on('change', () => {
          })
          .on('unlink', () => {
          });
      })
  }

  deleteLanguage(changeFolder) {
    this.files.delete(path.basename(changeFolder));
  }
}

// @ts-ignore
export = I18n;
