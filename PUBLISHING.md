# 发布到 Obsidian 社区插件目录 — 操作手册

> 本文件是插件上架 Obsidian 社区目录的完整操作指南。第一次发布按「第二章」逐步执行；
> 之后的版本更新只需「第四章」三步，无需再次提交审核。

---

## ⚠️ 重要：提交流程已变更（2026-10 核实）

旧流程——fork `obsidianmd/obsidian-releases` 并提交 Pull Request——**已经失效**。

核实证据：

- `obsidianmd/obsidian-releases` 已关闭 Pull Request 与 Issue（API `has_issues: false`，
  `/pulls` 接口返回 404，网页对比页无"创建"按钮）
- 官方文档现要求提交到 **community.obsidian.md**，由自动化审核处理

当前流程：**发布 GitHub Release → 在 community.obsidian.md 网页提交 → 自动审核**。
本手册第二章已按此更新，第三章的旧 PR 内容仅作历史参考。

### 五个最常见的提交失败原因

| 审核报错 | 原因 | 解决 |
|---|---|---|
| `No release matches your manifest version` | Release 的 tag 带 `v` 前缀（`v1.6.11`），目录做精确匹配不认 | tag 必须是 `1.6.11`，无 `v` |
| `Release manifest differs from repository manifest` | tag 指向的 commit 里 manifest 与 release 附件的 manifest 不一致 | 把 tag 移到含最终 manifest 的 commit 上，重新发 release |
| `README does not appear to contain English text` | README.md 正文是中文 | 目录要求英文描述，中文版放 `README.cn.md` |
| `Repository not found` / 无法读取 | Connect GitHub 时授权了非仓库所有者账号 | 侧栏 GitHub → Disconnect → 用 `wonderez` 重新 Connect |
| id 冲突 / 名称重复 | `manifest.json` 的 `id` 已被其他插件占用 | 换 id（本项目 `tab-settings-enhanced` 已确认未占用） |

**已实测踩过的坑（2026-10-15）**：

1. tag 带 `v` 前缀 → `No release matches your manifest version`。官方 sample-plugin
   用 `1.0.0`、Dataview 用 `0.5.70`，均无 v。
2. tag 停在老 commit 上 → `Release manifest differs from repository manifest`
   （authorUrl/fundingUrl 是后来才加的，老 commit 里没有）。必须把 tag 移到最终 commit。
   移动方法：`gh release delete 1.6.11 --cleanup-tag --yes` → `git tag -d 1.6.11` →
   在新 commit 上 `git tag 1.6.11 && git push origin 1.6.11` → 重新创建 release 并上传附件。
3. README.md 中文 → `README does not appear to contain English text`。
4. `window.localStorage` 读语言 → `Local Storage` Recommendation。改用官方
   `app.loadLocalStorage('language')` 即可消除（静态扫描，注释里提 localStorage 也会中招）。

> ⚠️ 关于 tag 前缀：部分旧版 Obsidian 文档写"tag 建议带 `v` 前缀"，但当前
> community.obsidian.md 的审核做**精确匹配**，`v1.6.11` 不等于 `1.6.11`。
> 以审核报错为准，无 `v`。

---

## 一、发布前检查清单

以下每一项不过都会被自动审核标记为需要修正：

| # | 检查项 | 要求 | 本仓库状态 |
|---|---|---|---|
| 1 | `manifest.json` 字段完整 | `id` / `name` / `version` / `minAppVersion` / `description` / `author` / `authorUrl` / `isDesktopOnly` | ✅ 含 `authorUrl`、`fundingUrl` |
| 2 | 开源许可证 | 仓库根目录有 `LICENSE` | ✅ MIT |
| 3 | `README.md` | 功能说明、安装方式、使用说明齐全（目录页会展示节选） | ✅ 已重写 |
| 4 | `main.js` 可读 | 不得压缩/混淆（审核要能读懂代码） | ✅ 纯手写未压缩 |
| 5 | `version` 为 `x.y.z` | 只支持语义化三段式 | ✅ `1.6.11` |
| 6 | **Release tag 无 `v` 前缀** | tag 必须**精确等于** version（`1.6.11`，不是 `v1.6.11`） | ✅ `1.6.11` |
| 7 | **Release 附件** | 必须上传 `main.js` + `manifest.json` 为二进制附件 | ✅ 已上传 |
| 8 | GitHub 公开仓库 | Public，非 fork | ✅ 已创建 |

