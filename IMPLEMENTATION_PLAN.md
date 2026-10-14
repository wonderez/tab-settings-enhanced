# Tab Settings Enhanced — 功能增强实现方案

## 概述

本方案在现有插件基础上新增两大功能模块:

1. **功能一**: 新标签位置选项组增加「快速切换器默认新标签打开」开关
2. **功能二**: 标签导航模态框(Tab Navigator)— 集字母快捷切换、名称搜索、快捷关闭、历史标签恢复于一体

---

## 功能一:快速切换器默认新标签打开

### 1.1 需求分析

**现状**: 当前 `openInNewTab` 开关通过 patch `workspace.openLinkText` 拦截所有文件打开行为(含链接点击、快速切换器)。但用户可能希望独立控制:
- 链接点击 → 在当前标签打开(保持 `openInNewTab = false`)
- 快速切换器(Ctrl+O) → 始终在新标签打开

**目标**: 增加独立开关 `openQuickSwitchInNewTab`,仅影响快速切换器的打开行为,与 `openInNewTab` 解耦。

### 1.2 配置项变更

在 `DEFAULT_SETTINGS` 中新增:

```javascript
openQuickSwitchInNewTab: false,  // 默认关闭,保持向下兼容
```

在 `data.json` 中自动写入该字段。

### 1.3 设置面板变更

在「📂 新标签位置」选项组中,在现有「默认在新标签打开」开关**下方**新增一个开关:

```
[开关] 快速切换器默认新标签打开
说明: 通过 Ctrl+O 快速切换器打开文件时,默认在新标签打开
```

多语言键名:
- `openQuickSwitchInNewTab` / `openQuickSwitchInNewTabDesc`
- 中文: "快速切换器默认新标签打开" / "通过 Ctrl+O 快速切换器打开文件时,默认在新标签打开"
- 英文: "Open Quick Switcher files in new tab" / "Open files from Quick Switcher (Ctrl+O) in new tab by default"

### 1.4 实现逻辑

**核心思路**: 快速切换器打开文件时,会调用 `workspace.openLinkText`。此时快速切换器模态框仍然存在于 DOM 中。通过检测 `.quick-switcher-modal` 是否存在,判断调用来源。

在 `patchOpenLink()` 方法中,修改 `openLinkText` 的 patch 逻辑:

```javascript
this.app.workspace.openLinkText = async function(linktext, sourcePath, newLeaf, openViewState) {
    const resolvedPath = plugin.resolveLinkPath(linktext, sourcePath);
    
    // 防止重复标签(保持不变)
    if (plugin.settings.deduplicateTabs && resolvedPath) { ... }
    
    // 【新增】快速切换器专用拦截
    const isFromQuickSwitcher = plugin.isQuickSwitcherOpen();
    if (isFromQuickSwitcher && plugin.settings.openQuickSwitchInNewTab && !newLeaf) {
        newLeaf = true;
    }
    
    // 通用新标签打开(保持不变)
    if (plugin.settings.openInNewTab && !newLeaf) {
        newLeaf = true;
    }
    
    const result = await originalOpenLinkText(linktext, sourcePath, newLeaf, openViewState);
    return result;
};
```

**新增辅助方法**:

```javascript
isQuickSwitcherOpen() {
    // 检测快速切换器模态框是否存在于 DOM
    return !!document.querySelector('.quick-switcher-modal');
}
```

### 1.5 边界处理

| 场景 | openInNewTab | openQuickSwitchInNewTab | 结果 |
|---|---|---|---|
| 链接点击 | false | false | 当前标签打开 |
| 链接点击 | true | false | 新标签打开 |
| 快速切换器 | false | false | 当前标签打开 |
| 快速切换器 | false | true | 新标签打开 |
| 快速切换器 | true | false | 新标签打开(openInNewTab 生效) |
| 快速切换器 | true | true | 新标签打开 |

**优先级**: 两个开关是 OR 关系,任一为 true 且来源匹配则新标签打开。

### 1.6 涉及文件改动

| 文件 | 改动点 |
|---|---|
| `main.js` | `DEFAULT_SETTINGS` 新增字段 |
| `main.js` | `TRANSLATIONS` 新增 2 条 × 2 语言 |
| `main.js` | `patchOpenLink()` 修改拦截逻辑 |
| `main.js` | 新增 `isQuickSwitcherOpen()` 方法 |
| `main.js` | 设置面板 `display()` 新增开关 |

