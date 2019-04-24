"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class Common {
    constructor(mode, option) {
        if (fs.existsSync(path.join(process.cwd(), 'rabbit.json'))) {
            this.config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'rabbit.json')).toString());
        }
        else {
            console.log('没有配置文件(rabbit.json');
        }
    }
    root(...str) {
        return path.join(process.cwd(), ...str);
    }
}
exports.Common = Common;
//# sourceMappingURL=common.js.map