**隐私说明（重要）**：本仓库的 git 历史已经过重写，所有分支与 tag 中均不再包含
`data.json`。本地保留了一份重写前的备份引用（`refs/original/*`），仅存在于本机，
正常的 `git push` 不会推送它们——但**严禁使用 `git push --mirror`**。

---

## 二、第一次发布（共 3 步，代码部分已就绪）

> 以下 Step 1–2 已于 2026-10-15 完成，此处保留作记录与后续版本复用。

### Step 1 — GitHub 公开仓库（✅ 已完成）

仓库地址：https://github.com/wonderez/tab-settings-enhanced

```bash
cd <插件本地目录>（.obsidian/plugins/tab-settings-enhanced）
git remote add origin https://github.com/wonderez/tab-settings-enhanced.git
git push -u origin main
git push origin --tags
```

> ⚠️ 仓库归属账号按实际修改：如果插件放在其他 GitHub 账号/组织下，
> 同步修改 `manifest.json` 的 `authorUrl` 和 `README.md` 中的链接。

### Step 2 — 创建 GitHub Release 并上传附件（✅ 已完成）

Release `1.6.11` 已发布（非 draft），附件已上传 `main.js` + `manifest.json`。

后续版本用命令行一步完成：

```bash
GH="/c/Program Files/GitHub CLI/gh.exe"
git tag 1.7.0 && git push origin 1.7.0
"$GH" release create 1.7.0 --title "1.7.0" --notes-file release-notes.md
"$GH" release upload 1.7.0 main.js manifest.json
```

> ⚠️ 必须 Publish（正式发布），Draft / Pre-release 不会被目录识别。
> ⚠️ **附件不能省**：用户安装时从 Release 下载 `main.js` 和 `manifest.json`。
> ⚠️ **tag 不能带 `v` 前缀**。官方审核报 `No release matches your manifest version`
> 就是这个原因——目录做的是精确匹配，`v1.6.11` ≠ `1.6.11`。官方 sample-plugin 与
> Dataview 等上架插件的 tag 均无 `v` 前缀。**注意**：部分旧文档写的是"v 前缀"，
> 以审核报错为准。

### Step 3 — 在 community.obsidian.md 提交（⬜ 待你操作）

旧的"给 obsidian-releases 提 PR"方式已废弃。现在走官网表单：

1. 打开 **https://community.obsidian.md** ，右上角 **Sign in**
2. 用 Obsidian 账号登录（没有就按提示注册一个）
3. 进入 **Community profile** → 侧栏 **GitHub** → 点 **Connect**，跳转到 GitHub 授权
   （授予目录只读访问权限，用于验证仓库归属）
4. 建议同时开启 **Action required notifications**——审核失败会发邮件提醒
5. 侧栏点 **Plugins** → **New plugin**，填写：

| 表单字段 | 填写内容 |
|---|---|
| GitHub repository URL | `https://github.com/wonderez/tab-settings-enhanced` |
| Owner | 选你自己（Myself） |

6. 阅读并同意 **Developer policies**，确认会持续维护该插件
7. 点 **Submit**

提交后进入**自动审核**：目录会解析仓库默认分支 HEAD 的 `manifest.json` 做校验
（id 唯一性、字段完整性、Release 是否存在等）。你的目录页会显示待修正的错误项，
改完仓库 + 发新 Release 即可，无需重开。

审核通过后插件出现在 **设置 → 第三方插件 → 浏览** 与 https://community.obsidian.md/plugins。

> 目录**读取仓库默认分支的 manifest.json** 来验证，也**从 GitHub Release 下载**
> `main.js` / `manifest.json` / `styles.css` 提供安装——两者都要正确。

---

## 三、审核常见驳回点（提前规避）