---

## 功能二:标签导航模态框(Tab Navigator)

### 2.1 需求分析

**目标**: 提供一个模态框,集中展示所有打开的标签 + 最近关闭的历史标签,支持:
1. 字母快捷键切换标签(每个标签分配 a-z 字母)
2. 按名称搜索标签(实时过滤)
3. 快捷关闭标签(在模态框内直接关闭)
4. 展示最近关闭的历史标签
5. 去重已打开的标签(历史列表中已打开的不重复显示或标记)
6. 历史标签也参与搜索(可搜索后重新打开)

### 2.2 数据结构设计

#### 2.2.1 关闭历史记录

在插件主类中新增属性:

```javascript
this.closedTabsHistory = [];  // 最近关闭的标签历史
```

历史记录数据结构:

```typescript
interface ClosedTabRecord {
    path: string;          // 文件路径
    name: string;          // 文件名(不含扩展名)
    basename: string;      // 完整文件名
    extension: string;     // 扩展名
    timestamp: number;     // 关闭时间戳
    leafId: string;        // 原始 leafId(仅用于去重参考)
}
```

**容量限制**: 最多保留 30 条,超出时移除最旧的。

#### 2.2.2 修改 `patchLeafDetach` — 记录关闭历史

```javascript
patchLeafDetach() {
    const plugin = this;
    const originalDetach = obsidian.WorkspaceLeaf.prototype.detach;
    
    obsidian.WorkspaceLeaf.prototype.detach = function() {
        const closingLeaf = this;
        const wasActive = plugin.app.workspace.activeLeaf === closingLeaf;
        
        // 【新增】记录关闭历史
        plugin.recordClosedTab(closingLeaf);
        
        if (wasActive) {
            const nextLeaf = plugin.findNextLeaf(closingLeaf);
            originalDetach.call(this);
            if (nextLeaf) {
                plugin.app.workspace.setActiveLeaf(nextLeaf, { focus: true });
            }
        } else {
            originalDetach.call(this);
        }
    };
    
    this.register(() => {
        obsidian.WorkspaceLeaf.prototype.detach = originalDetach;
    });
}
```

#### 2.2.3 新增 `recordClosedTab` 方法

```javascript
recordClosedTab(leaf) {
    try {
        const viewState = leaf.getViewState();
        if (!viewState || !viewState.state || !viewState.state.file) return;
        
        const file = this.app.vault.getAbstractFileByPath(viewState.state.file);
        if (!file) return;
        
        const record = {
            path: file.path,
            name: file.basename || file.name,
            basename: file.name,
            extension: file.extension || '',
            timestamp: Date.now(),
            leafId: leaf.id
        };
        
        // 去重:同路径只保留最新一条
        this.closedTabsHistory = this.closedTabsHistory.filter(r => r.path !== record.path);
        this.closedTabsHistory.unshift(record);
        
        // 容量限制
        if (this.closedTabsHistory.length > 30) {
            this.closedTabsHistory = this.closedTabsHistory.slice(0, 30);
        }
    } catch (e) {
        console.error("Tab Settings Enhanced: 记录关闭历史失败", e);
    }
}
```

### 2.3 模态框类设计

新增 `TabNavigatorModal` 类,继承 `obsidian.Modal`:

```javascript
class TabNavigatorModal extends obsidian.Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.query = '';           // 当前搜索词
        this.selectedIndex = 0;    // 当前选中项索引
        this.allItems = [];        // 所有展示项(打开 + 历史)
        this.filteredItems = [];   // 过滤后项
    }
    
    onOpen() { ... }
    onClose() { ... }
    
    // 构建列表数据
    buildItems() { ... }
    
    // 渲染列表
    render() { ... }
    
    // 分配字母快捷键
    assignLetters() { ... }
    
    // 搜索过滤
    filter(query) { ... }
    
    // 激活标签
    activateTab(item) { ... }
    
    // 关闭标签
    closeTab(item) { ... }
    
    // 重新打开历史标签
    reopenTab(item) { ... }
    
    // 键盘事件处理
    onKeydown(evt) { ... }
}
```

### 2.4 模态框 UI 布局

