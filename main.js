/*
 * Tab Settings Enhanced
 * 增强版标签管理插件
 * 
 * 功能:
 * 1. 新标签打开位置控制 (父标签右侧/左侧/第一个/最后一个/固定标签后)
 * 2. 关闭标签后激活策略 (父标签/左侧/右侧/最近使用/第一个/最后一个)
 * 3. 防止重复标签
 * 4. 父标签追踪
 * 5. 标签颜色标记 (父子标签同色系)
 */

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
    for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
                __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// 导出模块
var main_exports = {};
__export(main_exports, {
    default: () => TabSettingsEnhancedPlugin
});
module.exports = __toCommonJS(main_exports);

var obsidian = require("obsidian");

// ═══════════════════════════════════════════════════════════════════════════════
// 配色方案
// ═══════════════════════════════════════════════════════════════════════════════

const COLOR_PALETTES = {
    "morandi": {
        name: "莫兰迪 | Morandi",
        // 重新排列：红-绿-蓝-橙-青-粉 交替，增加区分度
        colors: [
            "#d4a5a5", // 玫瑰粉
            "#7cb08c", // 薄荷绿
            "#6a9ab0", // 雾霾蓝
            "#e8c87a", // 暖金黄
            "#8fc1a9", // 翠玉绿
            "#7899b0", // 钴蓝灰
            "#c9a66b", // 焦糖橙
            "#9a7b6b"  // 可可棕
        ]
    },
    "vivid": {
        name: "鲜明 | Vivid",
        // 高饱和度，色相间隔大
        colors: [
            "#FF6B6B", // 珊瑚红
            "#4ECDC4", // 青碧
            "#FFE66D", // 明黄
            "#95E1D3", // 薄荷
            "#F38181", // 玫红
            "#7B68EE", // 紫罗兰
            "#98D8C8", // 翠绿
            "#F7DC6F"  // 金黄
        ]
    },
    "rainbow": {
        name: "彩虹 | Rainbow",
        // 彩虹色，色相均匀分布
        colors: [
            "#FF6B6B", // 红
            "#FFA500", // 橙
            "#FFD93D", // 黄
            "#6BCB77", // 绿
            "#4D96FF", // 蓝
            "#9B59B6", // 紫
            "#FF85A1", // 粉
            "#00CED1"  // 青
        ]
    },
    "ocean": {
        name: "海洋 | Ocean",
        // 冷暖交替
        colors: [
            "#e76f51", // 珊瑚
            "#2a9d8f", // 青绿
            "#e9c46a", // 金黄
            "#264653", // 深蓝
            "#f4a261", // 橙黄
            "#006d77", // 深青
            "#ffddd2", // 浅粉
            "#83c5be"  // 薄荷
        ]
    },
    "candy": {
        name: "糖果 | Candy",
        // 甜美马卡龙色
        colors: [
            "#FF9AA2", // 粉红
            "#B5EAD7", // 薄荷
            "#FFDAC1", // 蜜桃
            "#C7CEEA", // 薰衣草
            "#FFB7B2", // 珊瑚
            "#A2D2FF", // 天蓝
            "#FFF1AC", // 柠檬
            "#E2CDF6"  // 淡紫
        ]
    },
    "neon": {
        name: "霓虹 | Neon",
        // 霓虹灯效果，高亮度
        colors: [
            "#FF1744", // 霓虹红
            "#00E676", // 霓虹绿
            "#FF9100", // 霓虹橙
            "#00B0FF", // 霓虹蓝
            "#FF4081", // 霓虹粉
            "#FFEA00", // 霓虹黄
            "#00E5FF", // 霓虹青
            "#D500F9"  // 霓虹紫
        ]
    },
    "random": {
        name: "随机 | Random",
        colors: null  // 动态生成，每次色相差 60 度以上
    }
};