| 驳回原因 | 本插件情况 |
|---|---|
| README 只有功能列表，没有安装/使用说明 | 已含商店安装、手动安装、完整使用文档 |
| 没有 LICENSE | MIT 已就位 |
| manifest 缺 `authorUrl` | 已补 |
| version 不是 x.y.z 三段式 | `1.6.11` ✅ |
| release tag 带 `v` 前缀或不匹配 | `1.6.11`，精确等于 manifest version |
| Release 未上传 main.js 附件 | 已上传 |
| manifest 在默认分支 HEAD 不准确 | 已提交推送 |
| main.js 压缩混淆 | 纯手写、未压缩 |
| `minAppVersion` 过低，代码用了不存在的 API | 1.4.0，与实际依赖匹配 |
| 插件含网络请求/数据外传 | 本插件纯本地运行、零网络请求 |
| 仓库含用户数据文件 | `data.json` 已移出版本库 |
| 使用了内部/私有 API | 全部使用公开 API |

---

## 四、发布新版本（后续更新，无需再提交审核）

插件一旦上架，Obsidian 直接从你的 GitHub Release 拉取更新，用户在应用内即可收到。
只需三步：

```bash
# 1. 改代码，语法校验（Node 环境无 obsidian 模块，仅查语法）
node --check main.js

# 2. 升版本号：编辑 manifest.json 的 "version"
# 3. 提交并打 tag（tag 必须与 version 完全一致，且不带 v 前缀）
git add main.js manifest.json
git commit -m "v1.7.0: <本版摘要>"
git tag 1.7.0
git push origin main --tags

# 4. 发 Release 并上传附件
GH="/c/Program Files/GitHub CLI/gh.exe"
"$GH" release create 1.7.0 --title "1.7.0" --notes-file release-notes.md
"$GH" release upload 1.7.0 main.js manifest.json
```

> ⚠️ `versions.json` 需同步新增 `"1.7.0": "1.4.0"` 条目——当用户运行的 Obsidian
> 版本低于新 `minAppVersion` 时，Obsidian 用它回退到兼容的旧版本。
> 版本号遵循语义化：bug 修复升补丁号（1.6.x），新功能升次版本号（1.x.0）。

---

## 五、每次推送前的隐私 / 安全检查

- [ ] `git log --branches --tags --oneline -- data.json` 无输出
- [ ] `git status --short` 中不出现 `data.json`（已被 .gitignore 忽略）
- [ ] `main.js` 中无个人路径、vault 名称、任何密钥
- [ ] 没有使用过 `git push --mirror`
- [ ] tag 与 manifest version 一致

---

## 六、仓库内容说明

**公开推送**（社区商店安装源）：

```
main.js               插件主文件（用户实际下载的文件）
manifest.json         插件清单（商店读取元数据）
README.md             插件说明（商店详情页展示）
LICENSE               MIT 协议
IMPLEMENTATION_PLAN.md 设计文档（可选，展示工程严谨性）
.gitignore
```

**仅保留本地，永不推送**：

```
data.json                 用户配置与历史（含笔记路径）
data.json.pre-release-backup  发布前备份
.workbuddy/               工作区记忆
```

**`refs/original/*`**：git 历史重写前的本地备份，正常 push 不会推送。
确认发布稳定、不再需要回滚后，可彻底清除：

```bash
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now
```

---

## 七、发布成功的验证

1. 浏览器打开 https://community.obsidian.md/plugins 能搜索到 `Tab Settings Enhanced`
2. 插件页显示你的 GitHub 仓库、README 节选、当前版本号
3. Obsidian 内 **设置 → 第三方插件 → 浏览** 搜索 `Tab Settings Enhanced` 能搜到
4. 从目录安装一台设备测试：安装 → 启用 → 各项功能正常
5. README 顶部的 downloads 徽章开始计数

---

## 附：正式发布前想小范围测试？

不想直接上商店，可先用 **BRAT**（Beta Reviewer's Auto-update Tool）插件做
beta 分发：安装 BRAT → 添加你的 GitHub 仓库 → 即可像正式插件一样自动更新，
不影响目录收录。确认稳定后再走第二章 Step 3。
