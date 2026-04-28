# Tab Settings Enhanced

> 🏷️ Enhanced tab management plugin for Obsidian

[![GitHub release](https://img.shields.io/github/v/release/wonderez/tab-settings-enhanced)](https://github.com/wonderez/tab-settings-enhanced/releases)
[![Downloads](https://img.shields.io/github/downloads/wonderez/tab-settings-enhanced/total)](https://github.com/wonderez/tab-settings-enhanced/releases)
[![License](https://img.shields.io/github/license/wonderez/tab-settings-enhanced)](LICENSE)

---

## ✨ Features

### 📂 New Tab Placement Control
Control exactly where new tabs open:
- **After parent tab** (default) - New tabs open right next to the tab that opened them
- **Before parent tab** - Open to the left of the parent
- **First position** - Always at the beginning
- **Last position** - Always at the end  
- **After pinned tabs** - Right after your pinned tabs

### ❌ Smart Close Behavior
Control which tab becomes active after closing:
- **Parent tab** - Return to the tab that opened this one
- **Left tab / Right tab** - Simple adjacency
- **Most recent** - Tab you used before this one
- **First / Last tab** - Predictable positions

### 🎨 Parent-Child Tab Colors
Visual color coding for related tabs:
- Same-color backgrounds for parent-child tab groups
- 6 beautiful color palettes:
  - 🌿 Morandi (soft, elegant)
  - 🌈 Rainbow (classic)
  - 🌊 Ocean (blue-green tones)
  - 🍬 Candy (pastel)
  - 💡 Vivid (high contrast)
  - ✨ Neon (bright, modern)
  - 🎲 Random (unique colors)
- Adjustable opacity (0.1 - 1.0)

### 🔗 Duplicate Tab Prevention
- Automatically switches to existing tab instead of opening duplicates
- Saves screen space and reduces clutter

### 🌐 Bilingual Support
- Full English and Chinese interface
- Auto-detects Obsidian language

---

## 📸 Screenshots

### Settings Panel
![Settings](assets/settings.png)

### Color-Coded Tabs
![Tab Colors](assets/tab-colors.png)

---

## 🚀 Installation

### From Community Plugins (Recommended)
1. Open Settings → Community Plugins
2. Click "Browse" and search for "Tab Settings Enhanced"
3. Click Install → Enable

### Manual Installation
1. Download `main.js`, `manifest.json` from [Releases](https://github.com/wonderez/tab-settings-enhanced/releases)
2. Create folder: `VaultFolder/.obsidian/plugins/tab-settings-enhanced/`
3. Copy files into the folder
4. Enable in Settings → Community Plugins

---

## ⚙️ Settings

| Setting | Options | Description |
|---------|---------|-------------|
| **Language** | Auto / English / 中文 | Interface language |
| **New Tab Position** | 5 options | Where new tabs open |
| **Close Activation** | 6 options | Which tab to activate after close |
| **Open in New Tab** | On/Off | Click links open new tabs by default |
| **Prevent Duplicates** | On/Off | Switch to existing instead of new |
| **Tab Colors** | On/Off | Enable parent-child coloring |
| **Color Palette** | 7 styles | Choose color scheme |
| **Opacity** | 0.1-1.0 | Background color intensity |

---

## 💡 Use Cases

### Research Workflow
When researching a topic, you often open multiple related links from a single note. With **Tab Settings Enhanced**:
1. All new tabs appear right next to the source tab
2. Closing them returns you to the original note
3. Color coding helps you see which tabs are related

### Writing Workflow
Drafting with reference materials:
1. Open your draft note
2. Open references → they stay grouped together
3. Easily navigate back to your draft when done

### Project Management
Managing projects with linked tasks:
1. Project MOC opens related notes
2. Visual colors show the project hierarchy
3. Close behavior keeps context

---

## 🔧 Compatibility

- Obsidian v1.0.0+
- Works on Desktop and Mobile
- Compatible with most themes
- Works with tab-related plugins

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create your feature branch
3. Submit a Pull Request

### Development Setup
```bash
# Clone the repo
git clone https://github.com/wonderez/tab-settings-enhanced.git

# Install dependencies
npm install

# Build
npm run build

# Development mode (watch)
npm run dev
```

---

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for full version history.

### Latest: v1.0.0
- Initial release
- Tab placement control (5 modes)
- Close activation control (6 modes)
- Parent-child tab colors (6 palettes)
- Duplicate prevention
- Bilingual support (EN/ZH)

---

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

## 💖 Support

If this plugin helps your workflow, consider:

- ⭐ Star this repository
- 🐛 Report bugs or suggest features
- ☕ [Buy me a coffee](https://afdian.net/a/wonderez)

---

## 🙏 Credits

Created by **ez** ([@wonderez](https://github.com/wonderez))

Special thanks to the Obsidian community for feedback and inspiration.

---

*让标签管理更高效，让知识工作更顺畅！*
