import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

interface Require {
  (jsPath: Array<string>, call: Function): void;

  config(config: RequireConfig);
}

interface RequireConfig {
  paths?: {
    [index: string]: string
  };
  shim?: {
    [index: string]: {
      deps: any[],
      exports: string
    }
  };
}

@Injectable({providedIn: 'root'})
export class HttpService {
  private _require: Require;
  private waitRequire: Array<{ jsPath: Array<string>, subject: Subject<any>, config?: RequireConfig }> = [];

  require(_jsPath: Array<string>, addRequireConfig?: RequireConfig): Observable<any> {
    const subject = new Subject();

    if (this._require) {
      if (addRequireConfig) {
        this._require.config(addRequireConfig);
      }
      this._require(_jsPath, (_module) => {
        subject.next(_module);
        subject.complete();
      });
    } else {
      this.waitRequire.push({jsPath: _jsPath, config: addRequireConfig, subject: subject});
      this.initRequirejs();
    }
    return subject;
  }

  private initRequirejs() {
    const loaderScript: HTMLScriptElement = document.createElement('script');
    loaderScript.type = 'text/javascript';
    loaderScript.src = 'assets/js/require.js';
    loaderScript.addEventListener('load', () => {
      this._require = window['require'];
      this.waitRequire.map((wait) => {
        this.require(wait.jsPath, wait.config).subscribe((_module) => {
          wait.subject.next(_module);
          wait.subject.complete();
        });
      });
    });
    document.body.appendChild(loaderScript);
  }

}
