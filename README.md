# EP.UNI.XHR
[![Version](https://img.shields.io/npm/v/ep.uni.xhr)](https://www.npmjs.com/package/ep.uni.xhr)
[![Downloads](https://img.shields.io/npm/dm/ep.uni.xhr)](https://www.npmjs.com/package/ep.uni.xhr)  
Package UNI.XHR implements XMLHttpRequest for Puerts in Unity, Unreal, etc.  
UNI.XHR 包实现了在 Unity、Unreal 等环境中用于 Puerts 的 XMLHttpRequest。

| Runtime/Platform | Windows | Linux | OSX | Android | iOS | Browser |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Node | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Code | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Cocos | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Unity | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ |
| Unreal | ❓ | ❓ | ❓ | ❓ | ❓ | ➖ |
| Electron | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Dom | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
- ✅: Supported&Tested   ➖: Ignored
- ❓: Developing/Testing ❌: Planing

## FAQ | 常见问题
- Note1/注1: TS导入时静态检查报错：Cannot find module 'ep.uni.xhr/unity'？
  - 将 tsconfig.json 的 moduleResolution 修改为 bundler 或 node16。

## Changelog | 版本记录
### 0.0.1
- Initial commit; 首次提交。

## Refer | 参考
- Puerts WebAPI: https://github.com/Geequlim/WebAPI

## Developer | 开发者
### Developing | 开发流程
- 当前工程: npm run release && npm link (链接至全局)
- 目标工程: 
  - npm link ep.uni.xhr（链接本地包）
  - packege.json -> dependencies: "ep.uni.xhr": "$version",（添加包引用）
  - import { TestUnityXHR/TestUnrealXHR } from "ep.uni.xhr/test"（导入并执行）

### Publishing | 发布流程
- Trigger [workflow](https://github.com/eframework-org/EP.UNI.XHR/actions/workflows/publish.yml) to publish.
- 触发 [工作流](https://github.com/eframework-org/EP.UNI.XHR/actions/workflows/publish.yml) 以发布。
