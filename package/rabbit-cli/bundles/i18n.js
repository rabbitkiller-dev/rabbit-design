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
class I18n extends common_1.Common {
    constructor(mode, option) {
        super(mode, option);
        // 暂存变量
        this.languages = {};
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
            const languageFiles = fs.readdirSync(languageFolder). // 遍历文件获取文件
                filter((filename, index) => {
                return !fs.statSync(path.join(languageFolder, filename)).isDirectory();
            });
            const result = {};
            languageFiles.forEach((languageFile) => {
                const json = JSON.parse(fs.readFileSync(path.join(languageFolder, languageFile)).toString());
                Object.assign(result, json);
            });
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
}
module.exports = I18n;
//# sourceMappingURL=i18n.js.map