```
┌─────────────────────────────────────────────┐
│  🔍 搜索标签...                              │  ← 输入框(自动聚焦)
├─────────────────────────────────────────────┤
│  📂 打开的标签                               │  ← 分组标题
├─────────────────────────────────────────────┤
│  [a]  📄 笔记标题1               [×]        │  ← 字母键 + 图标 + 标题 + 关闭按钮
│  [s]  📄 笔记标题2               [×]        │
│  [d]  📄 笔记标题3               [×]        │
│  ...                                        │
├─────────────────────────────────────────────┤
│  🕒 最近关闭                                 │  ← 分组标题
├─────────────────────────────────────────────┤
│  [k]  📄 已关闭的笔记1            ↩]        │  ← 字母键 + 图标 + 标题 + 恢复按钮
│  [l]  📄 已关闭的笔记2            ↩]        │
│  ...                                        │
└─────────────────────────────────────────────┘
   提示: 字母键切换 | Ctrl+字母 关闭 | ESC 退出    ← 底部提示栏
```

### 2.5 字母快捷键分配算法

**规则**:
1. 打开的标签优先分配,从 `a` 开始按顺序分配
2. 历史标签继续分配剩余字母
3. 超过 26 个标签后,不分配字母(只能通过搜索+方向键选择)
4. 搜索过滤后,重新分配字母(仅对过滤结果)

```javascript
assignLetters() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    this.filteredItems.forEach((item, index) => {
        item.letter = index < 26 ? letters[index] : null;
    });
}
```

### 2.6 搜索逻辑

**搜索范围**: 打开的标签 + 历史标签(去重后)

**去重规则**: 如果历史标签的 path 已在打开的标签中存在,则:
- 不在历史区域显示该项
- 但该项仍出现在「打开的标签」区域(正常)

**匹配方式**: 不区分大小写的子串匹配,匹配字段:
- `name` (文件名)
- `path` (完整路径)
- `parentFolder` (父文件夹名)

```javascript
buildItems() {
    const openItems = [];
    const openPaths = new Set();
    
    // 收集打开的标签
    this.app.workspace.iterateAllLeaves(leaf => {
        const viewState = leaf.getViewState();
        if (viewState && viewState.state && viewState.state.file) {
            const file = this.app.vault.getAbstractFileByPath(viewState.state.file);
            if (file) {
                openItems.push({
                    type: 'open',
                    leaf: leaf,
                    path: file.path,
                    name: file.basename || file.name,
                    basename: file.name,
                    extension: file.extension || '',
                    parentFolder: file.parent ? file.parent.name : ''
                });
                openPaths.add(file.path);
            }
        }
    });
    
    // 收集历史标签(去重:已打开的不重复显示)
    const historyItems = [];
    for (const record of this.plugin.closedTabsHistory) {
        if (openPaths.has(record.path)) continue;  // 已打开,跳过
        historyItems.push({
            type: 'history',
            leaf: null,
            path: record.path,
            name: record.name,
            basename: record.basename,
            extension: record.extension,
            parentFolder: this.extractParentFolder(record.path)
        });
    }
    
    this.allItems = [...openItems, ...historyItems];
}

filter(query) {
    if (!query) {
        this.filteredItems = [...this.allItems];
    } else {
        const q = query.toLowerCase();
        this.filteredItems = this.allItems.filter(item => 
            item.name.toLowerCase().includes(q) ||
            item.path.toLowerCase().includes(q) ||
            item.parentFolder.toLowerCase().includes(q)
        );
    }
    this.assignLetters();
    this.selectedIndex = 0;
}
```

### 2.7 键盘交互

| 按键 | 行为 |
|---|---|
| `a-z` (单字母) | 直接激活对应标签(打开的)或重新打开(历史的) |
| `Ctrl+a` ~ `Ctrl+z` | 关闭对应标签(仅对打开的标签有效) |
| `↑` / `↓` | 上下移动选中项 |
| `Enter` | 激活/重新打开当前选中项 |
| `Delete` / `Backspace`(在列表项上) | 关闭当前选中标签(打开的)或删除历史记录 |
| `Esc` | 关闭模态框 |
| 任意可输入字符 | 输入到搜索框,实时过滤 |

**字母键处理优先级**:
1. 如果搜索框有文本 → 字母键输入到搜索框(正常输入)
2. 如果搜索框为空 → 字母键直接触发标签切换

