/**
 * Created by 黎祥发 on 2016/12/10/010.
 * 函数节流。
 * 例子1，不会强制执行：
 * let throttle = new Throttle(100);
 * throttle.execute(function(){
 *    console.log("nice");
 * })
 * 例子2，时间一到会强制执行：
 * let throttle = new Throttle(100);
 * throttle.execute(function(){
 *    console.log("nice");
 * })
 */
export class Throttle {
  index: any;  // setTimeout的序号
  private _last: number;
  time: number;  // 多久执行一次
  force: boolean; // 是不是时间到了，就强行执行一次
  constructor(time: number = 300, force?: boolean) {
    this._last = +new Date();
    this.time = time;
    this.force = force;
  }

  execute(handler: Function) {
    let current;
    // 强制执行 而且时间到了，强制执行一下
    if (this.force && (current = +new Date()) - this._last > this.time) {
      this._last = current;
      handler();
      this._last = current;
    }
    // 不管怎么样都会延迟的
    this._doExecute(handler);
  }

  private _doExecute(handler) {
    clearTimeout(this.index);
    this.index = setTimeout(handler, this.time);
  }

  destroy() {
    clearTimeout(this.index);
  }
}
