# EP.UNI.XHR

[![Version](https://img.shields.io/npm/v/ep.uni.xhr)](https://www.npmjs.com/package/ep.uni.xhr)
[![Downloads](https://img.shields.io/npm/dm/ep.uni.xhr)](https://www.npmjs.com/package/ep.uni.xhr)  

UNI.XHR 是一个跨平台的 XMLHttpRequest 实现库，专注于为 Puerts 提供统一的 HTTP 请求接口，支持在 Unity、Unreal 等多种环境下运行。

## 功能特性

- 🚀 **跨平台**：统一的 XMLHttpRequest API 在不同环境下保持一致的行为
- 📦 **标准兼容**：完整实现 XMLHttpRequest Level 2 标准
- 🔧 **类型安全**：完整的 TypeScript 类型定义
- 🧪 **测试覆盖**：完整的单元测试和集成测试

### 核心功能

- **Unity XMLHttpRequest**：基于 UnityWebRequest 实现的完整 XMLHttpRequest 接口
- **Unreal XMLHttpRequest**：基于 Unreal HTTP 模块实现的 XMLHttpRequest 接口 

### 平台支持

| Runtime/Platform | Windows | Linux | OSX | Android | iOS | Browser |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Node | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Code | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Cocos | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Unity | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ |
| Unreal | ❓ | ❓ | ❓ | ❓ | ❓ | ➖ |
| Electron | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Dom | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
- ✅已支持  ❓开发中  ❌未支持  ➖不适用

## 操作手册

### 1. 安装类库
```bash
npm install ep.uni.xhr
```

### 2. 使用示例
```typescript
// Unity 环境
import { XMLHttpRequest } from "ep.uni.xhr/unity"

const xhr = new XMLHttpRequest()
xhr.open("GET", "https://api.example.com/data")
xhr.onload = () => {
    console.log(xhr.response)
}
xhr.send()
```

## 常见问题

如有问题，请提交 [问题反馈](CONTRIBUTING.md#问题反馈)。

### 1. TS导入报错？
问题：Cannot find module 'ep.uni.xhr/unity'
解决：将 tsconfig.json 的 moduleResolution 修改为 bundler 或 node16

## 项目信息

- [更新记录](CHANGELOG.md)
- [贡献指南](CONTRIBUTING.md)
- [许可证](LICENSE)