const COLOR_PALETTE_OPTIONS = {};
for (const [key, value] of Object.entries(COLOR_PALETTES)) {
    COLOR_PALETTE_OPTIONS[key] = value.name;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 多语言支持
// ═══════════════════════════════════════════════════════════════════════════════

const TRANSLATIONS = {
    en: {
        // 设置面板标题
        pluginTitle: "Tab Settings Enhanced",
        pluginDesc: "Enhanced Tab Management Plugin",
        
        // 语言设置
        langSection: "🌐 Language",
        langName: "Interface Language",
        langDesc: "Choose the language for settings interface",
        langAuto: "Auto (follow Obsidian)",
        
        // 标签颜色
        colorSection: "🎨 Tab Colors",
        colorEnable: "Enable Color Marking",
        colorEnableDesc: "Add same-color background to parent-child tabs",
        colorPalette: "Color Palette",
        colorPaletteDesc: "Select tab color style",
        colorOpacity: "Color Opacity",
        colorOpacityDesc: "Background color opacity (0.1-1.0)",
        
        // 新标签位置
        placementSection: "📂 New Tab Placement",
        placementName: "New Tab Position",
        placementDesc: "Control where new tabs open",
        openNewTab: "Open Links in New Tab",
        openNewTabDesc: "Click links to open in new tab by default",
        openQuickSwitchInNewTab: "Open Quick Switcher files in new tab",
        openQuickSwitchInNewTabDesc: "Open files from Quick Switcher (Ctrl+O) in new tab by default",
        openPanelLinkInNewTab: "Open panel links in new tab",
        openPanelLinkInNewTabDesc: "Open file links clicked in Bookmarks / Search / File Explorer / Backlinks / Outgoing Links panels in a new tab",

        // 标签导航器
        tabNavigator: "Tab Navigator",
        tabNavigatorSearch: "Search tabs or history...",
        tabNavigatorOpenTabs: "Open Tabs",
        tabNavigatorRecentClosed: "Recently Closed",
        tabNavigatorHint: "Tap Alt then letter: open | Tap Ctrl then letter: close | ↑↓: select | Enter: confirm | ESC: exit",
        tabNavigatorModeOpen: "▶ OPEN MODE — press a letter to open that tab · ESC to cancel",
        tabNavigatorModeClose: "✕ CLOSE MODE — press a letter to close that tab · ESC to cancel",
        tabNavigatorEmpty: "No matching tabs",
        tabNavigatorCmd: "Open Tab Navigator",

        
        // 新标签位置选项
        afterParent: "After parent tab",
        beforeParent: "Before parent tab",
        first: "First position",
        last: "Last position",
        afterPinned: "After pinned tabs",
        
        // 关闭标签设置
        closeSection: "❌ After Tab Close",
        closeName: "Activate Which Tab",
        closeDesc: "Which tab to activate after closing current",
        
        // 关闭后激活选项
        parent: "Parent tab",
        left: "Left tab",
        right: "Right tab",
        recent: "Most recent",
        firstTab: "First tab",
        lastTab: "Last tab",
        
        // 其他设置
        otherSection: "⚙️ Other Settings",
        deduplicate: "Prevent Duplicate Tabs",
        deduplicateDesc: "Switch to existing tab instead of opening new one",

        // 标签切换快捷键
        tabSwitchSection: "🔀 Tab Switching",
        jumpToTabPrefix: "Jump to Tab ",
        jumpToLastTab: "Jump to Last Tab",
        prevTab: "Previous Tab",
        nextTab: "Next Tab",

        // 每标签导航历史
        perTabHistorySection: "⏪ Per-Tab History",
        mouseSideNavEnable: "Enable Mouse Side-Button Navigation",
        mouseSideNavEnableDesc: "Use mouse button 4 (back) / button 5 (forward) to navigate history in the active tab",
        historyShowCount: "Show History Count",
        historyShowCountDesc: "Show back/forward count next to the native back/forward buttons",
        historyBack: "History Back",
        historyForward: "History Forward",

        // 自动归档
        autoArchiveSection: "🗄️ Auto-Archive",
        autoArchiveEnable: "Enable Auto-Archive",
        autoArchiveEnableDesc: "Auto-close idle unpinned tabs into archive area",
        autoArchiveTimeout: "Idle Timeout (minutes)",
        autoArchiveTimeoutDesc: "Tabs idle longer than this are auto-archived",
        autoArchiveMaxHistory: "Archive History Limit",
        autoArchiveMaxHistoryDesc: "Max number of archived tabs to keep",
        focusMode: "Focus Mode: Close All Unpinned Tabs",
        zenMode: "Zen Mode",
        zenModeHint: "Zen Mode · Press ESC to exit",
        archiveArea: "Archived",
        archiveEmpty: "No archived tabs",

        // 焦点锁定
        focusLockSection: "🎯 Focus Lock",
        focusLockEnable: "Show Status Bar Button",
        focusLockEnableDesc: "Display a focus-lock toggle button in the status bar",
        focusLockOn: "Focus Lock",
        focusLockOnDesc: "When locked, clicking sidebar panels (file explorer, search, etc.) won't steal editor focus",
        focusLockOnTip: "Focus Lock: ON (click to unlock) - sidebar won't steal editor focus",
        focusLockOffTip: "Focus Lock: OFF (click to lock)",

        // 专注模式开关
        focusModeEnable: "Enable Focus Mode",
        focusModeEnableDesc: "One-click close all unpinned tabs into archive (command / tab right-click menu)",

        // 禅模式
        zenModeSection: "🧘 Zen Mode",
        zenModeEnable: "Enable Zen Mode",
        zenModeEnableDesc: "Full-screen distraction-free writing (command / ribbon icon / tab right-click menu)",

        // 快捷键提示
        hotkeysSection: "⌨️ Hotkeys",
        hotkeysDesc: "Current commands & default hotkeys. Customize in Settings → Hotkeys (search command name).",
        openHotkeysSettings: "Open Hotkeys Settings",
        hotkeyDefault: "Default",
        hotkeyNone: "None (assign in Hotkeys)",
        hotkeyMouseSide: "Mouse btn 4 / 5",
        
        // 捐赠
        supportSection: "💖 Support",
        donationTitle: "🌟 Did this plugin help you?",
        donationSubtitle: "Your support keeps me motivated to update!",

        donationEncourage: "A cup of coffee keeps me going!",
        thanks: "🙏 Thanks for using Tab Settings Enhanced! Your support makes open source better"
    },
    zh: {
        // 设置面板标题
        pluginTitle: "Tab Settings Enhanced",
        pluginDesc: "增强版标签管理插件",
        
        // 语言设置
        langSection: "🌐 语言设置",
        langName: "界面语言",
        langDesc: "选择设置界面的语言",
        langAuto: "自动 (跟随 Obsidian)",
        
        // 标签颜色
        colorSection: "🎨 标签颜色",
        colorEnable: "启用颜色标记",
        colorEnableDesc: "为父子标签添加同色系背景",
        colorPalette: "配色方案",
        colorPaletteDesc: "选择标签颜色风格",
        colorOpacity: "颜色透明度",
        colorOpacityDesc: "背景颜色透明度 (0.1-1.0)",
        
        // 新标签位置
        placementSection: "📂 新标签位置",
        placementName: "新标签打开位置",
        placementDesc: "控制新标签在哪个位置打开",
        openNewTab: "默认在新标签打开",
        openNewTabDesc: "点击链接时默认在新标签打开",
        openQuickSwitchInNewTab: "快速切换器默认新标签打开",
        openQuickSwitchInNewTabDesc: "通过 Ctrl+O 快速切换器打开文件时,默认在新标签打开",
        openPanelLinkInNewTab: "面板链接默认新标签打开",
        openPanelLinkInNewTabDesc: "在书签 / 搜索 / 文件列表 / 入链 / 出链面板中点击文件链接时,默认在新标签打开",

        // 标签导航器
        tabNavigator: "标签导航器",
        tabNavigatorSearch: "搜索标签或历史...",
        tabNavigatorOpenTabs: "打开的标签",
        tabNavigatorRecentClosed: "最近关闭",
        tabNavigatorHint: "点按 Alt→字母 打开 | 点按 Ctrl→字母 关闭 | ↑↓ 选择 | Enter 确认 | ESC 退出",
        tabNavigatorModeOpen: "▶ 打开模式 — 按字母打开对应标签 · ESC 取消",
        tabNavigatorModeClose: "✕ 关闭模式 — 按字母关闭对应标签 · ESC 取消",
        tabNavigatorEmpty: "没有匹配的标签",
        tabNavigatorCmd: "打开标签导航器",

        
        // 新标签位置选项
        afterParent: "父标签右侧",
        beforeParent: "父标签左侧",
        first: "第一个位置",
        last: "最后一个位置",
        afterPinned: "固定标签后",
        
        // 关闭标签设置
        closeSection: "❌ 关闭标签后",
        closeName: "激活哪个标签",
        closeDesc: "关闭当前标签后，激活哪个标签",
        
        // 关闭后激活选项
        parent: "父标签",
        left: "左侧标签",
        right: "右侧标签",
        recent: "最近使用",
        firstTab: "第一个标签",
        lastTab: "最后一个标签",
        
        // 其他设置
        otherSection: "⚙️ 其他设置",
        deduplicate: "防止重复标签",
        deduplicateDesc: "如果文件已打开，切换到现有标签而不是新建",

        // 标签切换快捷键
        tabSwitchSection: "🔀 标签切换",
        jumpToTabPrefix: "跳转到标签 ",
        jumpToLastTab: "跳转到最后一个标签",
        prevTab: "上一个标签",
        nextTab: "下一个标签",

        // 每标签导航历史
        perTabHistorySection: "⏪ 每标签导航历史",
        mouseSideNavEnable: "启用鼠标侧键标签导航历史",
        mouseSideNavEnableDesc: "使用鼠标第4键（后退）/ 第5键（前进）在当前标签内导航历史",
        historyShowCount: "显示历史计数",
        historyShowCountDesc: "在原生返回/前进按钮旁显示前进/后退计数",
        historyBack: "历史后退",
        historyForward: "历史前进",

        // 自动归档
        autoArchiveSection: "🗄️ 自动归档",
        autoArchiveEnable: "启用自动归档",
        autoArchiveEnableDesc: "自动将长时间未激活的非固定标签关闭并归档",
        autoArchiveTimeout: "闲置超时（分钟）",
        autoArchiveTimeoutDesc: "标签闲置超过该时间后自动归档",
        autoArchiveMaxHistory: "归档历史上限",
        autoArchiveMaxHistoryDesc: "最多保留的归档标签数量",
        focusMode: "专注模式：关闭所有非固定标签",
        zenMode: "禅模式",
        zenModeHint: "禅模式 · 按 ESC 退出",
        archiveArea: "已归档",
        archiveEmpty: "暂无归档标签",

        // 焦点锁定
        focusLockSection: "🎯 焦点锁定",
        focusLockEnable: "显示状态栏按钮",
        focusLockEnableDesc: "在状态栏显示焦点锁定切换按钮",
        focusLockOn: "焦点锁定",
        focusLockOnDesc: "锁定后，点击侧边栏面板（文件列表、搜索等）不会偷走编辑器焦点",
        focusLockOnTip: "焦点锁定：已开启（点击解锁）— 侧边栏不会偷走编辑器焦点",
        focusLockOffTip: "焦点锁定：已关闭（点击锁定）",

        // 专注模式开关
        focusModeEnable: "启用专注模式",
        focusModeEnableDesc: "一键关闭所有非固定标签并归档（命令 / 标签右键菜单）",

        // 禅模式
        zenModeSection: "🧘 禅模式",
        zenModeEnable: "启用禅模式",
        zenModeEnableDesc: "全屏免打扰专注写作（命令 / 左侧羽毛笔图标 / 标签右键菜单）",

        // 快捷键提示
        hotkeysSection: "⌨️ 快捷键",
        hotkeysDesc: "当前命令及默认快捷键。可在 设置 → 快捷键 中搜索命令名自定义。",
        openHotkeysSettings: "打开快捷键设置",
        hotkeyDefault: "默认",
        hotkeyNone: "无（可在快捷键中指定）",
        hotkeyMouseSide: "鼠标第4/5键",
        
        // 捐赠
        supportSection: "💖 支持作者",
        donationTitle: "🌟 这个插件帮到你了吗？",
        donationSubtitle: "您的支持是我持续更新的动力！",

        donationEncourage: "一杯咖啡的鼓励，让我更有动力！",
        thanks: "🙏 感谢使用 Tab Settings Enhanced！您的支持让开源更美好"
    }
};

// 获取翻译文本的辅助函数
function t(key, lang) {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
}

// 检测 Obsidian 语言
function detectObsidianLanguage() {
    // 尝试获取 Obsidian 的语言设置
    const locale = window.localStorage.getItem('language') || navigator.language || 'en';
    return locale.startsWith('zh') ? 'zh' : 'en';
}

// ═══════════════════════════════════════════════════════════════════════════════
// 默认设置
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_SETTINGS = {
    // 语言设置
    language: "auto",  // auto, en, zh
    
    // 新标签打开位置
    newTabPlacement: "after-parent",
    
    // 关闭标签后激活策略
    closeTabActivation: "parent",
    
    // 其他设置
    openInNewTab: true,
    openQuickSwitchInNewTab: false,  // 快速切换器默认新标签打开
    openPanelLinkInNewTab: false,    // 书签/搜索/文件列表/入链/出链面板点击链接默认新标签打开
    deduplicateTabs: true,
    
    // 标签颜色设置
    enableTabColors: true,
    colorPalette: "morandi",
    colorOpacity: 0.3,

    // 每标签导航历史（复用内置 leaf.history，系统功能无需开关）
    enableMouseSideNav: true,    // 启用鼠标侧键标签导航历史（第4键后退/第5键前进）
    historyShowCount: true,      // 在原生前进/后退按钮旁显示历史计数

    // 自动归档
    enableAutoArchive: false,    // 启用自动归档（默认关闭）
    autoArchiveTimeout: 30,      // 超时时间（分钟）
    autoArchiveMaxHistory: 100,  // 归档历史上限
    enableFocusMode: true,       // 启用专注模式（一键关闭所有非固定标签）

    // 焦点锁定
    enableFocusLock: false,      // 启用焦点锁定功能
    focusLockOn: false,          // 焦点锁定当前状态（持久化）

    // 禅模式
    enableZenMode: true          // 启用禅模式（全屏专注写作）
};

// ═══════════════════════════════════════════════════════════════════════════════
// 主插件类
// ═══════════════════════════════════════════════════════════════════════════════

class TabSettingsEnhancedPlugin extends obsidian.Plugin {
    
    async onload() {
        console.log("Tab Settings Enhanced: 加载中...");
        
        try {
            this.settings = Object.assign({}, DEFAULT_SETTINGS);
            this.parentMap = new Map();
            this.recentOrder = [];
            this.leafColors = new Map();  // leafId -> color
            this.rootLeafColors = new Map();  // rootLeafId -> color
            this.colorIndex = 0;
            this.closedTabsHistory = [];  // 最近关闭的标签历史

            // 每标签导航历史：复用 Obsidian 内置 leaf.history（无需自建栈）

            // 自动归档：归档的标签记录
            this.archivedTabs = [];
            // 每个标签最后激活时间：leafId -> timestamp
            this.tabLastActive = new Map();

            // 焦点锁定：主编辑区最后活动的 leaf
            this.lastMainLeaf = null;
            this.statusBarItem = null;

            // 禅模式当前状态
            this.zenModeActive = false;

            await this.loadSettings();
            
            // 注册设置面板
            const settingTab = new TabSettingsSettingTab(this.app, this);
            this.addSettingTab(settingTab);
            console.log("Tab Settings Enhanced: 设置面板已注册");
            
            // 注册标签导航器命令（使用官方 hotkeys 字段设置默认快捷键 Alt+T）
            this.addCommand({
                id: 'open-tab-navigator',
                name: t('tabNavigatorCmd', detectObsidianLanguage()),
                hotkeys: [{ modifiers: ['Alt'], key: 't' }],
                callback: () => {
                    new TabNavigatorModal(this.app, this).open();
                }
            });
            console.log("Tab Settings Enhanced: 标签导航器命令已注册");

            // ─── 功能1：标签切换/移动快捷键 ───────────────────────────
            const cmdLang = detectObsidianLanguage();
            // Alt+1 ~ Alt+8：跳转到第 N 个标签（固定标签在前、普通在后排序）
            for (let i = 1; i <= 8; i++) {
                this.addCommand({
                    id: `jump-to-tab-${i}`,
                    name: t('jumpToTabPrefix', cmdLang) + i,
                    hotkeys: [{ modifiers: ['Alt'], key: `${i}` }],
                    callback: () => this.jumpToTabByIndex(i - 1)
                });
            }
            // Alt+9：跳转到最后一个标签
            this.addCommand({
                id: 'jump-to-last-tab',
                name: t('jumpToLastTab', cmdLang),
                hotkeys: [{ modifiers: ['Alt'], key: '9' }],
                callback: () => this.jumpToLastTab()
            });
            // Alt+← / Alt+→：上一个 / 下一个标签（可在设置中自定义快捷键）
            this.addCommand({
                id: 'goto-prev-tab',
                name: t('prevTab', cmdLang),
                hotkeys: [{ modifiers: ['Alt'], key: 'ArrowLeft' }],
                callback: () => this.navigateTab(-1)
            });
            this.addCommand({
                id: 'goto-next-tab',
                name: t('nextTab', cmdLang),
                hotkeys: [{ modifiers: ['Alt'], key: 'ArrowRight' }],
                callback: () => this.navigateTab(1)
            });
            console.log("Tab Settings Enhanced: 标签切换快捷键已注册");

            // ─── 功能3：专注模式命令（一键关闭所有非固定标签）─────────
            this.addCommand({
                id: 'focus-mode-close-unpinned',
                name: t('focusMode', cmdLang),
                callback: () => this.focusModeCloseUnpinned()
            });
            console.log("Tab Settings Enhanced: 专注模式命令已注册");

            // 把"专注模式/禅模式"注入标签页右键菜单（标签的更多选项）
            this.setupTabContextMenu();

            // ─── 禅模式（Zen Mode）───────────────────────────────────
            this.addCommand({
                id: 'toggle-zen-mode',
                name: t('zenMode', cmdLang),
                callback: () => this.toggleZenMode()
            });
            // 左侧 Ribbon 图标（羽毛笔=写作），点击进入/退出禅模式（存引用以控制显隐）
            this.zenRibbonEl = this.addRibbonIcon('feather', t('zenMode', cmdLang), () => this.toggleZenMode());
            this.updateZenRibbonVisibility();
            // 禅模式下按 ESC 退出
            this.registerDomEvent(document, 'keydown', (evt) => {
                if (evt.key === 'Escape' && this.zenModeActive) {
                    // 有模态框打开时把 ESC 留给模态框（修复：关弹窗时误退禅模式）
                    if (document.querySelector('.modal-container .modal')) return;
                    this.toggleZenMode();
                }
            });
            console.log("Tab Settings Enhanced: 禅模式已注册");
            console.log("Tab Settings Enhanced: 专注模式已加入标签右键菜单");

            // ─── 每标签导航历史 — 鼠标侧键（第4键后退 / 第5键前进）─
            this.registerDomEvent(document, 'mousedown', (evt) => {
                if (!this.settings.enableMouseSideNav) return;
                // button 3 = 第4键(后退)，button 4 = 第5键(前进)
                if (evt.button === 3) {
                    evt.preventDefault();
                    this.goBackInActiveTab();
                } else if (evt.button === 4) {
                    evt.preventDefault();
                    this.goForwardInActiveTab();
                }
            });
            
            // 注册样式
            this.registerStyles();
            
            // 监听标签激活事件 (追踪最近使用 + 每标签历史 + 自动归档活动时间 + 焦点锁定)
            this.registerEvent(
                this.app.workspace.on('active-leaf-change', (leaf) => {
                    if (!leaf) return;
                    this.updateRecentOrder(leaf.id);

                    // 记录最后激活时间（自动归档依据）
                    this.tabLastActive.set(leaf.id, Date.now());

                    // 焦点锁定：判断是否激活到侧边栏，若是则把焦点拉回主编辑区
                    if (this.isMainLeaf(leaf)) {
                        this.lastMainLeaf = leaf;
                    } else {
                        this.handleFocusLockSidebar(leaf);
                    }

                    // 更新标签头历史计数徽标（读取内置 leaf.history）
                    this.updateTabHistoryBadges();
                })
            );
            
            // 监听标签关闭/布局变化事件
            this.registerEvent(
                this.app.workspace.on('layout-change', () => {
                    this.cleanupParentMap();
                    this.updateTabColors();
                    this.updateTabHistoryBadges();
                })
            );

            // 同标签内导航（原生前进/后退按钮、同标签打开链接）后刷新历史计数徽标
            // 修复：原来只监听 active-leaf-change/layout-change，点原生 back/forward 后计数滞后
            this.registerEvent(
                this.app.workspace.on('file-open', () => {
                    this.updateTabHistoryBadges();
                })
            );
            
            // Monkey patch: 拦截 getLeaf 方法
            this.patchGetLeaf();
            
            // Monkey patch: 拦截标签关闭
            this.patchLeafDetach();
            
            // Monkey patch: 拦截链接打开
            this.patchOpenLink();

            // 面板链接点击新标签打开（书签/搜索/文件列表/入链/出链）
            this.patchPanelLinkOpen();
            
            // 初始应用颜色 + 历史徽标 + 焦点锁定状态栏
            this.app.workspace.onLayoutReady(() => {
                this.updateTabColors();
                this.updateTabHistoryBadges();
                // 记录初始活动 leaf
                const active = this.app.workspace.activeLeaf;
                if (active) {
                    this.tabLastActive.set(active.id, Date.now());
                    if (this.isMainLeaf(active)) this.lastMainLeaf = active;
                }
                // 为所有已存在的主区标签建立活动时间基线（自动归档依据，
                // 否则启动时恢复的标签永远拿不到归档资格）
                for (const l of this.getMainLeaves()) {
                    if (!this.tabLastActive.has(l.id)) {
                        this.tabLastActive.set(l.id, Date.now());
                    }
                }
            });

            // ─── 功能4：焦点锁定状态栏图标 ──────────────────────────
            this.setupFocusLockStatusBar();

            // ─── 功能3：自动归档定时器（每分钟检查一次）──────────────
            this.registerInterval(window.setInterval(() => {
                this.checkAutoArchive();
            }, 60 * 1000));

            console.log("Tab Settings Enhanced: 加载完成!");
        } catch (error) {
            console.error("Tab Settings Enhanced: 加载失败!", error);
        }
    }

    onunload() {
        console.log("Tab Settings Enhanced: 已卸载");
        this.saveSettings();  // 兜底持久化（最近关闭/归档区）
        this.removeTabColors();
        this.removeAllHistoryBadges();
        document.body.classList.remove('tse-zen-mode');  // 清理禅模式
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 设置管理
    // ─────────────────────────────────────────────────────────────────────────

    async loadSettings() {
        const data = await this.loadData();
        this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
        // 历史与归档单独持久化（不属于开关设置）
        this.closedTabsHistory = (data && data.closedTabsHistory) || [];
        this.archivedTabs = (data && data.archivedTabs) || [];
    }

    async saveSettings() {
        const data = Object.assign({}, this.settings, {
            closedTabsHistory: this.closedTabsHistory,
            archivedTabs: this.archivedTabs
        });
        await this.saveData(data);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 样式注册
    // ─────────────────────────────────────────────────────────────────────────

    registerStyles() {
        const styleEl = document.createElement('style');
        styleEl.id = 'tab-settings-enhanced-styles';
        styleEl.textContent = `
            .workspace-tab-header[data-tab-color] {
                position: relative;
            }
            .workspace-tab-header[data-tab-color]::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 20%;          /* 未激活：占标签宽 1/5 */
                height: 3px;
                background-color: var(--tab-bg-color);
                opacity: var(--tab-bg-opacity, 0.3);  /* 未激活弱化，透明度随设置 */
                border-radius: 3px 3px 0 0;
                pointer-events: none;
                transition: width 0.15s ease, opacity 0.15s ease;
            }
            .workspace-tab-header[data-tab-color].is-active::after {
                width: 33.33%;       /* 激活：占标签宽 1/3 */
                opacity: 1;
            }
            
            /* 标签导航器模态框样式 */
            .tab-navigator-modal {
                width: 90vw;
                max-width: 1400px;
                height: 90vh;
                max-height: 900px;
            }
            .tab-navigator-modal .modal-content {
                padding: 0;
                height: 100%;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .tab-navigator-body {
                display: flex;
                flex: 1;
                overflow: hidden;
                min-height: 0;
            }
            .tab-navigator-main {
                flex: 3;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                border-right: 1px solid var(--background-modifier-border);
                min-width: 0;
            }
            .tab-navigator-sidebar {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                min-width: 180px;
                max-width: 350px;
            }
            .tab-navigator-search {
                padding: 16px 20px;
                border-bottom: 1px solid var(--background-modifier-border);
                flex-shrink: 0;
            }
            .tab-navigator-list {
                flex: 1;
                overflow-y: auto;
                padding: 8px 0;
            }
            .tab-navigator-group-title {
                padding: 12px 20px 6px;
                font-size: 11px;
                font-weight: 600;
                color: var(--text-muted);
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .tab-navigator-item:hover {
                background: var(--background-modifier-hover) !important;
            }
            .tab-navigator-item:hover .tab-navigator-action {
                opacity: 1 !important;
            }
            .tab-navigator-sidebar-item:hover {
                background: var(--background-modifier-hover) !important;
            }
            .tab-navigator-sidebar-list {
                flex: 1;
                overflow-y: auto;
                padding: 4px 0;
            }
            .tab-navigator-hint {
                padding: 10px 16px;
                border-top: 1px solid var(--background-modifier-border);
                font-size: 11px;
                color: var(--text-muted);
                text-align: center;
                flex-shrink: 0;
            }
            .tab-navigator-hint.tab-navigator-mode-armed {
                color: var(--text-accent);
                font-weight: 600;
                background: var(--background-modifier-hover);
            }

            /* 每标签历史计数（原生 返回/前进 按钮旁） */
            .tse-hist-count {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 14px;
                margin: 0 1px;
                padding: 0 3px;
                font-size: 10px;
                font-family: monospace;
                line-height: 1.4;
                color: var(--text-faint);
                white-space: nowrap;
                pointer-events: none;
                align-self: center;
            }
            /* 计数为 0 时更淡 */
            .tse-hist-count.tse-back-count,
            .tse-hist-count.tse-forward-count {
                vertical-align: middle;
            }

            /* 焦点锁定状态栏图标 */
            .tse-focus-lock-item {
                cursor: pointer;
                user-select: none;
                padding: 0 4px;
            }
            .tse-focus-lock-item:hover {
                color: var(--text-accent);
            }

            /* 归档区（标签导航器右侧边栏，位于最近关闭上方） */
            .tab-navigator-archive-section {
                flex-shrink: 0;
                max-height: 40%;
                display: flex;
                flex-direction: column;
                border-bottom: 1px solid var(--background-modifier-border);
            }
            .tab-navigator-archive-title {
                padding: 12px 16px 6px;
                font-size: 11px;
                font-weight: 600;
                color: var(--text-muted);
                text-transform: uppercase;
                letter-spacing: 0.05em;
                border-bottom: 1px solid var(--background-modifier-border);
                flex-shrink: 0;
            }
            .tab-navigator-archive-list {
                overflow-y: auto;
                padding: 4px 0;
            }
            .tab-navigator-archive-empty {
                padding: 18px 16px;
                text-align: center;
                color: var(--text-faint);
                font-size: 12px;
            }

            /* ═══ 禅模式（Zen Mode）═══ */
            /* 隐藏所有无关 UI：左侧图标栏、左右侧边栏、状态栏、标签栏、笔记标题栏、窗口标题栏 */
            body.tse-zen-mode .workspace-ribbon,
            body.tse-zen-mode .workspace-split.mod-left-split,
            body.tse-zen-mode .workspace-split.mod-right-split,
            body.tse-zen-mode .status-bar,
            body.tse-zen-mode .workspace-tab-header-container,
            body.tse-zen-mode .view-header,
            body.tse-zen-mode .titlebar {
                display: none !important;
            }
            /* 隐藏侧边栏折叠把手 */
            body.tse-zen-mode .workspace-sidedock-vault-profile,
            body.tse-zen-mode .sidebar-toggle-button {
                display: none !important;
            }
            /* 笔记内容铺满全屏（不固定宽度），霸气专注 */
            body.tse-zen-mode .workspace-split.mod-root .workspace-leaf-content {
                max-width: none !important;
                width: 100%;
                margin: 0;
            }
            body.tse-zen-mode .workspace-split.mod-root {
                padding: 0;
            }
            /* 编辑器内容区也适当留白呼吸感，但占满宽度 */
            body.tse-zen-mode .workspace-split.mod-root .cm-contentContainer,
            body.tse-zen-mode .workspace-split.mod-root .markdown-preview-view {
                max-width: 100%;
            }
            /* 顶部退出提示 */
            body.tse-zen-mode::after {
                content: 'ESC';
                position: fixed;
                top: 10px;
                right: 14px;
                font-size: 10px;
                font-family: monospace;
                color: var(--text-faint);
                background: var(--background-modifier-border);
                padding: 2px 8px;
                border-radius: 4px;
                opacity: 0.6;
                z-index: 9999;
                pointer-events: none;
            }
        `;
        document.head.appendChild(styleEl);
        
        this.register(() => {
            const el = document.getElementById('tab-settings-enhanced-styles');
            if (el) el.remove();
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 标签颜色管理
    // ─────────────────────────────────────────────────────────────────────────

    getNextColor() {
        const palette = COLOR_PALETTES[this.settings.colorPalette];
        let colors;
        
        if (this.settings.colorPalette === 'random' || !palette || !palette.colors) {
            // 生成随机颜色
            const hue = Math.floor(Math.random() * 360);
            return `hsl(${hue}, 60%, 70%)`;
        }
        
        colors = palette.colors;
        const color = colors[this.colorIndex % colors.length];
        this.colorIndex++;
        return color;
    }

    getRootLeaf(leafId) {
        // 迭代查找根祖先标签（带环保护：parentMap 异常成环时不会死循环/栈溢出）
        let current = leafId;
        const visited = new Set([leafId]);
        while (true) {
            const parentId = this.parentMap.get(current);
            if (!parentId || visited.has(parentId)) return current;
            visited.add(parentId);
            current = parentId;
        }
    }

    getColorForLeaf(leafId) {
        const rootId = this.getRootLeaf(leafId);
        
        // 检查根标签是否已有颜色
        if (this.rootLeafColors.has(rootId)) {
            return this.rootLeafColors.get(rootId);
        }
        
        // 为根标签分配新颜色
        const color = this.getNextColor();
        this.rootLeafColors.set(rootId, color);
        return color;
    }

    updateTabColors() {
        if (!this.settings.enableTabColors) {
            this.removeTabColors();
            return;
        }

        // 直接遍历所有 leaf，设置其标签头的颜色
        this.app.workspace.iterateAllLeaves(leaf => {
            // 获取标签头元素
            const header = leaf.tabHeaderEl;
            if (!header) return;
            
            // 检查是否有父标签关系
            const hasParent = this.parentMap.has(leaf.id);
            const hasChildren = this.hasChildren(leaf.id);
            
            if (hasParent || hasChildren) {
                const color = this.getColorForLeaf(leaf.id);
                header.setAttribute('data-tab-color', 'true');
                header.style.setProperty('--tab-bg-color', color);
                header.style.setProperty('--tab-bg-opacity', this.settings.colorOpacity.toString());
                // 底部颜色条由 CSS ::after 渲染（修复：原 inline border-bottom 与 ::after 双重重叠）
            } else {
                header.removeAttribute('data-tab-color');
                header.style.removeProperty('--tab-bg-color');
                header.style.removeProperty('--tab-bg-opacity');
                header.style.removeProperty('border-bottom');
            }
        });
    }

    hasChildren(leafId) {
        for (const [childId, parentId] of this.parentMap) {
            if (parentId === leafId) return true;
        }
        return false;
    }

    removeTabColors() {
        this.app.workspace.iterateAllLeaves(leaf => {
            const header = leaf.tabHeaderEl;
            if (header) {
                header.removeAttribute('data-tab-color');
                header.style.removeProperty('--tab-bg-color');
                header.style.removeProperty('--tab-bg-opacity');
                header.style.removeProperty('border-bottom');
            }
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 父标签追踪
    // ─────────────────────────────────────────────────────────────────────────

    setParent(childId, parentId) {
        if (childId && parentId && childId !== parentId) {
            this.parentMap.set(childId, parentId);
            // 更新颜色
            setTimeout(() => this.updateTabColors(), 100);
        }
    }

    getParent(leafId) {
        return this.parentMap.get(leafId);
    }

    cleanupParentMap() {
        const existingIds = new Set();
        this.app.workspace.iterateAllLeaves(leaf => {
            existingIds.add(leaf.id);
        });
        
        // 找出已关闭的标签（在 parentMap 中作为 parentId 存在，但 leafId 不存在）
        const closedParentIds = new Set();
        for (const [childId, parentId] of this.parentMap) {
            if (!existingIds.has(parentId)) {
                closedParentIds.add(parentId);
            }
        }
        
        // 对于每个已关闭的父标签，将其子标签的父标签更新为祖先标签
        // 例如：A -> B -> C，如果 B 关闭，则 C 的父标签应更新为 A
        for (const closedId of closedParentIds) {
            // 找到这个已关闭标签的祖先（可能也已关闭，需要递归查找；带环保护）
            let ancestorId = this.parentMap.get(closedId);
            const seen = new Set([closedId]);
            while (ancestorId && !existingIds.has(ancestorId)) {
                if (seen.has(ancestorId)) { ancestorId = null; break; }  // 检测到环，放弃接力
                seen.add(ancestorId);
                ancestorId = this.parentMap.get(ancestorId);
            }
            
            // 将所有以 closedId 为父标签的子标签，更新为 ancestorId
            for (const [childId, parentId] of this.parentMap) {
                if (parentId === closedId && existingIds.has(childId)) {
                    if (ancestorId) {
                        this.parentMap.set(childId, ancestorId);
                        console.log(`Tab Settings Enhanced: 父标签关系更新 ${childId} -> ${ancestorId}`);
                    } else {
                        // 没有祖先了，删除这个关系
                        this.parentMap.delete(childId);
                    }
                }
            }
        }
        
        // 清理不存在的子标签条目
        for (const [childId, parentId] of this.parentMap) {
            if (!existingIds.has(childId)) {
                this.parentMap.delete(childId);
            }
        }
        
        // 清理颜色映射
        for (const [rootId, color] of this.rootLeafColors) {
            if (!existingIds.has(rootId)) {
                this.rootLeafColors.delete(rootId);
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 最近使用追踪
    // ─────────────────────────────────────────────────────────────────────────

    updateRecentOrder(leafId) {
        const index = this.recentOrder.indexOf(leafId);
        if (index > -1) {
            this.recentOrder.splice(index, 1);
        }
        this.recentOrder.unshift(leafId);
        
        if (this.recentOrder.length > 50) {
            this.recentOrder.pop();
        }
    }

    getMostRecentLeaf(excludeId) {
        for (const id of this.recentOrder) {
            if (id !== excludeId) {
                const leaf = this.getLeafById(id);
                if (leaf) return leaf;
            }
        }
        return null;
    }

    getLeafById(id) {
        let found = null;
        this.app.workspace.iterateAllLeaves(leaf => {
            if (leaf.id === id) found = leaf;
        });
        return found;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 获取标签组中的标签列表
    // ─────────────────────────────────────────────────────────────────────────

    getSiblingsInGroup(leaf) {
        if (!leaf || !leaf.parent) return [];
        return leaf.parent.children.filter(child => child.view);
    }

    getLeafIndex(leaf) {
        const siblings = this.getSiblingsInGroup(leaf);
        return siblings.indexOf(leaf);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Monkey Patch: getLeaf - 控制新标签位置
    // ─────────────────────────────────────────────────────────────────────────

    patchGetLeaf() {
        const plugin = this;
        const originalGetLeaf = this.app.workspace.getLeaf.bind(this.app.workspace);
        
        this.app.workspace.getLeaf = function(newLeaf, ...args) {
            const activeLeaf = plugin.app.workspace.activeLeaf;
            const leaf = originalGetLeaf(newLeaf, ...args);
            
            if (newLeaf === true || newLeaf === 'tab') {
                if (activeLeaf && leaf && activeLeaf !== leaf) {
                    plugin.setParent(leaf.id, activeLeaf.id);
                    // 使用 setTimeout 确保新标签已完全加入 DOM
                    setTimeout(() => {
                        plugin.repositionNewTab(leaf, activeLeaf);
                    }, 0);
                }
            }
            
            return leaf;
        };
        
        this.register(() => {
            this.app.workspace.getLeaf = originalGetLeaf;
        });
    }

    repositionNewTab(newLeaf, parentLeaf) {
        if (!newLeaf || !parentLeaf || !parentLeaf.parent) return;
        
        const parent = parentLeaf.parent;
        const children = parent.children;
        const parentIndex = children.indexOf(parentLeaf);
        const currentIndex = children.indexOf(newLeaf);
        
        if (parentIndex === -1 || currentIndex === -1) return;
        
        let targetIndex;
        
        switch (this.settings.newTabPlacement) {
            case 'after-parent':
                targetIndex = parentIndex + 1;
                break;
            case 'before-parent':
                targetIndex = parentIndex;
                break;
            case 'first':
                targetIndex = 0;
                break;
            case 'last':
                targetIndex = children.length - 1;
                break;
            case 'after-pinned':
                let lastPinnedIndex = -1;
                for (let i = 0; i < children.length; i++) {
                    if (children[i].pinned) {
                        lastPinnedIndex = i;
                    }
                }
                targetIndex = lastPinnedIndex + 1;
                break;
            default:
                targetIndex = parentIndex + 1;
        }
        
        if (targetIndex !== currentIndex) {
            children.splice(currentIndex, 1);
            if (targetIndex > currentIndex) targetIndex--;
            children.splice(targetIndex, 0, newLeaf);
            if (parent.recomputeChildrenDimensions) {
                parent.recomputeChildrenDimensions();
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Monkey Patch: detach - 控制关闭后激活哪个标签
    // ─────────────────────────────────────────────────────────────────────────

    patchLeafDetach() {
        const plugin = this;
        const originalDetach = obsidian.WorkspaceLeaf.prototype.detach;
        
        obsidian.WorkspaceLeaf.prototype.detach = function() {
            const closingLeaf = this;
            const wasActive = plugin.app.workspace.activeLeaf === closingLeaf;
            
            // 记录关闭历史（用于标签导航器的历史恢复功能）
            plugin.recordClosedTab(closingLeaf);

            // 清理活动时间记录，避免 tabLastActive Map 随会话无限增长
            plugin.tabLastActive.delete(closingLeaf.id);
            
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

    findNextLeaf(closingLeaf) {
        const siblings = this.getSiblingsInGroup(closingLeaf);
        const index = siblings.indexOf(closingLeaf);
        const remaining = siblings.filter(l => l !== closingLeaf);
        if (remaining.length === 0) return null;
        
        switch (this.settings.closeTabActivation) {
            case 'parent':
                const parentId = this.getParent(closingLeaf.id);
                if (parentId) {
                    const parentLeaf = this.getLeafById(parentId);
                    if (parentLeaf && remaining.includes(parentLeaf)) {
                        return parentLeaf;
                    }
                }
                return remaining[Math.max(0, index - 1)] || remaining[0];
                
            case 'left':
                return remaining[Math.max(0, index - 1)] || remaining[0];
                
            case 'right':
                if (index < siblings.length - 1) {
                    return siblings[index + 1];
                }
                return remaining[remaining.length - 1];
                
            case 'recent':
                const recentLeaf = this.getMostRecentLeaf(closingLeaf.id);
                if (recentLeaf && remaining.includes(recentLeaf)) {
                    return recentLeaf;
                }
                return remaining[0];
                
            case 'first':
                return remaining[0];
                
            case 'last':
                return remaining[remaining.length - 1];
                
            default:
                return remaining[Math.max(0, index - 1)] || remaining[0];
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Monkey Patch: openLinkText - 控制链接在新标签打开
    // ─────────────────────────────────────────────────────────────────────────

    patchOpenLink() {
        const plugin = this;
        
        // 拦截 Workspace.openLinkText
        const originalOpenLinkText = this.app.workspace.openLinkText.bind(this.app.workspace);
        
        this.app.workspace.openLinkText = async function(linktext, sourcePath, newLeaf, openViewState) {
            // 解析链接获取目标文件路径
            const resolvedPath = plugin.resolveLinkPath(linktext, sourcePath);
            
            // 如果启用了"防止重复标签"，检查文件是否已打开
            if (plugin.settings.deduplicateTabs && resolvedPath) {
                const existingLeaf = plugin.findExistingLeaf(resolvedPath);
                if (existingLeaf) {
                    // 文件已打开，激活现有标签
                    // 修复1: 先 revealLeaf 确保标签可见（处理标签在折叠/隐藏 split 的情况）
                    plugin.app.workspace.revealLeaf(existingLeaf);
                    // 修复2: 设置焦点激活
                    plugin.app.workspace.setActiveLeaf(existingLeaf, { focus: true });
                    // 修复3: 应用 openViewState 中的 eState（如 Dataview 传递的行号/光标位置），
                    //        否则标签虽切换但不会跳转到具体任务行
                    if (openViewState && openViewState.eState) {
                        existingLeaf.setEphemeralState(openViewState.eState);
                    }
                    console.log("Tab Settings Enhanced: 已激活现有标签 -", resolvedPath);
                    return;
                }
            }
            
            // 如果启用了"默认在新标签打开"，强制 newLeaf 为 true
            // 修复：使用 !newLeaf 而不是 === undefined，因为可能传入 false
            if (plugin.settings.openInNewTab && !newLeaf) {
                newLeaf = true;
                console.log("Tab Settings Enhanced: 强制在新标签打开");
            }
            
            // 【新增】快速切换器专用拦截：如果来自快速切换器且启用了对应开关
            if (plugin.settings.openQuickSwitchInNewTab && !newLeaf && plugin.isQuickSwitcherOpen()) {
                newLeaf = true;
                console.log("Tab Settings Enhanced: 快速切换器 - 强制在新标签打开");
            }
            
            const result = await originalOpenLinkText(linktext, sourcePath, newLeaf, openViewState);
            

            
            return result;
        };
        
        this.register(() => {
            this.app.workspace.openLinkText = originalOpenLinkText;
        });

        // 拦截内部链接点击事件
        this.registerDomEvent(document, 'click', (evt) => {
            const target = evt.target;
            if (!target) return;
            
            // 检查是否点击了内部链接
            const link = target.closest('a.internal-link');
            if (!link) return;
            
            const href = link.getAttribute('href') || link.getAttribute('data-href');
            if (!href) return;
            
            const activeFile = plugin.app.workspace.getActiveFile();
            const sourcePath = activeFile ? activeFile.path : '';
            
            // 先检查是否启用防止重复标签
            if (plugin.settings.deduplicateTabs) {
                const resolvedPath = plugin.resolveLinkPath(href, sourcePath);
                if (resolvedPath) {
                    const existingLeaf = plugin.findExistingLeaf(resolvedPath);
                    if (existingLeaf) {
                        evt.preventDefault();
                        // stopImmediatePropagation: 两个 document 捕获监听器（本处理器 + 面板链接处理器）
                        // 同节点上 stopPropagation 无法阻止后者，会导致同一文件被打开两次
                        evt.stopImmediatePropagation();
                        // 修复: 先 revealLeaf 确保标签可见
                        plugin.app.workspace.revealLeaf(existingLeaf);
                        plugin.app.workspace.setActiveLeaf(existingLeaf, { focus: true });
                        console.log("Tab Settings Enhanced: 已激活现有标签 -", resolvedPath);
                        return;
                    }
                }
            }
            
            // 如果启用了默认新标签打开，并且没有按住修饰键
            if (plugin.settings.openInNewTab && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey) {
                evt.preventDefault();
                // stopImmediatePropagation: 阻止同节点的面板链接处理器二次打开同一文件
                evt.stopImmediatePropagation();
                console.log("Tab Settings Enhanced: 拦截链接点击，在新标签打开 -", href);
                plugin.app.workspace.openLinkText(href, sourcePath, true);
            }
        }, true);  // 使用捕获阶段
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 辅助方法：检测快速切换器是否打开
    // ─────────────────────────────────────────────────────────────────────────

    isQuickSwitcherOpen() {
        // 检测 Obsidian 原生快速切换器模态框是否存在于 DOM
        // 快速切换器打开文件时，模态框尚未关闭，可通过此判断调用来源
        return !!document.querySelector('.quick-switcher-modal');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 面板链接点击新标签打开（书签/搜索/文件列表/入链/出链）
    // ─────────────────────────────────────────────────────────────────────────

    patchPanelLinkOpen() {
        const plugin = this;
        // 目标面板的 leaf-content data-type
        const PANEL_TYPES = ['bookmarks', 'search', 'file-explorer', 'backlink', 'outgoing-link'];

        this.registerDomEvent(document, 'click', (evt) => {
            if (!plugin.settings.openPanelLinkInNewTab) return;
            // 按住 Ctrl/Cmd 时交给默认行为（本就新标签）
            if (evt.ctrlKey || evt.metaKey) return;
            const target = evt.target;
            if (!target || !target.closest) return;

            // 必须点击在目标面板内
            const leafContent = target.closest('.workspace-leaf-content');
            if (!leafContent) return;
            const type = leafContent.getAttribute('data-type');
            if (!type || PANEL_TYPES.indexOf(type) === -1) return;

            // 排除点击文件夹（file-explorer 的文件夹用于展开/折叠）
            if (target.closest('.nav-folder-title')) return;

            // 取文件路径：优先 [data-path]（文件项/搜索结果），其次 a.internal-link（入链/出链文本链接）
            let path = null;
            const pathEl = target.closest('[data-path]');
            if (pathEl) {
                path = pathEl.getAttribute('data-path');
            } else {
                const link = target.closest('a.internal-link');
                if (link) path = link.getAttribute('data-href') || link.getAttribute('href');
            }
            if (!path) return;

            evt.preventDefault();
            evt.stopPropagation();

            // 解析相对链接/别名为真实路径
            const activeFile = plugin.app.workspace.getActiveFile();
            const sourcePath = activeFile ? activeFile.path : '';
            const resolved = plugin.resolveLinkPath(path, sourcePath) || path;

            plugin.app.workspace.openLinkText(resolved, sourcePath, true);
        }, true);  // 捕获阶段，先于面板默认点击处理
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 辅助方法：记录关闭的标签到历史
    // ─────────────────────────────────────────────────────────────────────────

    recordClosedTab(leaf) {
        // 自动归档/专注模式关闭的标签进入归档区，不再记入"最近关闭"
        if (this._autoArchivingLeafId && leaf.id === this._autoArchivingLeafId) return;
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
            
            // 去重：同路径只保留最新一条
            this.closedTabsHistory = this.closedTabsHistory.filter(r => r.path !== record.path);
            this.closedTabsHistory.unshift(record);
            
            // 容量限制：最多保留 30 条
            if (this.closedTabsHistory.length > 30) {
                this.closedTabsHistory = this.closedTabsHistory.slice(0, 30);
            }
        } catch (e) {
            console.error("Tab Settings Enhanced: 记录关闭历史失败", e);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 辅助方法：从路径提取父文件夹名
    // ─────────────────────────────────────────────────────────────────────────

    extractParentFolder(path) {
        if (!path) return '';
        const parts = path.split('/');
        if (parts.length < 2) return '';
        return parts[parts.length - 2] || '';
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 辅助方法：解析链接路径
    // ─────────────────────────────────────────────────────────────────────────

    resolveLinkPath(linktext, sourcePath) {
        try {
            // 移除链接中的 # 锚点和 | 显示文本
            let cleanLink = linktext.split('#')[0].split('|')[0].trim();
            
            // 使用 Obsidian 的 metadataCache 解析链接
            const file = this.app.metadataCache.getFirstLinkpathDest(cleanLink, sourcePath);
            if (file) {
                return file.path;
            }
            
            // 如果没找到，尝试直接匹配
            return cleanLink;
        } catch (e) {
            console.error("Tab Settings Enhanced: 解析链接失败", e);
            return null;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 辅助方法：查找已打开的标签
    // ─────────────────────────────────────────────────────────────────────────

    findExistingLeaf(filePath) {
        let foundLeaf = null;
        
        // 修复: 只在主编辑区（rootSplit）中查找，避免命中侧边栏 leaf
        // 原来用 iterateAllLeaves 会遍历侧边栏/浮动窗口，若文件在侧边栏也有打开，
        // 会返回侧边栏 leaf，随后 Focus Lock 会把焦点拉回主编辑区，导致"点了没反应"
        const mainLeaves = this.getMainLeaves();
        for (const leaf of mainLeaves) {
            if (foundLeaf) break;
            const viewState = leaf.getViewState();
            if (viewState && viewState.state && viewState.state.file) {
                if (viewState.state.file === filePath) {
                    foundLeaf = leaf;
                }
            }
        }
        
        return foundLeaf;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 功能1：标签切换/移动快捷键
    // ═══════════════════════════════════════════════════════════════════════════

    // 判断 leaf 是否属于主编辑区（含 popout 弹出窗口），而非侧边栏
    // 修复：原实现 `getRoot() === rootSplit` 把 popout 浮动窗口误判为侧边栏，
    //       焦点锁定开启时点击弹出窗口会被抢回焦点
    isMainLeaf(leaf) {
        if (!leaf) return false;
        try {
            const root = leaf.getRoot();
            if (root === this.app.workspace.rootSplit) return true;
            // 侧边栏 dock（左/右）一定不是主编辑区
            if (root === this.app.workspace.leftSplit || root === this.app.workspace.rightSplit) return false;
            if (typeof obsidian.WorkspaceSidedock !== 'undefined' && root instanceof obsidian.WorkspaceSidedock) return false;
            // 其余（含 popout 窗口的 WorkspaceRoot）按主编辑区处理
            return true;
        } catch (e) {
            return false;
        }
    }

    // 收集主编辑区所有 leaf（递归遍历 split 树）
    getMainLeaves() {
        const leaves = [];
        const collect = (split) => {
            if (!split) return;
            if (split.children) {
                for (const child of split.children) {
                    if (child.type === 'leaf') leaves.push(child);
                    else if (child.children) collect(child);
                }
            }
        };
        collect(this.app.workspace.rootSplit);
        return leaves;
    }

    // 有序主标签：固定标签在前（保持原顺序），普通标签在后（保持原顺序）
    getOrderedMainLeaves() {
        const leaves = this.getMainLeaves().filter(l => l.view);
        const pinned = leaves.filter(l => l.pinned);
        const normal = leaves.filter(l => !l.pinned);
        return [...pinned, ...normal];
    }

    activateLeaf(leaf) {
        if (!leaf || !leaf.view) return;
        this.app.workspace.setActiveLeaf(leaf, { focus: true });
    }

    // 跳转到第 index 个标签（0 基）
    jumpToTabByIndex(index) {
        const leaves = this.getOrderedMainLeaves();
        if (index >= 0 && index < leaves.length) {
            this.activateLeaf(leaves[index]);
        }
    }

    // 跳转到最后一个标签
    jumpToLastTab() {
        const leaves = this.getOrderedMainLeaves();
        if (leaves.length > 0) {
            this.activateLeaf(leaves[leaves.length - 1]);
        }
    }

    // 在有序标签列表中前进/后退（循环）
    navigateTab(delta) {
        const leaves = this.getOrderedMainLeaves();
        if (leaves.length === 0) return;
        const active = this.app.workspace.activeLeaf;
        let idx = leaves.indexOf(active);
        if (idx === -1) idx = delta > 0 ? -1 : 0;  // 当前不在主区：从头/尾进入
        const next = (idx + delta + leaves.length) % leaves.length;
        this.activateLeaf(leaves[next]);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 功能2：每标签独立导航历史（Per-Tab History）
    // ═══════════════════════════════════════════════════════════════════════════

    // 获取 leaf 当前打开的文件路径
    getLeafCurrentFile(leaf) {
        try {
            const vs = leaf.getViewState();
            return (vs && vs.state && vs.state.file) || null;
        } catch (e) {
            return null;
        }
    }

    // 读取内置 leaf.history 的前进/后退计数（复用 Obsidian 原生历史栈，v0.16.3+）
    getLeafHistoryCounts(leaf) {
        if (!leaf || !leaf.history) return { back: 0, forward: 0 };
        const h = leaf.history;
        // 兼容不同版本：优先 backHistory/forwardHistory，回退 back/forward
        const backArr = h.backHistory || h.back;
        const fwdArr = h.forwardHistory || h.forward;
        const back = Array.isArray(backArr) ? backArr.length : 0;
        const forward = Array.isArray(fwdArr) ? fwdArr.length : 0;
        return { back, forward };
    }

    // 后退：直接执行 Obsidian 内置命令（与 Ctrl+Alt+← 完全一致，共享同一历史栈）
    goBackInActiveTab() {
        if (!this.settings.enableMouseSideNav) return;
        const leaf = this.app.workspace.activeLeaf;
        if (!(leaf && this.isMainLeaf(leaf))) return;
        this.app.commands.executeCommandById('app:go-back');
        setTimeout(() => this.updateTabHistoryBadges(), 100);
    }

    // 前进：直接执行 Obsidian 内置命令（与 Ctrl+Alt+→ 完全一致）
    goForwardInActiveTab() {
        if (!this.settings.enableMouseSideNav) return;
        const leaf = this.app.workspace.activeLeaf;
        if (!(leaf && this.isMainLeaf(leaf))) return;
        this.app.commands.executeCommandById('app:go-forward');
        setTimeout(() => this.updateTabHistoryBadges(), 100);
    }

    // 获取某标签的历史计数（按 leafId，供标签导航器联动使用）
    getTabHistoryCounts(leafId) {
        const leaf = this.getLeafById(leafId);
        return this.getLeafHistoryCounts(leaf);
    }

    // 在每个视图头部的【原生 返回/前进 按钮】旁渲染历史计数（如 [←]3 [→]1）
    updateTabHistoryBadges() {
        if (!this.settings.historyShowCount) {
            this.removeAllHistoryBadges();
            return;
        }
        const leaves = this.getMainLeaves();
        for (const leaf of leaves) {
            let headerEl = null;
            try { headerEl = leaf.view && leaf.view.headerEl; } catch (e) {}
            if (!headerEl) continue;  // 视图标题栏隐藏时无原生按钮，跳过
            const leftEl = headerEl.querySelector('.view-header-left');
            if (!leftEl) continue;

            const counts = this.getLeafHistoryCounts(leaf);
            // 原生 返回(back)=lucide-arrow-left，前进(forward)=lucide-arrow-right
            const backBtn = this._findNavButton(leftEl, 'lucide-arrow-left');
            const fwdBtn = this._findNavButton(leftEl, 'lucide-arrow-right');

            this._setNavCount(backBtn, 'tse-back-count', counts.back);
            this._setNavCount(fwdBtn, 'tse-forward-count', counts.forward);
        }
    }

    // 在容器内按 lucide 图标 class 查找原生导航按钮
    _findNavButton(containerEl, iconClass) {
        const svg = containerEl.querySelector('svg.' + iconClass);
        if (!svg) return null;
        return svg.closest('.clickable-icon') || svg.closest('.view-header-icon') || svg.parentElement;
    }

    // 在按钮旁设置计数 span（0 也显示数字）
    _setNavCount(btnEl, cls, count) {
        if (!btnEl || !btnEl.parentElement) return;
        let span = btnEl.parentElement.querySelector(':scope > .' + cls);
        if (!span) {
            span = document.createElement('span');
            span.className = 'tse-hist-count ' + cls;
            btnEl.insertAdjacentElement('afterend', span);
        }
        span.textContent = String(count);
    }

    removeAllHistoryBadges() {
        document.querySelectorAll('.tse-hist-count').forEach(el => el.remove());
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 功能3：自动归档（Auto-Archive）+ 专注模式
    // ═══════════════════════════════════════════════════════════════════════════

    // 每分钟由定时器调用：归档闲置超时的非固定标签
    checkAutoArchive() {
        if (!this.settings.enableAutoArchive) return;
        const timeoutMs = (this.settings.autoArchiveTimeout || 30) * 60 * 1000;
        const now = Date.now();
        const active = this.app.workspace.activeLeaf;
        const leaves = this.getMainLeaves();
        for (const leaf of leaves) {
            if (!leaf.view) continue;
            if (leaf.pinned) continue;                 // 跳过固定标签
            if (active && leaf === active) continue;   // 跳过当前活动标签
            if (!this.getLeafCurrentFile(leaf)) continue;  // 跳过无文件视图
            const lastActive = this.tabLastActive.get(leaf.id) || now;
            if (now - lastActive >= timeoutMs) {
                this.archiveLeaf(leaf);
            }
        }
    }

    // 将标签关闭并加入归档区
    // deferSave=true 时跳过落盘（批量场景由调用方统一保存，避免 N 个标签写 N 次盘）
    archiveLeaf(leaf, deferSave = false) {
        const path = this.getLeafCurrentFile(leaf);
        if (!path) return;
        const file = this.app.vault.getAbstractFileByPath(path);
        if (!file) return;

        const record = {
            path: file.path,
            name: file.basename || file.name,
            basename: file.name,
            extension: file.extension || '',
            timestamp: Date.now()
        };
        // 去重：同路径只保留最新一条
        this.archivedTabs = this.archivedTabs.filter(r => r.path !== record.path);
        this.archivedTabs.unshift(record);
        const max = this.settings.autoArchiveMaxHistory || 100;
        if (this.archivedTabs.length > max) {
            this.archivedTabs = this.archivedTabs.slice(0, max);
        }

        // 标记，避免 recordClosedTab 把它重复记入"最近关闭"
        this._autoArchivingLeafId = leaf.id;
        leaf.detach();
        this._autoArchivingLeafId = null;

        if (!deferSave) this.saveSettings();  // 持久化归档区
        console.log("Tab Settings Enhanced: 已归档 -", path);
    }

    // 专注模式：一键关闭所有非固定标签（全部进入归档区）
    focusModeCloseUnpinned() {
        if (!this.settings.enableFocusMode) return;  // 专注模式已禁用
        const leaves = this.getMainLeaves().filter(l =>
            l.view && !l.pinned && this.getLeafCurrentFile(l)
        );
        for (const leaf of leaves) {
            this.archiveLeaf(leaf, true);  // 批量归档，跳过逐个落盘
        }
        if (leaves.length > 0) this.saveSettings();  // 统一落盘一次
    }

    // 从归档区恢复标签：移除归档记录并重新打开
    restoreArchivedTab(path) {
        this.archivedTabs = this.archivedTabs.filter(r => r.path !== path);
        this.saveSettings();
        this.app.workspace.openLinkText(path, '', true);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 功能4：焦点锁定（Focus Lock）
    // ═══════════════════════════════════════════════════════════════════════════

    setupFocusLockStatusBar() {
        if (!this.settings.enableFocusLock) return;
        this.statusBarItem = this.addStatusBarItem();
        this.statusBarItem.addClass('tse-focus-lock-item');
        this.statusBarItem.style.cursor = 'pointer';
        this.statusBarItem.addEventListener('click', () => this.toggleFocusLock());
        this.updateFocusLockStatusBar();
    }

    updateFocusLockStatusBar() {
        if (!this.statusBarItem) return;
        const lang = this.settings.language === 'auto' ? detectObsidianLanguage() : this.settings.language;
        const on = this.settings.focusLockOn;

        // 使用 lucide SVG 图标（比 emoji 更精致、风格统一）
        // 锁定 = locate-fixed（焦点已定位锁定），未锁定 = locate-off；失败回退 lock/lock-open
        const primary = on ? 'locate-fixed' : 'locate-off';
        const fallback = on ? 'lock' : 'lock-open';
        obsidian.setIcon(this.statusBarItem, primary);
        const svg = this.statusBarItem.querySelector('svg');
        if (!svg || svg.childElementCount === 0) {
            obsidian.setIcon(this.statusBarItem, fallback);
        }
        // 锁定态高亮，未锁定态弱化
        this.statusBarItem.style.opacity = on ? '1' : '0.55';
        this.statusBarItem.style.color = on ? 'var(--text-accent)' : '';

        const tip = on ? t('focusLockOnTip', lang) : t('focusLockOffTip', lang);
        this.statusBarItem.setAttribute('aria-label', tip);
        this.statusBarItem.title = tip;
    }

    removeFocusLockStatusBar() {
        if (this.statusBarItem) {
            this.statusBarItem.remove();
            this.statusBarItem = null;
        }
    }

    async toggleFocusLock() {
        this.settings.focusLockOn = !this.settings.focusLockOn;
        await this.saveSettings();
        this.updateFocusLockStatusBar();
    }

    // 当焦点锁定开启且激活到侧边栏时，把焦点拉回主编辑区（不偷走编辑器焦点）
    handleFocusLockSidebar(leaf) {
        if (!this.settings.enableFocusLock || !this.settings.focusLockOn) return;
        setTimeout(() => {
            // 用户正在侧边栏输入框中输入时不打断
            const ae = document.activeElement;
            if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable)) {
                return;
            }
            if (this.lastMainLeaf && this.lastMainLeaf.view) {
                this.app.workspace.setActiveLeaf(this.lastMainLeaf, { focus: true });
                const view = this.lastMainLeaf.view;
                if (view && view.editor && view.editor.focus) {
                    view.editor.focus();
                }
            }
        }, 0);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 禅模式（Zen Mode）：隐藏所有无关 UI，全屏专注写作
    // ═══════════════════════════════════════════════════════════════════════════

    toggleZenMode() {
        // 禅模式已禁用：确保退出并忽略
        if (!this.settings.enableZenMode) {
            if (this.zenModeActive) {
                this.zenModeActive = false;
                document.body.classList.remove('tse-zen-mode');
            }
            return;
        }
        this.zenModeActive = !this.zenModeActive;
        if (this.zenModeActive) {
            document.body.classList.add('tse-zen-mode');
            // 进入禅模式时把焦点放回当前编辑器
            const leaf = this.app.workspace.activeLeaf;
            if (leaf && leaf.view && leaf.view.editor && leaf.view.editor.focus) {
                leaf.view.editor.focus();
            }
        } else {
            document.body.classList.remove('tse-zen-mode');
        }
        console.log("Tab Settings Enhanced: 禅模式", this.zenModeActive ? "开启" : "退出");
    }

    // 根据 enableZenMode 开关控制左侧 Ribbon 羽毛笔图标显隐
    updateZenRibbonVisibility() {
        if (this.zenRibbonEl) {
            this.zenRibbonEl.style.display = this.settings.enableZenMode ? '' : 'none';
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 标签页右键菜单注入（专注模式 / 禅模式）
    // ═══════════════════════════════════════════════════════════════════════════

    _getLang() {
        return this.settings.language === 'auto' ? detectObsidianLanguage() : this.settings.language;
    }

    // 监听标签头右键，等原生菜单弹出后注入自定义菜单项
    setupTabContextMenu() {
        this.registerDomEvent(document, 'contextmenu', (evt) => {
            const target = evt.target;
            if (!target || !target.closest) return;
            // 只在标签头（.workspace-tab-header）上右键时处理
            if (!target.closest('.workspace-tab-header')) return;
            // 原���菜单在同一事件循环内显示，延迟一拍等其渲染完成
            setTimeout(() => {
                const menus = document.querySelectorAll('.menu');
                if (!menus.length) return;
                const menuEl = menus[menus.length - 1];
                if (!menuEl) return;
                if (menuEl.querySelector('.tse-tab-menu-item')) return;  // 防重复注入
                this.injectTabMenuItems(menuEl);
            }, 0);
        }, false);  // 冒泡阶段：让原生 handler 先构建菜单
    }

    // 往原生标签菜单 DOM 注入"专注模式/禅模式"项（显隐受功能开关控制）
    injectTabMenuItems(menuEl) {
        const lang = this._getLang();
        const items = [];
        if (this.settings.enableFocusMode) {
            items.push({ icon: 'crosshair', title: t('focusMode', lang), action: () => this.focusModeCloseUnpinned() });
        }
        if (this.settings.enableZenMode) {
            items.push({ icon: 'feather', title: t('zenMode', lang), action: () => this.toggleZenMode() });
        }
        if (items.length === 0) return;

        // 分隔线
        const sep = document.createElement('div');
        sep.className = 'menu-separator tse-tab-menu-item';
        menuEl.appendChild(sep);

        for (const def of items) {
            menuEl.appendChild(this._makeMenuItem(def.icon, def.title, def.action, menuEl));
        }
    }

    // 构建一个 Obsidian 原生风格的菜单项（含图标+标题，hover 高亮由 .menu-item 自带）
    _makeMenuItem(icon, title, action, menuEl) {
        const item = document.createElement('div');
        item.className = 'menu-item tse-tab-menu-item';
        item.style.cursor = 'pointer';

        const iconEl = document.createElement('div');
        iconEl.className = 'menu-item-icon';
        obsidian.setIcon(iconEl, icon);

        const titleEl = document.createElement('div');
        titleEl.className = 'menu-item-title';
        titleEl.textContent = title;

        item.appendChild(iconEl);
        item.appendChild(titleEl);

        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (menuEl && menuEl.parentElement) menuEl.remove();  // 点击后关闭菜单
            action();
        });
        return item;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 设置面板
// ═══════════════════════════════════════════════════════════════════════════════

class TabSettingsSettingTab extends obsidian.PluginSettingTab {
    
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    getLang() {
        if (this.plugin.settings.language === 'auto') {
            return detectObsidianLanguage();
        }
        return this.plugin.settings.language;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();
        const lang = this.getLang();
        
        containerEl.createEl('h2', { text: t('pluginTitle', lang) });
        containerEl.createEl('p', { 
            text: t('pluginDesc', lang),
            cls: 'setting-item-description'
        });

        // ─── 语言设置 ─────────────────────────────────────────────────────
        containerEl.createEl('h3', { text: t('langSection', lang) });

        new obsidian.Setting(containerEl)
            .setName(t('langName', lang))
            .setDesc(t('langDesc', lang))
            .addDropdown(dropdown => {
                dropdown.addOption('auto', t('langAuto', lang));
                dropdown.addOption('zh', '中文');
                dropdown.addOption('en', 'English');
                dropdown.setValue(this.plugin.settings.language);
                dropdown.onChange(async (value) => {
                    this.plugin.settings.language = value;
                    await this.plugin.saveSettings();
                    this.display();  // 刷新界面
                });
            });

        // ─── 标签颜色设置 ─────────────────────────────────────────────────
        containerEl.createEl('h3', { text: t('colorSection', lang) });

        new obsidian.Setting(containerEl)
            .setName(t('colorEnable', lang))
            .setDesc(t('colorEnableDesc', lang))
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.enableTabColors);
                toggle.onChange(async (value) => {
                    this.plugin.settings.enableTabColors = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateTabColors();
                });
            });

        new obsidian.Setting(containerEl)
            .setName(t('colorPalette', lang))
            .setDesc(t('colorPaletteDesc', lang))
            .addDropdown(dropdown => {
                for (const [value, label] of Object.entries(COLOR_PALETTE_OPTIONS)) {
                    dropdown.addOption(value, label);
                }
                dropdown.setValue(this.plugin.settings.colorPalette);
                dropdown.onChange(async (value) => {
                    this.plugin.settings.colorPalette = value;
                    this.plugin.colorIndex = 0;
                    this.plugin.rootLeafColors.clear();
                    await this.plugin.saveSettings();
                    this.plugin.updateTabColors();
                });
            });

        new obsidian.Setting(containerEl)
            .setName(t('colorOpacity', lang))
            .setDesc(t('colorOpacityDesc', lang))
            .addSlider(slider => {
                slider.setLimits(0.1, 1.0, 0.1);
                slider.setValue(this.plugin.settings.colorOpacity);
                slider.setDynamicTooltip();
                slider.onChange(async (value) => {
                    this.plugin.settings.colorOpacity = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateTabColors();
                });
            });

        // ─── 新标签位置设置 ───────────────────────────────────────────────
        containerEl.createEl('h3', { text: t('placementSection', lang) });

        new obsidian.Setting(containerEl)
            .setName(t('placementName', lang))
            .setDesc(t('placementDesc', lang))
            .addDropdown(dropdown => {
                dropdown.addOption('after-parent', t('afterParent', lang));
                dropdown.addOption('before-parent', t('beforeParent', lang));
                dropdown.addOption('first', t('first', lang));
                dropdown.addOption('last', t('last', lang));
                dropdown.addOption('after-pinned', t('afterPinned', lang));
                dropdown.setValue(this.plugin.settings.newTabPlacement);
                dropdown.onChange(async (value) => {
                    this.plugin.settings.newTabPlacement = value;
                    await this.plugin.saveSettings();
                });
            });

        new obsidian.Setting(containerEl)
            .setName(t('openNewTab', lang))
            .setDesc(t('openNewTabDesc', lang))
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.openInNewTab);
                toggle.onChange(async (value) => {
                    this.plugin.settings.openInNewTab = value;
                    await this.plugin.saveSettings();
                });
            });

        new obsidian.Setting(containerEl)
            .setName(t('openQuickSwitchInNewTab', lang))
            .setDesc(t('openQuickSwitchInNewTabDesc', lang))
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.openQuickSwitchInNewTab);
                toggle.onChange(async (value) => {
                    this.plugin.settings.openQuickSwitchInNewTab = value;
                    await this.plugin.saveSettings();
                });
            });

        new obsidian.Setting(containerEl)
            .setName(t('openPanelLinkInNewTab', lang))
            .setDesc(t('openPanelLinkInNewTabDesc', lang))
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.openPanelLinkInNewTab);
                toggle.onChange(async (value) => {
                    this.plugin.settings.openPanelLinkInNewTab = value;
                    await this.plugin.saveSettings();
                });
            });



        // ─── 关闭标签激活设置 ─────────────────────────────────────────────
        containerEl.createEl('h3', { text: t('closeSection', lang) });

        new obsidian.Setting(containerEl)
            .setName(t('closeName', lang))
            .setDesc(t('closeDesc', lang))
            .addDropdown(dropdown => {
                dropdown.addOption('parent', t('parent', lang));
                dropdown.addOption('left', t('left', lang));
                dropdown.addOption('right', t('right', lang));
                dropdown.addOption('recent', t('recent', lang));
                dropdown.addOption('first', t('firstTab', lang));
                dropdown.addOption('last', t('lastTab', lang));
                dropdown.setValue(this.plugin.settings.closeTabActivation);
                dropdown.onChange(async (value) => {
                    this.plugin.settings.closeTabActivation = value;
                    await this.plugin.saveSettings();
                });
            });

        // ─── 其他设置 ─────────────────────────────────────────────────────
        containerEl.createEl('h3', { text: t('otherSection', lang) });

        new obsidian.Setting(containerEl)
            .setName(t('deduplicate', lang))
            .setDesc(t('deduplicateDesc', lang))
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.deduplicateTabs);
                toggle.onChange(async (value) => {
                    this.plugin.settings.deduplicateTabs = value;
                    await this.plugin.saveSettings();
                });
            });

        // ─── 每标签导航历史 ───────────────────────────────────────────
        containerEl.createEl('h3', { text: t('perTabHistorySection', lang) });

        new obsidian.Setting(containerEl)
            .setName(t('mouseSideNavEnable', lang))
            .setDesc(t('mouseSideNavEnableDesc', lang))
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.enableMouseSideNav);
                toggle.onChange(async (value) => {
                    this.plugin.settings.enableMouseSideNav = value;
                    await this.plugin.saveSettings();
                });
            });

        new obsidian.Setting(containerEl)
            .setName(t('historyShowCount', lang))
            .setDesc(t('historyShowCountDesc', lang))
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.historyShowCount);
                toggle.onChange(async (value) => {
                    this.plugin.settings.historyShowCount = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateTabHistoryBadges();
                });
            });

        // ─── 自动归档 ─────────────────────────────────────────────────
        containerEl.createEl('h3', { text: t('autoArchiveSection', lang) });

        new obsidian.Setting(containerEl)
            .setName(t('autoArchiveEnable', lang))
            .setDesc(t('autoArchiveEnableDesc', lang))
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.enableAutoArchive);
                toggle.onChange(async (value) => {
                    this.plugin.settings.enableAutoArchive = value;
                    await this.plugin.saveSettings();
                });
            });

        new obsidian.Setting(containerEl)
            .setName(t('autoArchiveTimeout', lang))
            .setDesc(t('autoArchiveTimeoutDesc', lang))
            .addSlider(slider => {
                slider.setLimits(1, 120, 1);
                slider.setValue(this.plugin.settings.autoArchiveTimeout);
                slider.setDynamicTooltip();
                slider.onChange(async (value) => {
                    this.plugin.settings.autoArchiveTimeout = value;
                    await this.plugin.saveSettings();
                });
            });

        new obsidian.Setting(containerEl)
            .setName(t('autoArchiveMaxHistory', lang))
            .setDesc(t('autoArchiveMaxHistoryDesc', lang))
            .addSlider(slider => {
                slider.setLimits(10, 500, 10);
                slider.setValue(this.plugin.settings.autoArchiveMaxHistory);
                slider.setDynamicTooltip();
                slider.onChange(async (value) => {
                    this.plugin.settings.autoArchiveMaxHistory = value;
                    await this.plugin.saveSettings();
                });
            });

        // 专注模式开关（关闭后命令/右键菜单不可用）
        new obsidian.Setting(containerEl)
            .setName(t('focusModeEnable', lang))
            .setDesc(t('focusModeEnableDesc', lang))
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.enableFocusMode);
                toggle.onChange(async (value) => {
                    this.plugin.settings.enableFocusMode = value;
                    await this.plugin.saveSettings();
                });
            });

        // ─── 焦点锁定 ─────────────────────────────────────────────────
        containerEl.createEl('h3', { text: t('focusLockSection', lang) });

        new obsidian.Setting(containerEl)
            .setName(t('focusLockEnable', lang))
            .setDesc(t('focusLockEnableDesc', lang))
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.enableFocusLock);
                toggle.onChange(async (value) => {
                    this.plugin.settings.enableFocusLock = value;
                    await this.plugin.saveSettings();
                    if (value) {
                        this.plugin.setupFocusLockStatusBar();
                    } else {
                        this.plugin.removeFocusLockStatusBar();
                    }
                });
            });

        // 焦点锁定开关（与状态栏图标双向联动）
        new obsidian.Setting(containerEl)
            .setName(t('focusLockOn', lang))
            .setDesc(t('focusLockOnDesc', lang))
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.focusLockOn);
                toggle.onChange(async (value) => {
                    this.plugin.settings.focusLockOn = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateFocusLockStatusBar();  // 同步状态栏图标
                });
            });

        // ─── 禅模式 ─────────────────────────────────────────────────
        containerEl.createEl('h3', { text: t('zenModeSection', lang) });

        new obsidian.Setting(containerEl)
            .setName(t('zenModeEnable', lang))
            .setDesc(t('zenModeEnableDesc', lang))
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.enableZenMode);
                toggle.onChange(async (value) => {
                    this.plugin.settings.enableZenMode = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateZenRibbonVisibility();  // 同步羽毛笔图标显隐
                    if (!value) this.plugin.toggleZenMode();  // 关闭时若在禅模式则退出
                });
            });

        // ─── 快捷键 ─────────────────────────────────────────────────
        containerEl.createEl('h3', { text: t('hotkeysSection', lang) });

        containerEl.createEl('p', {
            text: t('hotkeysDesc', lang),
            cls: 'setting-item-description'
        });

        // 命令快捷键一览
        const hotkeyList = [
            { name: t('tabNavigatorCmd', lang), keys: 'Alt + T' },
            { name: t('jumpToTabPrefix', lang) + '1 ~ 8', keys: 'Alt + 1 ~ 8' },
            { name: t('jumpToLastTab', lang), keys: 'Alt + 9' },
            { name: t('prevTab', lang) + ' / ' + t('nextTab', lang), keys: 'Alt + ← / →' },
            { name: t('historyBack', lang) + ' / ' + t('historyForward', lang), keys: t('hotkeyMouseSide', lang) },
            { name: t('focusMode', lang), keys: t('hotkeyNone', lang) },
            { name: t('zenMode', lang), keys: t('hotkeyNone', lang) },
        ];
        const listEl = containerEl.createDiv({ cls: 'tse-hotkey-list' });
        listEl.style.cssText = 'margin:8px 0 12px; border:1px solid var(--background-modifier-border); border-radius:8px; overflow:hidden;';
        hotkeyList.forEach((hk, idx) => {
            const row = listEl.createDiv();
            row.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:8px 14px; font-size:13px;' +
                (idx < hotkeyList.length - 1 ? ' border-bottom:1px solid var(--background-modifier-border);' : '') +
                (idx % 2 === 0 ? ' background:var(--background-secondary-alt);' : '');
            const nameEl = row.createDiv({ text: hk.name });
            nameEl.style.cssText = 'color:var(--text-normal);';
            const keysEl = row.createDiv({ text: hk.keys });
            keysEl.style.cssText = 'color:var(--text-accent); font-family:monospace; font-size:12px; background:var(--background-modifier-border); padding:2px 10px; border-radius:5px; white-space:nowrap;';
        });

        // 打开快捷键设置按钮
        new obsidian.Setting(containerEl)
            .addButton(btn => {
                btn.setButtonText(t('openHotkeysSettings', lang))
                    .setCta()
                    .onClick(() => {
                        try {
                            this.app.setting.open();
                            this.app.setting.openTabById('hotkeys');
                        } catch (e) {
                            console.error('Tab Settings Enhanced: 打开快捷键设置失败', e);
                        }
                    });
            });

        // ─── 捐赠支持 ─────────────────────────────────────────────────────
        containerEl.createEl('h3', { text: t('supportSection', lang) });
        
        // 主容器 - 超美渐变背景
        const donationDiv = containerEl.createEl('div', {
            cls: 'tab-settings-donation'
        });
        
        donationDiv.style.cssText = `
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 25%, #f39c12 50%, #e74c3c 75%, #c0392b 100%);
            background-size: 300% 300%;
            animation: gradientFlow 8s ease infinite;
            border-radius: 16px;
            padding: 30px 20px;
            text-align: center;
            margin: 15px 0;
            box-shadow: 0 8px 32px rgba(255, 107, 107, 0.35);
            position: relative;
            overflow: hidden;
        `;
        
        // 添加动画样式
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            @keyframes gradientFlow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes heartbeat {
                0%, 100% { transform: scale(1); }
                25% { transform: scale(1.2); }
                50% { transform: scale(1); }
                75% { transform: scale(1.15); }
            }
            @keyframes sparkle {
                0%, 100% { opacity: 0; transform: scale(0); }
                50% { opacity: 1; transform: scale(1); }
            }
        `;
        donationDiv.appendChild(styleEl);
        
        // 心跳动画图标
        const heartIcon = donationDiv.createEl('div', { text: '💝' });
        heartIcon.style.cssText = `
            font-size: 56px; 
            margin-bottom: 15px; 
            animation: heartbeat 1.5s ease-in-out infinite;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        `;
        
        // 闪烁星星装饰
        const stars = donationDiv.createEl('div');
        stars.innerHTML = '✨';
        stars.style.cssText = `position: absolute; top: 15px; right: 20px; font-size: 24px; animation: sparkle 2s ease-in-out infinite;`;
        
        const stars2 = donationDiv.createEl('div');
        stars2.innerHTML = '⭐';
        stars2.style.cssText = `position: absolute; top: 25px; left: 25px; font-size: 20px; animation: sparkle 2s ease-in-out infinite 0.5s;`;
        
        // 主标题
        const donationTitle = donationDiv.createEl('div', { text: t('donationTitle', lang) });
        donationTitle.style.cssText = `color: white; font-size: 20px; font-weight: bold; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);`;
        
        // 副标题
        const donationSubtitle = donationDiv.createEl('div', { text: t('donationSubtitle', lang) });
        donationSubtitle.style.cssText = `color: rgba(255,255,255,0.95); font-size: 14px; margin-bottom: 20px; text-shadow: 0 1px 2px rgba(0,0,0,0.2);`;
        
        // 按钮容器
        const buttonContainer = donationDiv.createEl('div');
        buttonContainer.style.cssText = `display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;`;
        
        // 爱发电按钮
        const afdianButton = buttonContainer.createEl('a', { text: '⚡ 爱发电 | Afdian', href: 'https://afdian.com/a/wondermax' });
        afdianButton.style.cssText = `display: inline-block; background: linear-gradient(135deg, #946CE6 0%, #7B5FC8 100%); color: #FFFFFF; padding: 14px 28px; border-radius: 50px; font-weight: bold; font-size: 15px; text-decoration: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 15px rgba(148, 108, 230, 0.4); border: 2px solid rgba(255,255,255,0.3);`;
        afdianButton.addEventListener('mouseenter', () => { afdianButton.style.transform = 'translateY(-3px) scale(1.05)'; afdianButton.style.boxShadow = '0 8px 25px rgba(148, 108, 230, 0.5)'; });
        afdianButton.addEventListener('mouseleave', () => { afdianButton.style.transform = 'translateY(0) scale(1)'; afdianButton.style.boxShadow = '0 4px 15px rgba(148, 108, 230, 0.4)'; });
        
        // 分隔线
        const divider = donationDiv.createEl('div');
        divider.style.cssText = `width: 60%; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent); margin: 20px auto 15px;`;
        

        
        // 鼓励语
        const encouragement = donationDiv.createEl('div', { text: t('donationEncourage', lang) });
        encouragement.style.cssText = `color: rgba(255,255,255,0.7); font-size: 12px; font-style: italic;`;
        
        // 底部感谢语
        const thanks = containerEl.createEl('div');
        thanks.innerHTML = `<strong>${t('thanks', lang)}</strong>`;
        thanks.style.cssText = `text-align: center; color: var(--text-muted); font-size: 12px; margin-top: 20px; padding: 10px; background: var(--background-modifier-hover); border-radius: 8px;`;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 标签导航器模态框
// ═══════════════════════════════════════════════════════════════════════════════

class TabNavigatorModal extends obsidian.Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.query = '';
        this.selectedIndex = 0;
        this.allItems = [];
        this.filteredItems = [];
        this.searchInput = null;
        this.listEl = null;
        this.hintEl = null;
        this.keydownHandler = null;
        this.displayMode = 'normal';  // 'detailed' | 'normal' | 'compact'
        this.summaryCache = new Map();  // path -> summary string
        this.summaryLoadingPaths = new Set();  // 正在加载摘要的路径
        this.selectableItems = [];  // 实际渲染/键盘可选的项（filter() 中计算）
        this.keyMode = null;        // 序列快捷键模式：null | 'open' | 'close'
        this._modTapCandidate = null;  // 修饰键点按候选（keydown 记录，keyup 确认）
    }

    getLang() {
        if (this.plugin.settings.language === 'auto') {
            return detectObsidianLanguage();
        }
        return this.plugin.settings.language;
    }

    onOpen() {
        const lang = this.getLang();
        const { contentEl, modalEl } = this;
        
        modalEl.addClass('tab-navigator-modal');
        contentEl.empty();
        
        // ── 主体布局：左右双栏 ──────────────────────────────────
        // 左侧主区域（3/4）：搜索框 + 打开的标签列表
        // 右侧边栏（1/4）：最近关闭的标签（固定显示，不随搜索变化）
        
        const bodyEl = contentEl.createDiv({ cls: 'tab-navigator-body' });
        bodyEl.style.cssText = `
            display: flex;
            flex: 1;
            overflow: hidden;
            min-height: 0;
        `;
        
        // ── 左侧主区域 ──────────────────────────────────────────
        const mainEl = bodyEl.createDiv({ cls: 'tab-navigator-main' });
        mainEl.style.cssText = `
            flex: 3;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border-right: 1px solid var(--background-modifier-border);
        `;
        
        // 搜索框区域
        const searchContainer = mainEl.createDiv({ cls: 'tab-navigator-search' });
        this.searchInput = searchContainer.createEl('input', {
            type: 'text',
            placeholder: t('tabNavigatorSearch', lang),
            cls: 'tab-navigator-search-input'
        });
        this.searchInput.style.cssText = `
            width: 100%;
            padding: 10px 16px;
            border: 1px solid var(--background-modifier-border);
            border-radius: 8px;
            background: var(--background-primary);
            color: var(--text-normal);
            font-size: 15px;
            outline: none;
            box-sizing: border-box;
        `;
        
        // 左侧列表容器（打开的标签 + 搜索结果）
        this.listEl = mainEl.createDiv({ cls: 'tab-navigator-list' });
        
        // ── 右侧边栏：最近关闭 ──────────────────────────────────
        const sidebarEl = bodyEl.createDiv({ cls: 'tab-navigator-sidebar' });
        sidebarEl.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            min-width: 200px;
        `;
        
        // ── 归档区（位于最近关闭上方）─────────────────────────────
        const archiveSection = sidebarEl.createDiv({ cls: 'tab-navigator-archive-section' });
        const archiveTitle = archiveSection.createDiv({ cls: 'tab-navigator-archive-title' });
        archiveTitle.id = 'tab-navigator-archive-title';
        this.archiveListEl = archiveSection.createDiv({ cls: 'tab-navigator-archive-list' });

        // 侧边栏标题
        const sidebarTitle = sidebarEl.createDiv({ cls: 'tab-navigator-sidebar-title' });
        sidebarTitle.style.cssText = `
            padding: 14px 16px 8px;
            font-size: 11px;
            font-weight: 600;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid var(--background-modifier-border);
            flex-shrink: 0;
        `;
        sidebarTitle.textContent = `${t('tabNavigatorRecentClosed', lang)} (20)`;
        
        // 侧边栏列表容器
        this.sidebarListEl = sidebarEl.createDiv({ cls: 'tab-navigator-sidebar-list' });
        this.sidebarListEl.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 4px 0;
        `;
        
        // 底部提示（跨两栏）
        this.hintEl = contentEl.createDiv({ cls: 'tab-navigator-hint', text: t('tabNavigatorHint', lang) });
        
        // 构建数据并渲染
        this.buildItems();
        this.filter('');
        this.updateDisplayMode();
        this.render();
        this.renderSidebar();
        this.renderArchiveSection();
        
        // 如果是详细模式，异步加载摘要
        if (this.displayMode === 'detailed') {
            this.loadSummaries();
        }
        
        // 聚焦搜索框
        setTimeout(() => this.searchInput.focus(), 50);
        
        // 搜索输入事件
        this.searchInput.addEventListener('input', (evt) => {
            this.query = evt.target.value;
            this.filter(this.query);
            this.updateDisplayMode();
            this.render();
            // 侧边栏不随搜索变化，保持固定显示最近关闭
            if (this.displayMode === 'detailed') {
                this.loadSummaries();
            }
        });
        
        // 键盘事件（在捕获阶段处理，优先于输入框默认行为）
        this.keydownHandler = (evt) => this.onKeydown(evt);
        this.searchInput.addEventListener('keydown', this.keydownHandler, true);
        this.keyupHandler = (evt) => this.onKeyup(evt);
        this.searchInput.addEventListener('keyup', this.keyupHandler, true);
        
        // 监听工作区变化，自动刷新列表（标签打开/关闭/切换时）
        this.layoutChangeHandler = () => {
            // 防抖：避免频繁刷新
            clearTimeout(this._refreshTimer);
            this._refreshTimer = setTimeout(() => {
                if (!this.modalEl.isShown) return;
                this.buildItems();
                this.filter(this.query);
                this.updateDisplayMode();
                this.render();
                this.renderSidebar();
                this.renderArchiveSection();
                if (this.displayMode === 'detailed') {
                    this.loadSummaries();
                }
            }, 150);
        };
        this.app.workspace.on('active-leaf-change', this.layoutChangeHandler);
        this.plugin.registerEvent(this.app.workspace.on('layout-change', this.layoutChangeHandler));
        
        // 点击模态框背景关闭
        modalEl.addEventListener('click', (evt) => {
            if (evt.target === modalEl) this.close();
        });
    }

    onClose() {
        const { contentEl } = this;
        if (this.keydownHandler && this.searchInput) {
            this.searchInput.removeEventListener('keydown', this.keydownHandler, true);
        }
        if (this.keyupHandler && this.searchInput) {
            this.searchInput.removeEventListener('keyup', this.keyupHandler, true);
        }
        // 清理工作区事件监听
        if (this.layoutChangeHandler) {
            this.app.workspace.off('active-leaf-change', this.layoutChangeHandler);
            this.app.workspace.off('layout-change', this.layoutChangeHandler);
        }
        clearTimeout(this._refreshTimer);
        contentEl.empty();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 辅助方法：递归收集主工作区（rootSplit）下的所有 leaves
    // 排除侧边栏（leftSplit/rightSplit）和浮动窗口
    // ─────────────────────────────────────────────────────────────────────────

    collectRootLeaves(split, result) {
        if (!split) return;
        if (split.children) {
            for (const child of split.children) {
                if (child.type === 'leaf') {
                    result.push(child);
                } else if (child.children) {
                    this.collectRootLeaves(child, result);
                }
            }
        }
    }

    // 构建所有展示项（打开的标签 + 历史标签），按路径去重
    buildItems() {
        const openItems = [];
        const openPaths = new Set();
        const seenPaths = new Set();  // 用于去重
        
        // 收集打开的标签 — 使用 rootSplit 的 leaves（排除侧边栏），并按 path 去重
        const rootLeaves = [];
        this.collectRootLeaves(this.app.workspace.rootSplit, rootLeaves);
        
        for (const leaf of rootLeaves) {
            try {
                const viewState = leaf.getViewState();
                if (!viewState || !viewState.state) continue;
                const filePath = viewState.state.file;
                if (!filePath) continue;  // 跳过无文件的视图（如图形、日历等）
                
                // 按路径去重：同一文件在多个 pane 打开时只显示一次
                if (seenPaths.has(filePath)) continue;
                seenPaths.add(filePath);
                
                const file = this.app.vault.getAbstractFileByPath(filePath);
                if (!file) continue;
                
                openItems.push({
                    type: 'open',
                    leaf: leaf,
                    path: file.path,
                    name: file.basename || file.name,
                    basename: file.name,
                    extension: file.extension || '',
                    parentFolder: file.parent ? file.parent.name : '',
                    letter: null
                });
                openPaths.add(file.path);
            } catch (e) {
                // 跳过无法读取的 leaf
            }
        }
        
        // 收集历史标签（去重：已打开的不在历史区域显示）
        const historyItems = [];
        for (const record of this.plugin.closedTabsHistory) {
            if (openPaths.has(record.path)) continue;
            // 检查文件是否仍存在
            const file = this.app.vault.getAbstractFileByPath(record.path);
            if (!file) continue;
            
            historyItems.push({
                type: 'history',
                leaf: null,
                path: record.path,
                name: record.name,
                basename: record.basename,
                extension: record.extension,
                parentFolder: this.plugin.extractParentFolder(record.path),
                timestamp: record.timestamp,
                letter: null
            });
        }
        
        this.allItems = [...openItems, ...historyItems];
    }

    // 分配字母快捷键（a-z，最多 26 个）
    assignLetters() {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        this.filteredItems.forEach((item, index) => {
            item.letter = index < 26 ? letters[index] : null;
        });
    }

    // 搜索过滤
    filter(query) {
        const q = (query || '').toLowerCase().trim();
        if (!q) {
            this.filteredItems = [...this.allItems];
        } else {
            this.filteredItems = this.allItems.filter(item =>
                item.name.toLowerCase().includes(q) ||
                item.path.toLowerCase().includes(q) ||
                item.parentFolder.toLowerCase().includes(q)
            );
        }
        this.computeSelectableItems();
        this.assignLetters();
        this.selectedIndex = 0;
    }

    // 键盘可选/实际渲染的项：无查询时历史项不渲染（在右侧边栏），仅打开的标签可选；
    // 有查询时打开+历史都渲染。修复：原用 filteredItems 导致方向键能选中未渲染的历史项（"盲开"）
    computeSelectableItems() {
        if (this.query) {
            this.selectableItems = [...this.filteredItems];
        } else {
            this.selectableItems = this.filteredItems.filter(i => i.type === 'open');
        }
    }

    // 根据过滤后的【打开标签】数量决定显示模式
    updateDisplayMode() {
        // 只统计打开的标签数量（历史标签在右侧边栏，不影响左侧显示模式）
        const openCount = this.filteredItems.filter(i => i.type === 'open').length;
        if (openCount <= 6) {
            this.displayMode = 'detailed';    // 详细：标题+路径+摘要
        } else if (openCount <= 20) {
            this.displayMode = 'normal';      // 正常：标题+路径
        } else {
            this.displayMode = 'compact';     // 紧凑：仅标题
        }
        console.log(`Tab Settings Enhanced: 显示模式=${this.displayMode}, 打开标签数=${openCount}`);
    }

    // 异步加载摘要（仅在详细模式下调用）
    async loadSummaries() {
        const mdItems = this.filteredItems.filter(item => 
            item.extension === 'md' && !this.summaryCache.has(item.path) && !this.summaryLoadingPaths.has(item.path)
        );
        
        for (const item of mdItems) {
            this.summaryLoadingPaths.add(item.path);
        }
        
        for (const item of mdItems) {
            try {
                const file = this.app.vault.getAbstractFileByPath(item.path);
                if (!file) continue;
                const content = await this.app.vault.cachedRead(file);
                const summary = this.extractSummary(content);
                this.summaryCache.set(item.path, summary);
            } catch (e) {
                this.summaryCache.set(item.path, '');
            } finally {
                this.summaryLoadingPaths.delete(item.path);
            }
        }
        
        // 重新渲染以显示摘要
        this.render();
    }

    // 从文件内容提取摘要（前几行非空、非元数据的文本）
    extractSummary(content) {
        if (!content) return '';
        const lines = content.split('\n');
        const summaryLines = [];
        let inFrontmatter = false;
        let frontmatterClosed = false;
        
        for (let i = 0; i < lines.length && summaryLines.length < 3; i++) {
            const line = lines[i].trim();
            
            // 跳过 frontmatter
            if (i === 0 && line === '---') {
                inFrontmatter = true;
                continue;
            }
            if (inFrontmatter) {
                if (line === '---') {
                    inFrontmatter = false;
                    frontmatterClosed = true;
                }
                continue;
            }
            
            // 跳过空行
            if (!line) continue;
            
            // 跳过标题行（如果 frontmatter 后第一行是一级标题）
            if (frontmatterClosed && summaryLines.length === 0 && line.startsWith('#')) {
                frontmatterClosed = false;
                continue;
            }
            frontmatterClosed = false;
            
            // 跳过纯标记行
            if (line.startsWith('```') || line.startsWith('%%') || line.startsWith('|')) continue;
            
            // 移除 markdown 标记
            const cleanLine = line
                .replace(/^#+\s*/, '')
                .replace(/\*\*(.+?)\*\*/g, '$1')
                .replace(/\*(.+?)\*/g, '$1')
                .replace(/\[\[(.+?)(?:\|(.+?))?\]\]/g, (m, p1, p2) => p2 || p1)
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                .replace(/`([^`]+)`/g, '$1')
                .trim();
            
            if (cleanLine) {
                summaryLines.push(cleanLine);
            }
        }
        
        return summaryLines.join('  ·  ');
    }

    // 渲染列表（左侧主区域 — 仅显示打开的标签和搜索结果）
    render() {
        const lang = this.getLang();
        this.listEl.empty();
        
        // 左侧只显示打开的标签（历史标签在右侧边栏显示）
        const openItems = this.filteredItems.filter(i => i.type === 'open');
        const historyInSearch = this.filteredItems.filter(i => i.type === 'history');
        
        if (this.filteredItems.length === 0) {
            const empty = this.listEl.createDiv({
                cls: 'tab-navigator-empty',
                text: t('tabNavigatorEmpty', lang)
            });
            empty.style.cssText = `
                padding: 40px 16px;
                text-align: center;
                color: var(--text-muted);
                font-size: 14px;
            `;
            return;
        }
        
        // 分组：打开的标签
        if (openItems.length > 0) {
            this.listEl.createDiv({
                cls: 'tab-navigator-group-title',
                text: `${t('tabNavigatorOpenTabs', lang)} (${openItems.length})`
            });
            openItems.forEach((item) => {
                const globalIndex = (this.selectableItems || this.filteredItems).indexOf(item);
                this.renderItem(item, globalIndex);
            });
        }
        
        // 搜索结果中匹配的历史标签（仅在搜索时显示）
        if (historyInSearch.length > 0 && this.query) {
            this.listEl.createDiv({
                cls: 'tab-navigator-group-title',
                text: `${t('tabNavigatorRecentClosed', lang)} (${historyInSearch.length})`
            });
            historyInSearch.forEach((item) => {
                const globalIndex = (this.selectableItems || this.filteredItems).indexOf(item);
                this.renderItem(item, globalIndex);
            });
        }
    }

    // 渲染右侧边栏 — 最近关闭的 20 个标签（固定显示，不随搜索变化）
    renderSidebar() {
        const lang = this.getLang();
        if (!this.sidebarListEl) return;
        this.sidebarListEl.empty();
        
        // 获取最近关闭的 20 个标签（已按关闭时间倒序排列，最新在上）
        const recentClosed = this.plugin.closedTabsHistory.slice(0, 20);
        
        // 过滤掉已打开的标签（去重）— 使用 root leaves 而非 iterateAllLeaves
        const openPaths = new Set();
        const rootLeaves = [];
        this.collectRootLeaves(this.app.workspace.rootSplit, rootLeaves);
        for (const leaf of rootLeaves) {
            try {
                const viewState = leaf.getViewState();
                if (viewState && viewState.state && viewState.state.file) {
                    openPaths.add(viewState.state.file);
                }
            } catch (e) {}
        }
        
        const items = recentClosed
            .filter(r => !openPaths.has(r.path))
            .filter(r => this.app.vault.getAbstractFileByPath(r.path))  // 文件仍存在
            .slice(0, 20);
        
        if (items.length === 0) {
            const empty = this.sidebarListEl.createDiv({
                cls: 'tab-navigator-sidebar-empty',
                text: lang === 'zh' ? '暂无关闭历史' : 'No closed tabs'
            });
            empty.style.cssText = `
                padding: 30px 16px;
                text-align: center;
                color: var(--text-faint);
                font-size: 12px;
            `;
            return;
        }
        
        items.forEach((record, index) => {
            const itemEl = this.sidebarListEl.createDiv({ cls: 'tab-navigator-sidebar-item' });
            itemEl.style.cssText = `
                display: flex;
                align-items: center;
                padding: 7px 12px;
                cursor: pointer;
                gap: 8px;
                border-radius: 5px;
                margin: 1px 6px;
                transition: background 0.1s;
            `;
            
            // 关闭时间
            const timeEl = itemEl.createDiv({ cls: 'tab-nav-sidebar-time' });
            timeEl.style.cssText = `
                font-size: 10px;
                color: var(--text-faint);
                flex-shrink: 0;
                width: 36px;
                font-family: monospace;
            `;
            const date = new Date(record.timestamp);
            const hh = String(date.getHours()).padStart(2, '0');
            const mm = String(date.getMinutes()).padStart(2, '0');
            timeEl.textContent = `${hh}:${mm}`;
            
            // 文件图标
            const iconEl = itemEl.createDiv({ cls: 'tab-nav-sidebar-icon' });
            iconEl.style.cssText = `flex-shrink: 0; font-size: 12px;`;
            iconEl.textContent = this.getFileIcon(record.extension);
            
            // 标题
            const titleEl = itemEl.createDiv({ cls: 'tab-nav-sidebar-title' });
            titleEl.style.cssText = `
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 12px;
                color: var(--text-normal);
            `;
            titleEl.textContent = record.name;
            titleEl.title = record.path;
            
            // 恢复按钮
            const restoreEl = itemEl.createDiv({ cls: 'tab-nav-sidebar-restore' });
            restoreEl.style.cssText = `
                flex-shrink: 0;
                opacity: 0.3;
                font-size: 13px;
                padding: 2px 6px;
                border-radius: 3px;
                transition: opacity 0.15s;
            `;
            restoreEl.textContent = '↩';
            restoreEl.title = lang === 'zh' ? '重新打开' : 'Reopen';
            
            // 悬停效果
            itemEl.addEventListener('mouseenter', () => {
                itemEl.style.background = 'var(--background-modifier-hover)';
                restoreEl.style.opacity = '1';
            });
            itemEl.addEventListener('mouseleave', () => {
                itemEl.style.background = '';
                restoreEl.style.opacity = '0.3';
            });
            
            // 点击恢复
            itemEl.addEventListener('click', () => {
                this.app.workspace.openLinkText(record.path, '', true);
                // 从历史中移除
                this.plugin.closedTabsHistory = this.plugin.closedTabsHistory.filter(r => r.path !== record.path);
                // 刷新
                this.buildItems();
                this.filter(this.query);
                this.updateDisplayMode();
                this.render();
                this.renderSidebar();
                this.renderArchiveSection();
            });
        });
    }

    // 渲染右侧边栏归档区（位于"最近关闭"上方，点击可恢复）
    renderArchiveSection() {
        const lang = this.getLang();
        if (!this.archiveListEl) return;
        this.archiveListEl.empty();

        // 更新归档标题计数
        const titleEl = document.getElementById('tab-navigator-archive-title');
        if (titleEl) {
            titleEl.textContent = `${t('archiveArea', lang)} (${this.plugin.archivedTabs.length})`;
        }

        // 过滤：已重新打开的不显示 + 文件仍存在
        const openPaths = new Set();
        const rootLeaves = [];
        this.collectRootLeaves(this.app.workspace.rootSplit, rootLeaves);
        for (const leaf of rootLeaves) {
            try {
                const vs = leaf.getViewState();
                if (vs && vs.state && vs.state.file) openPaths.add(vs.state.file);
            } catch (e) {}
        }

        const items = this.plugin.archivedTabs
            .filter(r => !openPaths.has(r.path))
            .filter(r => this.app.vault.getAbstractFileByPath(r.path));

        if (items.length === 0) {
            this.archiveListEl.createDiv({ cls: 'tab-navigator-archive-empty', text: t('archiveEmpty', lang) });
            return;
        }

        items.forEach((record) => {
            const itemEl = this.archiveListEl.createDiv({ cls: 'tab-navigator-sidebar-item' });
            itemEl.style.cssText = `display:flex; align-items:center; padding:7px 12px; cursor:pointer; gap:8px; border-radius:5px; margin:1px 6px; transition:background 0.1s;`;

            // 归档时间
            const timeEl = itemEl.createDiv();
            timeEl.style.cssText = `font-size:10px; color:var(--text-faint); flex-shrink:0; width:36px; font-family:monospace;`;
            const date = new Date(record.timestamp);
            timeEl.textContent = `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;

            // 图标
            const iconEl = itemEl.createDiv();
            iconEl.style.cssText = `flex-shrink:0; font-size:12px;`;
            iconEl.textContent = this.getFileIcon(record.extension);

            // 标题
            const titleTextEl = itemEl.createDiv();
            titleTextEl.style.cssText = `flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:12px; color:var(--text-normal);`;
            titleTextEl.textContent = record.name;
            titleTextEl.title = record.path;

            // 恢复按钮
            const restoreEl = itemEl.createDiv();
            restoreEl.style.cssText = `flex-shrink:0; opacity:0.3; font-size:13px; padding:2px 6px; border-radius:3px; transition:opacity 0.15s;`;
            restoreEl.textContent = '↩';
            restoreEl.title = lang === 'zh' ? '恢复归档' : 'Restore';

            itemEl.addEventListener('mouseenter', () => { itemEl.style.background = 'var(--background-modifier-hover)'; restoreEl.style.opacity = '1'; });
            itemEl.addEventListener('mouseleave', () => { itemEl.style.background = ''; restoreEl.style.opacity = '0.3'; });
            itemEl.addEventListener('click', () => {
                this.plugin.restoreArchivedTab(record.path);
                this.buildItems();
                this.filter(this.query);
                this.updateDisplayMode();
                this.render();
                this.renderSidebar();
                this.renderArchiveSection();
            });
        });
    }

    // 渲染单个列表项（根据 displayMode 自适应详细程度）
    renderItem(item, index) {
        const itemEl = this.listEl.createDiv({ cls: 'tab-navigator-item' });
        if (index === this.selectedIndex) {
            itemEl.addClass('selected');
        }
        
        // 根据显示模式设置不同的布局参数
        let padding, gap, letterSize, iconSize, titleSize, pathSize;
        if (this.displayMode === 'detailed') {
            padding = '12px 20px'; gap = '14px';
            letterSize = '26px'; iconSize = '18px'; titleSize = '15px'; pathSize = '12px';
        } else if (this.displayMode === 'normal') {
            padding = '9px 18px'; gap = '12px';
            letterSize = '22px'; iconSize = '15px'; titleSize = '14px'; pathSize = '11px';
        } else {  // compact
            padding = '5px 16px'; gap = '10px';
            letterSize = '20px'; iconSize = '13px'; titleSize = '13px'; pathSize = '10px';
        }
        
        itemEl.style.cssText = `
            display: flex;
            align-items: center;
            padding: ${padding};
            cursor: pointer;
            gap: ${gap};
            border-radius: 6px;
            margin: 1px 8px;
            transition: background 0.1s;
        `;
        if (index === this.selectedIndex) {
            itemEl.style.background = 'var(--background-modifier-hover)';
        }
        
        // 字母快捷键标签
        const letterEl = itemEl.createDiv({ cls: 'tab-navigator-letter' });
        letterEl.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: ${letterSize};
            height: ${letterSize};
            border-radius: 5px;
            background: var(--background-modifier-border);
            font-size: ${parseInt(letterSize) * 0.55}px;
            font-weight: 700;
            color: var(--text-muted);
            flex-shrink: 0;
            font-family: monospace;
        `;
        letterEl.textContent = item.letter || '';
        
        // 文件类型图标
        const iconEl = itemEl.createDiv({ cls: 'tab-navigator-icon' });
        iconEl.style.cssText = `flex-shrink: 0; font-size: ${iconSize};`;
        iconEl.textContent = this.getFileIcon(item.extension);
        
        // 标题和路径（及摘要）
        const textContainer = itemEl.createDiv({ cls: 'tab-navigator-text' });
        textContainer.style.cssText = `
            flex: 1;
            overflow: hidden;
            min-width: 0;
        `;
        
        // 标题行
        const titleEl = textContainer.createDiv({ cls: 'tab-navigator-title' });
        titleEl.style.cssText = `
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: ${titleSize};
            font-weight: 500;
            color: var(--text-normal);
        `;
        titleEl.textContent = item.name;
        
        // 路径行（详细模式和正常模式都显示）
        if (this.displayMode !== 'compact') {
            const pathEl = textContainer.createDiv({ cls: 'tab-navigator-path' });
            pathEl.style.cssText = `
                font-size: ${pathSize};
                color: var(--text-muted);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-top: 2px;
            `;
            pathEl.textContent = item.parentFolder ? `${item.parentFolder} / ${item.basename}` : item.path;
        }
        
        // 摘要（仅在详细模式且为 md 文件时显示）
        if (this.displayMode === 'detailed' && item.extension === 'md') {
            const summary = this.summaryCache.get(item.path);
            if (summary) {
                const summaryEl = textContainer.createDiv({ cls: 'tab-navigator-summary' });
                summaryEl.style.cssText = `
                    font-size: 12px;
                    color: var(--text-faint);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-top: 4px;
                    line-height: 1.4;
                `;
                summaryEl.textContent = summary;
            } else if (this.summaryLoadingPaths.has(item.path)) {
                const loadingEl = textContainer.createDiv({ cls: 'tab-navigator-summary-loading' });
                loadingEl.style.cssText = `
                    font-size: 12px;
                    color: var(--text-faint);
                    margin-top: 4px;
                    font-style: italic;
                `;
                loadingEl.textContent = '加载中...';
            }
        }
        
        // 每标签历史计数徽标（仅打开的标签，且启用历史计数显示时）
        if (item.type === 'open' && item.leaf &&
            this.plugin.settings.historyShowCount) {
            const counts = this.plugin.getTabHistoryCounts(item.leaf.id);
            if (counts.back > 0 || counts.forward > 0) {
                const histEl = itemEl.createDiv({ cls: 'tab-navigator-history-count' });
                histEl.style.cssText = `flex-shrink:0; font-size:10px; font-family:monospace; color:var(--text-faint); padding:2px 6px; background:var(--background-modifier-border); border-radius:4px; white-space:nowrap;`;
                histEl.textContent = `◀${counts.back} ▶${counts.forward}`;
                histEl.title = (this.getLang() === 'zh' ? '历史: 可后退 ' : 'History: back ') + counts.back + (this.getLang() === 'zh' ? ' 步, 可前进 ' : ', forward ') + counts.forward + (this.getLang() === 'zh' ? ' 步' : '');
            }
        }

        // 操作按钮
        const actionEl = itemEl.createDiv({ cls: 'tab-navigator-action' });
        actionEl.style.cssText = `
            flex-shrink: 0;
            opacity: 0.4;
            font-size: ${this.displayMode === 'compact' ? '13px' : '16px'};
            padding: 4px 10px;
            border-radius: 4px;
            cursor: pointer;
            transition: opacity 0.15s;
        `;
        actionEl.textContent = item.type === 'open' ? '✕' : '↩';
        actionEl.title = item.type === 'open' ? '关闭' : '重新打开';
        
        // 鼠标悬停事件
        itemEl.addEventListener('mouseenter', () => {
            this.selectedIndex = index;
            this.updateSelection();
        });
        
        // 点击事件 — 激活/恢复
        itemEl.addEventListener('click', (evt) => {
            if (evt.target === actionEl) {
                evt.stopPropagation();
                if (item.type === 'open') {
                    this.closeTab(item);
                } else {
                    this.activateItem(item);
                }
            } else {
                this.activateItem(item);
            }
        });
    }

    // 更新选中状态（不重建整个列表，仅更新样式）
    updateSelection() {
        const items = this.listEl.querySelectorAll('.tab-navigator-item');
        items.forEach((el, idx) => {
            if (idx === this.selectedIndex) {
                el.style.background = 'var(--background-modifier-hover)';
            } else {
                el.style.background = '';
            }
        });
    }

    // 获取文件图标
    getFileIcon(extension) {
        switch (extension) {
            case 'md': return '📄';
            case 'canvas': return '🎨';
            case 'pdf': return '📕';
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'svg':
            case 'bmp': return '🖼️';
            case 'mp4':
            case 'webm':
            case 'mov': return '🎬';
            case 'mp3':
            case 'wav':
            case 'ogg': return '🎵';
            default: return '📄';
        }
    }

    // 键盘事件处理
    onKeydown(evt) {
        const key = evt.key.toLowerCase();

        // ── 序列快捷键：先点按 Alt（打开模式）或 Ctrl（关闭模式），再按字母 ──
        // 点按检测：修饰键 keydown 记候选，keyup 时才确认进入模式；
        // 按住不放 + 其他键 = 组合键（如 Alt+A 截图），放行不拦截，避免劫持全局快捷键
        if (key === 'alt') {
            evt.preventDefault();  // 防止 Windows 菜单栏被 Alt 聚焦
            if (!evt.repeat) this._modTapCandidate = 'open';
            return;
        }
        if (key === 'control') {
            if (!evt.repeat) this._modTapCandidate = 'close';
            return;  // 不 preventDefault，保留系统组合键（如 Ctrl+C 复制）
        }
        if (this._modTapCandidate && (evt.altKey || evt.ctrlKey || evt.metaKey)) {
            this._modTapCandidate = null;  // 组合键：取消候选，事件继续正常流转
        }

        // 已进入操作模式：字母执行 / ESC 取消 / 其他键取消并继续正常处理
        if (this.keyMode) {
            if (/^[a-z]$/.test(key) && !evt.ctrlKey && !evt.altKey && !evt.metaKey && !evt.shiftKey) {
                evt.preventDefault();
                const item = (this.selectableItems || []).find(i => i.letter === key);
                const mode = this.keyMode;
                this.setKeyMode(null);
                if (item) {
                    if (mode === 'open') {
                        this.activateItem(item);
                    } else if (item.type === 'open') {
                        this.closeTab(item);
                    }
                }
                return;
            }
            if (key === 'escape') {
                evt.preventDefault();
                this.setKeyMode(null);
                return;
            }
            this.setKeyMode(null);  // 其他键：取消模式，按普通键继续处理
        }

        // ESC：关闭模态框
        if (key === 'escape') {
            evt.preventDefault();
            this.close();
            return;
        }
        
        // 方向键：上下移动选中项
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
        
        // Enter：激活选中项（selectableItems 与实际渲染顺序一致）
        if (key === 'enter') {
            evt.preventDefault();
            const selected = (this.selectableItems || [])[this.selectedIndex];
            if (selected) {
                this.activateItem(selected);
            }
            return;
        }

        // 纯字母：不拦截，默认行为输入到搜索框
    }

    // keyup：确认修饰键"点按"（按下后未夹带其他键），进入/退出对应操作模式
    onKeyup(evt) {
        const key = evt.key.toLowerCase();
        if ((key === 'alt' || key === 'control') && this._modTapCandidate) {
            const mode = this._modTapCandidate;
            this._modTapCandidate = null;
            // 再次点按同一修饰键 = 退出模式（开关式）
            this.setKeyMode(this.keyMode === mode ? null : mode);
        }
    }

    // 切换操作模式并更新底部提示
    setKeyMode(mode) {
        this.keyMode = mode;
        this.updateKeyModeIndicator();
    }

    updateKeyModeIndicator() {
        if (!this.hintEl) return;
        const lang = this.getLang();
        if (this.keyMode === 'open') {
            this.hintEl.textContent = t('tabNavigatorModeOpen', lang);
            this.hintEl.addClass('tab-navigator-mode-armed');
        } else if (this.keyMode === 'close') {
            this.hintEl.textContent = t('tabNavigatorModeClose', lang);
            this.hintEl.addClass('tab-navigator-mode-armed');
        } else {
            this.hintEl.textContent = t('tabNavigatorHint', lang);
            this.hintEl.removeClass('tab-navigator-mode-armed');
        }
    }

    // 移动选中项
    moveSelection(delta) {
        const items = this.selectableItems || [];
        if (items.length === 0) return;
        this.selectedIndex = (this.selectedIndex + delta + items.length) % items.length;
        this.updateSelection();

        // 确保选中项可见
        const domItems = this.listEl.querySelectorAll('.tab-navigator-item');
        if (domItems[this.selectedIndex]) {
            domItems[this.selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    // 激活/恢复标签
    activateItem(item) {
        if (item.type === 'open') {
            // 激活已打开的标签
            this.app.workspace.setActiveLeaf(item.leaf, { focus: true });
        } else if (item.type === 'history') {
            // 重新打开历史标签
            this.app.workspace.openLinkText(item.path, '', true);
            // 从历史中移除
            this.plugin.closedTabsHistory = this.plugin.closedTabsHistory.filter(r => r.path !== item.path);
        }
        this.close();
    }

    // 关闭标签
    closeTab(item) {
        if (item.type !== 'open' || !item.leaf) return;
        // recordClosedTab 会在 detach patch 中自动调用
        item.leaf.detach();
        // 刷新列表
        this.buildItems();
        this.filter(this.query);
        this.updateDisplayMode();
        this.render();
        this.renderSidebar();  // 刷新右侧边栏（新关闭的标签会出现在列表顶部）
        if (this.displayMode === 'detailed') {
            this.loadSummaries();
        }
    }
}
