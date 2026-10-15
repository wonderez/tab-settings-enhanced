# 发布到 Obsidian 社区插件商店 — 操作手册

> 本文件是插件上架 Obsidian 社区的完整操作指南。第一次发布按「第二章」逐步执行；
> 之后的版本更新只需「第四章」四步，无需再次提交 PR。

---

## 一、发布前检查清单

Obsidian 官方仓库 `obsidianmd/obsidian-releases` 的审核是人工 + 机器人双重检查，以下每一项不过都会被驳回：

| # | 检查项 | 要求 | 本仓库状态 |
|---|---|---|---|
| 1 | `manifest.json` 字段完整 | `id` / `name` / `version` / `minAppVersion` / `description` / `author` / `authorUrl` / `isDesktopOnly` | ✅ 已补齐 `authorUrl` |
| 2 | 开源许可证 | 仓库根目录有 `LICENSE`（MIT 最常用） | ✅ MIT |
| 3 | `README.md` | 功能说明、安装方式、使用说明齐全 | ✅ 已重写 |
| 4 | `main.js` 可读 | 不得压缩/混淆（审核人要能读懂代码） | ✅ 纯手写未压缩 |
| 5 | `version` 与 Release tag 一致 | 如 manifest 是 `1.6.11`，tag 必须是 `v1.6.11` | ⚠️ 发 release 时核对 |
| 6 | 用户数据不入库 | `data.json`（含笔记路径/历史）不得进公开仓库 | ✅ 已移出并重写历史 |
| 7 | 无硬编码隐私 | 代码中无个人路径、vault 名、密钥 | ⚠️ 推送前人工最终确认一次 |
| 8 | GitHub 公开仓库 | Public，非 fork | ⬜ 待创建（见下） |

**隐私说明（重要）**：本仓库的 git 历史已经过重写，所有分支与 tag 中均不再包含
`data.json`。本地保留了一份重写前的备份引用（`refs/original/*`），仅存在于本机，
正常的 `git push` 不会推送它们——但**严禁使用 `git push --mirror`**。

---

## 二、第一次发布（共 6 步）

### Step 1 — 在 GitHub 创建公开仓库

1. 打开 https://github.com/new
2. **Repository name**: `tab-settings-enhanced`
3. **Public**（社区插件必须是公开仓库）
4. **不要**勾选 "Add a README file" / ".gitignore" / "license"（本地已有，避免冲突）
5. 创建后，在本地关联远程仓库：

```bash
cd <插件本地目录>（例如 .obsidian/plugins/tab-settings-enhanced）
git remote add origin https://github.com/wonderez/tab-settings-enhanced.git
```

> ⚠️ 仓库归属账号按实际修改：如果你的插件要放在其他 GitHub 账号/组织下，
> 同步修改 `manifest.json` 的 `authorUrl` 和 `README.md` 中的链接。

### Step 2 — 推送代码与标签

```bash
# 推送前最后自查：以下两条命令必须无输出
git log --branches --tags --oneline -- data.json
git grep -l "<你的vault名或个人目录名>" $(git rev-list --all) 2>/dev/null

git push -u origin main
git push origin --tags
```

### Step 3 — 创建 GitHub Release

1. 打开仓库页面 → 右侧 **Releases** → **Create a new release**
2. **Choose a tag**: 选择已有的 `v1.6.11`（不要新建同名 tag）
3. **Release title**: `1.6.11`
4. 说明：写本版本功能摘要（可从 `README.md` 更新日志复制）
5. 点击 **Publish release**

> ⚠️ 必须点 Publish（正式发布）。Draft / Pre-release 不会被 obsidian-releases 的
> 机器人识别，商店不会更新。

### Step 4 — Fork 审核仓库并添加插件条目

1. 浏览器打开 https://github.com/obsidianmd/obsidian-releases ，点击 **Fork**
2. 克隆你自己的 fork（任选 SSH/HTTPS）：

```bash
git clone https://github.com/<你的用户名>/obsidian-releases.git
cd obsidian-releases
```