```javascript
onKeydown(evt) {
    const key = evt.key.toLowerCase();
    
    // ESC: 关闭模态框
    if (key === 'escape') {
        this.close();
        return;
    }
    
    // 方向键
    if (key === 'arrowup') {
        evt.preventDefault();
        this.moveSelection(-1);
        return;
    }
    if (key === 'arrowdown') {
        evt.preventDefault();
        this.moveSelection(1);
        return;
    }
    
    // Enter: 激活选中项
    if (key === 'enter') {
        evt.preventDefault();
        if (this.filteredItems[this.selectedIndex]) {
            this.activateItem(this.filteredItems[this.selectedIndex]);
        }
        return;
    }
    
    // Ctrl + 字母: 关闭标签
    if ((evt.ctrlKey || evt.metaKey) && /^[a-z]$/.test(key)) {
        evt.preventDefault();
        const item = this.filteredItems.find(i => i.letter === key);
        if (item && item.type === 'open') {
            this.closeTab(item);
        }
        return;
    }
    
    // 纯字母: 如果搜索框为空,直接切换;否则输入到搜索框
    if (!evt.ctrlKey && !evt.metaKey && !evt.altKey && /^[a-z]$/.test(key)) {
        if (this.query === '') {
            evt.preventDefault();
            const item = this.filteredItems.find(i => i.letter === key);
            if (item) {
                this.activateItem(item);
            }
        }
        // else: 让默认行为发生(输入到搜索框)
    }
}
```

### 2.8 激活/关闭/恢复逻辑

```javascript
activateItem(item) {
    if (item.type === 'open') {
        // 激活已打开的标签
        this.app.workspace.setActiveLeaf(item.leaf, { focus: true });
    } else if (item.type === 'history') {
        // 重新打开历史标签
        this.app.workspace.openLinkText(item.path, '', true);
    }
    this.close();
}

closeTab(item) {
    if (item.type !== 'open' || !item.leaf) return;
    // 记录历史(recordClosedTab 会在 detach patch 中自动调用)
    item.leaf.detach();
    // 刷新列表
    this.buildItems();
    this.filter(this.query);
    this.render();
}

reopenTab(item) {
    if (item.type !== 'history') return;
    this.app.workspace.openLinkText(item.path, '', true);
    // 从历史中移除
    this.plugin.closedTabsHistory = this.plugin.closedTabsHistory.filter(r => r.path !== item.path);
    this.close();
}
```

### 2.9 命令注册

在 `onload()` 中注册命令,可由用户自定义快捷键:

```javascript
this.addCommand({
    id: 'open-tab-navigator',
    name: '打开标签导航器',
    name_en: 'Open Tab Navigator',
    callback: () => {
        new TabNavigatorModal(this.app, this).open();
    }
});
```

**建议默认快捷键**: `Ctrl + T`(浏览器式新标签联想)或 `Alt + T`。但由于 Obsidian 可能已占用,不设置默认快捷键,由用户在设置中自定义。

### 2.10 样式设计

模态框宽度: 600px(比标准 Obsidian 模态框稍宽,便于显示完整路径)

```css
.tab-navigator-modal {
    width: 600px;
    max-height: 70vh;
}

.tab-navigator-search {
    padding: 12px 16px;
    border-bottom: 1px solid var(--background-modifier-border);
}

.tab-navigator-list {
    max-height: 50vh;
    overflow-y: auto;
    padding: 8px 0;
}

.tab-navigator-group-title {
    padding: 8px 16px 4px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.tab-navigator-item {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    cursor: pointer;
    gap: 12px;
}

.tab-navigator-item:hover,
.tab-navigator-item.selected {
    background: var(--background-modifier-hover);
}

.tab-navigator-letter {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    background: var(--background-modifier-border);
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    flex-shrink: 0;
}

.tab-navigator-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tab-navigator-path {
    font-size: 11px;
    color: var(--text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
}

.tab-navigator-action {
    opacity: 0;
    transition: opacity 0.15s;
}

.tab-navigator-item:hover .tab-navigator-action {
    opacity: 1;
}

.tab-navigator-hint {
    padding: 8px 16px;
    border-top: 1px solid var(--background-modifier-border);
    font-size: 11px;
    color: var(--text-muted);
    text-align: center;
}
```

### 2.11 多语言支持

新增翻译键:

