# 💪 小可爱的运动计划

一个专为女朋友打造的运动训练计划清单 Web 应用。

## ✨ 功能

- **📋 训练计划** — 按周安排每日训练，自由添加/编辑/删除运动动作
- **🎬 视频嵌入** — 支持 YouTube 和 Bilibili 视频自动嵌入播放
- **📖 动作详解** — 每个动作包含要领、注意事项和呼吸节奏的详细讲解
- **✅ 每日打卡** — 完成训练后一键打卡，追踪连续天数
- **📊 进度统计** — 本周完成率、连续打卡天数、总打卡数、月度进展

## 🚀 使用方式

### 直接打开（最简单）
1. 下载项目文件夹
2. 用任意浏览器打开 `index.html`

### 本地预览服务器
```bash
# Python
python -m http.server 8080

# Node.js (需要先安装 http-server)
npx http-server -p 8080
```

### 部署到 GitHub Pages
1. 在 GitHub 创建新仓库
2. 推送代码到仓库
3. 在仓库 Settings → Pages 中启用 GitHub Pages，选择 `main` 分支

## 📁 项目结构

```
workout-planner/
├── index.html        # 主页面
├── css/
│   └── style.css     # 样式
├── js/
│   └── app.js        # 应用逻辑
└── README.md
```

## 💾 数据存储

所有数据保存在浏览器的 `localStorage` 中，不会丢失。
