# 通讯录管理系统 - 前端项目

## 项目概述

这是一个基于Vue.js开发的通讯录管理系统前端项目，采用前后端分离架构，提供直观友好的用户界面，支持联系人的增删改查操作以及Excel导入导出功能。

## 功能特性

- **联系人列表展示**：美观的表格展示联系人信息
- **添加联系人**：通过表单添加新联系人，支持数据验证
- **编辑联系人**：修改现有联系人信息
- **删除联系人**：删除不需要的联系人，支持确认提示
- **搜索功能**：实时搜索联系人信息，支持多字段搜索
- **导入导出**：支持Excel格式的联系人数据导入导出
- **响应式设计**：适配不同屏幕尺寸的设备
- **友好的用户体验**：加载状态、成功/失败提示等交互反馈

## 技术栈

- **框架**：Vue.js 2.6.14
- **路由**：Vue Router 3.5.1
- **UI组件库**：Element UI 2.15.14
- **HTTP客户端**：Axios 1.4.0
- **构建工具**：Vue CLI 4.x

## 项目结构

```
student_id_contacts_frontend/
├── public/                 # 静态资源文件
├── src/                    # 源代码
│   ├── assets/             # 图片、样式等资源
│   ├── components/         # 自定义组件
│   ├── views/              # 页面视图组件
│   │   └── ContactList.vue # 联系人列表页面
│   ├── services/           # API服务
│   │   └── contactService.js # 联系人相关API调用
│   ├── router/             # 路由配置
│   │   └── index.js        # 路由定义
│   ├── App.vue             # 根组件
│   └── main.js             # 入口文件
├── package.json            # 项目配置和依赖
├── babel.config.js         # Babel配置
├── vue.config.js           # Vue CLI配置
└── README.md               # 项目说明文档
```

## 项目设置
```
npm install
```

### 开发环境运行
```
npm run serve
```

### 生产环境构建
```
npm run build
```

## 配置说明

### API配置

前端API请求默认配置在 `src/services/contactService.js` 文件中：

```javascript
const API_URL = '/api/contacts'

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})
```

### 跨域配置

如果后端服务运行在不同的域名或端口上，需要配置跨域代理。在 `vue.config.js` 中添加以下配置：

```javascript
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // 后端服务地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
```

## 主要功能说明

### 联系人管理

- **联系人列表**：展示所有联系人，支持排序
- **添加联系人**：点击"添加联系人"按钮，填写表单并提交
- **编辑联系人**：点击表格中的"编辑"按钮，修改信息并保存
- **删除联系人**：点击表格中的"删除"按钮，确认后删除联系人
- **搜索联系人**：在搜索框输入关键字，自动搜索匹配的联系人

### 导入导出功能

- **导入联系人**：点击"导入联系人"按钮，选择符合格式要求的Excel文件
- **导出联系人**：点击"导出联系人"按钮，下载当前联系人数据为Excel文件

## 导入文件格式要求

导入的Excel文件需要满足以下要求：
1. 仅支持 .xlsx 格式的Excel文件
2. 文件第一行为标题行，格式为：姓名,手机号,邮箱,公司,地址
3. 姓名和手机号为必填项
4. 手机号必须为11位有效的中国大陆手机号
5. 邮箱格式必须正确

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)
- IE 11 (部分功能可能受限)

## 自定义配置

See [Configuration Reference](https://cli.vuejs.org/config/).