```javascript
// 中文
tabNavigator: "标签导航器",
tabNavigatorSearch: "搜索标签或历史...",
tabNavigatorOpenTabs: "打开的标签",
tabNavigatorRecentClosed: "最近关闭",
tabNavigatorHint: "字母键切换 | Ctrl+字母 关闭 | ↑↓ 选择 | Enter 确认 | ESC 退出",
tabNavigatorEmpty: "没有匹配的标签",

// 英文
tabNavigator: "Tab Navigator",
tabNavigatorSearch: "Search tabs or history...",
tabNavigatorOpenTabs: "Open Tabs",
tabNavigatorRecentClosed: "Recently Closed",
tabNavigatorHint: "Letter: switch | Ctrl+Letter: close | ↑↓: select | Enter: confirm | ESC: exit",
tabNavigatorEmpty: "No matching tabs",
```

---

## 实现步骤

### 阶段一:功能一(快速切换器开关)

| 步骤 | 改动内容 | 预计行数 |
|---|---|---|
| 1 | `DEFAULT_SETTINGS` 新增 `openQuickSwitchInNewTab` | 1 行 |
| 2 | `TRANSLATIONS` 新增中英文键值 | 8 行 |
| 3 | 新增 `isQuickSwitcherOpen()` 方法 | 5 行 |
| 4 | 修改 `patchOpenLink()` 拦截逻辑 | 8 行 |
| 5 | 设置面板新增开关 UI | 12 行 |

### 阶段二:功能二(标签导航模态框)

| 步骤 | 改动内容 | 预计行数 |
|---|---|---|
| 1 | 插件主类新增 `closedTabsHistory` 属性 | 1 行 |
| 2 | 新增 `recordClosedTab()` 方法 | 20 行 |
| 3 | 修改 `patchLeafDetach()` 调用记录 | 2 行 |
| 4 | 新增 `TabNavigatorModal` 类 | ~250 行 |
| 5 | `onload()` 注册命令 | 8 行 |
| 6 | 新增样式 CSS | ~80 行 |
| 7 | `TRANSLATIONS` 新增模态框相关键值 | 14 行 |

### 阶段三:测试与验证

| 测试项 | 验证点 |
|---|---|
| 快速切换器开关 | 开启后 Ctrl+O 打开文件在新标签;关闭后在当前标签 |
| 链接点击不受影响 | `openQuickSwitchInNewTab` 不影响链接点击行为 |
| 模态框呼出 | 命令面板可找到命令,快捷键可触发 |
| 字母切换 | 搜索框为空时按字母直接切换 |
| 搜索过滤 | 输入关键词实时过滤,含历史标签 |
| Ctrl+字母关闭 | 正确关闭对应标签 |
| 历史记录 | 关闭标签后出现在历史列表 |
| 历史去重 | 已打开的标签不在历史区域重复显示 |
| 历史恢复 | 点击历史项可重新打开 |
| 父子关系保持 | 新标签打开后父子颜色标记正常 |

---

## 风险与注意事项

| 风险 | 影响 | 缓解措施 |
|---|---|---|
| `isQuickSwitcherOpen()` DOM 检测时序 | 快速切换器可能在 `openLinkText` 调用前已关闭 | 实测 Obsidian 行为:模态框在文件打开后才关闭,时序安全 |
| `closedTabsHistory` 内存占用 | 长时间使用积累 | 限制 30 条,且仅存储路径信息(不存内容) |
| 模态框与其他插件冲突 | 如 Quick Switcher++ 等 | 模态框是独立的,不修改原生快速切换器 |
| `detach()` patch 叠加 | 已有 patch,新增逻辑需兼容 | 只在现有 patch 内新增一行调用,不改变原有逻辑 |
| 字母键与 Obsidian 快捷键冲突 | 某些字母可能被占用 | 模态框打开时拦截 keydown,关闭后恢复 |

---

## 文件改动总览

**仅修改 `main.js` 一个文件**,预计新增约 400 行代码,分布在:

```
main.js
├── DEFAULT_SETTINGS           (+1 行)
├── TRANSLATIONS               (+22 行)
├── TabSettingsEnhancedPlugin
│   ├── onload()               (+8 行,注册命令)
│   ├── patchOpenLink()        (+8 行,快速切换器拦截)
│   ├── patchLeafDetach()      (+2 行,记录历史)
│   ├── isQuickSwitcherOpen()  (+5 行,新增方法)
│   ├── recordClosedTab()      (+20 行,新增方法)
│   └── 设置面板 display()     (+12 行,新增开关)
├── TabNavigatorModal          (~250 行,新增类)
└── registerStyles()           (+80 行,新增样式)
```

无新增文件,无新增依赖,完全向下兼容。
