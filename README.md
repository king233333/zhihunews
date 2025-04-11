# zhihunews
一个漂亮简洁的 Scriptable 小组件，用于展示知乎热榜前 8 条内容，适配深色模式并带有蓝色渐变背景。
# Zhihu Hotlist Widget for Scriptable

✨ 一个漂亮简洁的 Scriptable 小组件，用于展示知乎热榜前 8 条内容，适配深色模式并带有蓝色渐变背景。

![screenshot](screenshot.png)

## 📦 特性

- 使用知乎官方 API 实时获取热榜数据
- 显示前 8 条热榜标题
- 支持内容自动换行，视觉居中
- 使用蓝色渐变背景，适配美观的桌面样式
- 错误提示简洁明了

## 🛠 使用方法

1. 安装 [Scriptable](https://apps.apple.com/app/scriptable/id1405459188)
2. 在 iOS 主屏幕长按添加小组件，选择 Scriptable 中的“中”组件大小
3. 打开 Scriptable，新建脚本，将 `zhihu_hot_widget.js` 粘贴进去
4. 保存后在小组件设置中绑定该脚本即可

## 🧩 示例效果

![IMG_7396(20250411-160554)](https://github.com/user-attachments/assets/5b92c58d-1c3d-4b5d-bd62-173dadd4b544)

## 📄 数据来源

本项目使用知乎公开的热榜 API 接口，仅用于学习与展示，若有侵权请联系删除。

接口地址：
https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50
