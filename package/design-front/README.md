preview http://47.105.84.128/design/

计划
page.interface.ts
右键新增的弹窗出现在鼠标附近而不是屏幕中间
快捷键功能
复制功能


## 设计平台相关
 - 尽量不停止冒泡功能,导致父节点无法触发事件.采用判断target和$event记录事件确认是否无视该事件,
 - tools-interface 在此处实现工具栏
 - 平台相关事件先在runtime-event.service.ts 事件枚举对象RUNTIME_EVENT_ENUM定义枚举
 - 平台相关变量先在runtime-data.service.ts  定义model对象并初始化
 - 以上两点为规范事件和全局变量,做为顶级服务供全平台组件使用
 - TODO: ctrl时就不会放到容器里
 - TODO: 树节点拖拉拽,移动目录功能
 - TODO: 本地node服务,开启后能够知道服务器发生什么事做对应的反应
    - push/commit/update功能
## 编译相关

# DesignFront

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).



- 注册
  - drag-drop-service
- 移动
  - drag-item
    - 任意移动(绝对定位)
    - _previewTemplate
    - _placeholderTemplate
    - move-start
    - move-ing
- 放
  - drop-list
    - drop
    - drop-in
    - drop-out
  - drop-item
    - 合并

文件名不带前缀
selector带前缀
