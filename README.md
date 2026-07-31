# 💪 璁璁老婆的运动计划

一个专属的运动训练计划 Web 应用，老婆用来看计划和打卡，Lany 用管理页面编辑内容。

🔗 **网站地址**：https://lany-jyc.github.io/workout-planner/

## 👩‍🦰 老婆怎么用

1. 手机浏览器打开上面的网址
2. 查看每天的训练计划，展开动作看详解和视频
3. 完成训练后点「打卡」
4. 看打卡记录追踪进度

> 打卡数据存在自己手机浏览器里，不会丢。

## 👨‍💻 Lany 怎么编辑

1. 双击打开 `admin.html`
2. 在「动作库」添加/编辑/删除动作和视频
3. 在「周计划」设置每天做什么
4. 点「🚀 发布」→ 下载 `exercises.js`
5. 把下载的文件放到 `data/` 文件夹替换原文件
6. 终端运行：
   ```bash
   cd workout-planner
   git add data/exercises.js
   git commit -m "更新训练计划"
   git push
   ```
7. 告诉老婆刷新页面

## 📁 项目结构

```
workout-planner/
├── index.html            # 老婆页面（只读 + 打卡）
├── admin.html            # Lany 管理页面（编辑 + 发布）
├── data/
│   └── exercises.js      # 动作库 + 周计划数据
└── README.md
```

## 💾 数据存储

- 训练计划数据：`data/exercises.js`（Git 版本控制）
- 打卡记录：浏览器 localStorage（老婆个人数据，不上传）
- 管理页面编辑：浏览器 localStorage（Lany 本地，编辑缓冲）
