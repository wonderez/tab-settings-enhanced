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
    deduplicateTabs: true,
    
    // 标签颜色设置
    enableTabColors: true,
    colorPalette: "morandi",
    colorOpacity: 0.3
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
            
            await this.loadSettings();
            
            // 注册设置面板
            const settingTab = new TabSettingsSettingTab(this.app, this);
            this.addSettingTab(settingTab);
            console.log("Tab Settings Enhanced: 设置面板已注册");
            
            // 注册样式
            this.registerStyles();
            
            // 监听标签激活事件 (追踪最近使用)
            this.registerEvent(
                this.app.workspace.on('active-leaf-change', (leaf) => {
                    if (leaf) {
                        this.updateRecentOrder(leaf.id);
                    }
                })
            );
            
            // 监听标签关闭事件
            this.registerEvent(
                this.app.workspace.on('layout-change', () => {
                    this.cleanupParentMap();
                    this.updateTabColors();
                })
            );
            
            // Monkey patch: 拦截 getLeaf 方法
            this.patchGetLeaf();
            
            // Monkey patch: 拦截标签关闭
            this.patchLeafDetach();
            
            // Monkey patch: 拦截链接打开
            this.patchOpenLink();
            
            // 初始应用颜色
            this.app.workspace.onLayoutReady(() => {
                this.updateTabColors();
            });
            
            console.log("Tab Settings Enhanced: 加载完成!");
        } catch (error) {
            console.error("Tab Settings Enhanced: 加载失败!", error);
        }
    }

    onunload() {
        console.log("Tab Settings Enhanced: 已卸载");
        this.removeTabColors();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 设置管理
    // ─────────────────────────────────────────────────────────────────────────

    async loadSettings() {
        const data = await this.loadData();
        this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
    }

    async saveSettings() {
        await this.saveData(this.settings);
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
            .workspace-tab-header[data-tab-color]::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                background-color: var(--tab-bg-color);
                opacity: var(--tab-bg-opacity, 0.3);
                border-radius: inherit;
                pointer-events: none;
                z-index: 0;
            }
            .workspace-tab-header[data-tab-color] .workspace-tab-header-inner {
                position: relative;
                z-index: 1;
            }
            .workspace-tab-header[data-tab-color]::after {
                content: '';
                position: absolute;
                left: 0;
                bottom: 0;
                right: 0;
                height: 3px;
                background-color: var(--tab-bg-color);
                border-radius: 0 0 3px 3px;
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
        // 递归查找根祖先标签
        const parentId = this.parentMap.get(leafId);
        if (!parentId) return leafId;
        return this.getRootLeaf(parentId);
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
                // 添加底部边框作为颜色条
                header.style.borderBottom = `3px solid ${color}`;
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
            // 找到这个已关闭标签的祖先（可能也已关闭，需要递归查找）
            let ancestorId = this.parentMap.get(closedId);
            while (ancestorId && !existingIds.has(ancestorId)) {
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
                    plugin.app.workspace.setActiveLeaf(existingLeaf, { focus: true });
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
                        evt.stopPropagation();
                        plugin.app.workspace.setActiveLeaf(existingLeaf, { focus: true });
                        console.log("Tab Settings Enhanced: 已激活现有标签 -", resolvedPath);
                        return;
                    }
                }
            }
            
            // 如果启用了默认新标签打开，并且没有按住修饰键
            if (plugin.settings.openInNewTab && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey) {
                evt.preventDefault();
                evt.stopPropagation();
                console.log("Tab Settings Enhanced: 拦截链接点击，在新标签打开 -", href);
                plugin.app.workspace.openLinkText(href, sourcePath, true);
            }
        }, true);  // 使用捕获阶段
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
        
        this.app.workspace.iterateAllLeaves(leaf => {
            if (foundLeaf) return;  // 已找到就跳过
            
            const viewState = leaf.getViewState();
            if (viewState && viewState.state && viewState.state.file) {
                if (viewState.state.file === filePath) {
                    foundLeaf = leaf;
                }
            }
        });
        
        return foundLeaf;
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
        
        // Buy Me a Coffee 按钮
        const coffeeButton = buttonContainer.createEl('a', { text: '☕ Buy Me a Coffee', href: 'https://buymeacoffee.com/yourname' });
        coffeeButton.style.cssText = `display: inline-block; background: linear-gradient(135deg, #FFDD00 0%, #FBB034 100%); color: #000000; padding: 14px 28px; border-radius: 50px; font-weight: bold; font-size: 15px; text-decoration: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 15px rgba(255, 221, 0, 0.4); border: 2px solid rgba(255,255,255,0.3);`;
        coffeeButton.addEventListener('mouseenter', () => { coffeeButton.style.transform = 'translateY(-3px) scale(1.05)'; coffeeButton.style.boxShadow = '0 8px 25px rgba(255, 221, 0, 0.5)'; });
        coffeeButton.addEventListener('mouseleave', () => { coffeeButton.style.transform = 'translateY(0) scale(1)'; coffeeButton.style.boxShadow = '0 4px 15px rgba(255, 221, 0, 0.4)'; });
        
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
