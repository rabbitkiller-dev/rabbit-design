"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
const common_1 = require("./common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const shell = require('shelljs');
const chokidar = __importStar(require("chokidar"));
let watcher;
class I18n extends common_1.Common {
    constructor(mode, option) {
        super(mode, option);
        this.mode = mode;
        this.option = option;
        // 暂存变量
        // 语言Json
        this.languages = {};
        // 文件缓存
        this.files = new Map();
    }
    // 开始
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const sources = this.getSources();
            for (const source of sources) {
                const languageFolderNames = fs.readdirSync(source). // 遍历文件获取文件夹名
                    filter((filename, index) => {
                    return fs.statSync(path.join(source, filename)).isDirectory();
                });
                for (const languageFolderName of languageFolderNames) {
                    const json = yield this.getLanguageJson(path.join(source, languageFolderName));
                    if (!this.languages[languageFolderName]) {
                        this.languages[languageFolderName] = {};
                    }
                    Object.assign(this.languages[languageFolderName], json);
                    // fs.writeFileSync(path.join(src, languageFolderName) + '.json', JSON.stringify(json, null, 2));
                }
            }
            yield this.saveLanguages();
            if (this.option.watch) {
                this.watchLanguage(sources);
            }
        });
    }
    // 获取源目录
    getSources() {
        if (!this.config.i18n) {
            throw new Error('请配置i18n,例: {"i18n":{"source" : "./src/assets/i18n", "target":"./src/assets/i18n"}');
        }
        if (Array.isArray(this.config.i18n.source)) {
            return Array.from(new Set(this.config.i18n.source).values());
        }
        else {
            return [this.config.i18n.source];
        }
    }
    // 遍历某个语言目录的所有json文件, 合并然后返回
    getLanguageJson(languageFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            const languageFiles = fs.readdirSync(languageFolder); // 遍历文件获取文件
            const result = {};
            for (const languageFile of languageFiles) {
                if (path.extname(languageFile) !== '.json') {
                    continue;
                }
                const filePath = path.join(languageFolder, languageFile);
                if (fs.statSync(filePath).isDirectory()) {
                    const json = yield this.getLanguageJson(filePath);
                    Object.assign(result, json);
                }
                else {
                    const json = JSON.parse(fs.readFileSync(filePath).toString());
                    Object.assign(result, json);
                }
            }
            return result;
        });
    }
    // 保存this.languages到文件
    saveLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config.i18n.target) {
                throw new Error('请配置18n输入目录,例: {"i18n":{"target":"./src/assets/i18n"}');
            }
            for (const language of Object.keys(this.languages)) {
                shell.mkdir('-p', path.join(this.config.i18n.target));
                fs.writeFileSync(path.join(this.config.i18n.target, language) + '.json', JSON.stringify(this.languages[language], null, 2));
            }
        });
    }
    /**
     * watch
     */
    watchLanguage(sources) {
        // watcher = this.watcher = chokidar.watch(sources, {ignored: /(^((?!\.json$).)*$)|(\..*___jb_tmp___)/g});
        watcher = this.watcher = chokidar.watch(sources, { depth: 1 });
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
        });
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
        });
    }
    deleteLanguage(changeFolder) {
        this.files.delete(path.basename(changeFolder));
    }
}
module.exports = I18n;
//# sourceMappingURL=i18n.js.map