3. 编辑 `community-plugins.json`，在数组**末尾**追加以下条目（保持 JSON 格式，
   注意上一条末尾的逗号）：

```json
{
  "id": "tab-settings-enhanced",
  "name": "Tab Settings Enhanced",
  "author": "CTA System",
  "description": "Enhanced tab management: control where new tabs open, tab navigator with search/history, and parent-relative positioning.",
  "repo": "wonderez/tab-settings-enhanced"
}
```

4. 提交并推送到你的 fork：

```bash
git checkout -b add-tab-settings-enhanced
git add community-plugins.json
git commit -m "Add plugin: Tab Settings Enhanced"
git push -u origin add-tab-settings-enhanced
```

### Step 5 — 提交 Pull Request

1. 打开 https://github.com/obsidianmd/obsidian-releases ，GitHub 会自动提示
   "Compare & pull request"
2. **PR 标题**（有格式要求）：`Add plugin: Tab Settings Enhanced`
3. **PR 描述**建议包含：
   - 插件一句话简介
   - 核心功能列表（3~5 条）
   - 测试情况（桌面端/移动端是否都测过）
   - 与同类插件（如 Pane Relief、Quick Switcher++）的差异化说明
4. 提交后机器人会自动校验 JSON，通过后等待人工审核

### Step 6 — 等待审核合并

- 通常 **1~7 天**。审核者可能在 PR 里留言要求修改（改 README、补说明等），
  按 feedback 修改后 push 到同一分支，PR 自动更新，无需重开。
- 合并后几分钟到几小时，插件出现在 **设置 → 第三方插件 → 浏览** 的搜索结果中。

---

## 三、审核常见驳回点（提前规避）

| 驳回原因 | 本插件情况 |
|---|---|
| README 只有功能列表，没有安装/使用说明 | 已含商店安装、手动安装、完整使用文档 |
| 没有 LICENSE | MIT 已就位 |
| manifest 缺 `authorUrl` | 已补 |
| release tag 与 manifest version 不一致 | 发版时核对（`v` 前缀 + 完全一致） |
| main.js 压缩混淆 | 纯手写、未压缩 |
| `minAppVersion` 过低，代码用了不存在的 API | 1.4.0，与实际依赖匹配 |
| 插件含网络请求/数据外传 | 本插件纯本地运行、零网络请求 |
| 仓库含用户数据文件 | `data.json` 已移出版本库 |
| 使用了内部/私有 API | 全部使用公开 API |

---

## 四、发布新版本（后续更新，无需再 PR）

obsidian-releases 的机器人会监听仓库的 Release，合并首次 PR 之后：

```bash
# 1. 改代码，语法校验（Node 环境无 obsidian 模块，仅查语法）
node --check main.js

# 2. 升版本号：编辑 manifest.json 的 "version"
# 3. 提交并打 tag（tag 必须与 version 完全一致，带 v 前缀）
git add main.js manifest.json
git commit -m "v1.7.0: <本版摘要>"
git tag v1.7.0
git push origin main --tags
```

4. GitHub 页面 → Releases → Create new release → 选 tag `v1.7.0` → Publish
5. 等待机器人自动抓取（通常几分钟），商店用户即可收到更新

> 版本号建议遵循语义化版本：bug 修复升补丁号（1.6.x），新功能升次版本号（1.x.0）。

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

1. 浏览器打开 https://obsidian.md/plugins?id=tab-settings-enhanced 能显示插件页
2. README 顶部的 downloads 徽章开始计数
3. Obsidian 内 **设置 → 第三方插件 → 浏览** 搜索 `Tab Settings Enhanced` 能搜到
4. 从商店安装一台设备测试：安装 → 启用 → 各项功能正常

---

## 附：正式发布前想小范围测试？

不想直接上商店，可先用 **BRAT**（Beta Reviewer's Auto-update Tool）插件做
beta 分发：安装 BRAT → 添加你的 GitHub 仓库 → 即可像正式插件一样自动更新，
不影响商店审核状态。确认稳定后再走第二章流程。
