preview http://47.105.84.128/design/

计划
右键新增的弹窗出现在鼠标附近而不是屏幕中间
快捷键功能
复制/剪切
提示功能-删除前要提交才能删除
弹窗拖拽移动还有关闭按钮
查找图标,实现icon/input
tools拖拽的排序
tools拖拽拉大拉小
ToolsTabModel改名为sideBar
滚动条样式
关联聚焦
聚焦样式
build:i18n增加监听文件
build:i18n增加target目录

命令行
埋点
  日志
  性能埋点
  交互反馈
  统计
流程管理
多用户交互(socket)
项目管理
  邀请码方式加入项目
  访问路径为 host/{{projectName}}
  项目名保持唯一或个人保持唯一不唯一的情况设置访问别名
数据源管理
版本管理
UI
  图标管理
    内置图标-主题
    命令空间
      导入iconfont
      导入文件
      修改删除
  结构视图
    组件管理(类似ps图层管理)
      与上级合并
      锁定
      禁止拖拽
测试
  测试平台
  单元测试
  端到端测试
  测试代码生成
  api测试
  随机json生成
bug中心
需求中心
url配置
  api
  资源
  图标
  
拖拽
     组合
     拖拽容器
     lookDrop bug 假设拖拽到lookDrop窗口下面的组件,就会变成排序,那就会无视lookDrop插入到lookDrop元素下
     解决ng组件容器 找到容器append的目标元素
     移动端用坐标获取目标
     document.elementFromPoint(myLocation.clientX, myLocation.clientY);
RabbitID
  拥有ID的标签才会被Rabbit所管理
  不被Rabbit管理的标签无法进行拖拽和编辑功能

## 设计平台相关
 - 尽量不停止冒泡功能,导致父节点无法触发事件.采用判断target和$event记录同等事件是否触发过来结束方法
 - 按功能实现service,全部都是全局服务.就算远在异乡的组件也能操作彼此的组件
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
