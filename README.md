# Tab Settings Enhanced

> Enhanced tab management for Obsidian: control where new tabs open, navigate tabs with a keyboard-driven navigator, and colorize parent-child tab relationships.

[![Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22tab-settings-enhanced%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugins.json)](https://community.obsidian.md/plugins?id=tab-settings-enhanced)
![License](https://img.shields.io/badge/license-MIT-green)

**Tab Settings Enhanced** is an Obsidian tab-management enhancement plugin. It gives you fine-grained control over where new tabs open, which tab activates on close, duplicate-tab prevention, parent-child tab color coding, and a keyboard-driven **Tab Navigator** modal (leader-key switching + search + history restore).

- Version: 1.6.11
- Minimum Obsidian version: 1.4.0
- Author: CTA System
- Platforms: Desktop & Mobile
- License: MIT
- 中文说明见 [README.cn.md](./README.cn.md)

---

## ✨ Features

### 1. New tab placement control

Intercepts `workspace.openLinkText` so every file-opening action lands where you want it.

| Option | Behavior |
|---|---|
| `after-parent` | Right of the parent tab (default) |
| `before-parent` | Left of the parent tab |
| `first` | First position in the tab bar |
| `last` | Last position in the tab bar |
| `after-pinned` | After the pinned tabs |

### 2. Close-tab activation strategy

Which tab gets activated when the current one closes.

| Option | Behavior |
|---|---|
| `parent` | Parent tab (default) |
| `left` | Tab on the left |
| `right` | Tab on the right |
| `recent` | Most recently used tab |
| `firstTab` | First tab |
| `lastTab` | Last tab |

### 3. New tab opening behavior

- **Open in new tab by default** (`openInNewTab`): all link clicks open in a new tab.
- **Quick switcher opens in new tab** (`openQuickSwitchInNewTab`): independently controls whether files opened via the `Ctrl+O` quick switcher open in a new tab, decoupled from the switch above.

  | Scenario | openInNewTab | openQuickSwitchInNewTab | Result |
  |---|---|---|---|
  | Link click | false | false | Opens in current tab |
  | Link click | true | false | Opens in new tab |
  | Quick switcher | false | true | Opens in new tab |
  | Quick switcher | true | * | Opens in new tab |

- **Prevent duplicate tabs** (`deduplicateTabs`): opening a file that is already open switches to the existing tab instead of creating a new one.
- **Panel links open in new tab** (`openPanelLinkInNewTab`): file links clicked inside **Bookmarks / Search / File list / Backlinks / Outgoing links** panels open in a new tab. Off by default (preserves native single-click behavior).

### 4. Tab color coding

Parent and child tabs share a color family so the hierarchy is readable at a glance.

- **Palettes** (`colorPalette`): 7 built-in schemes
  - 🌿 Morandi (default)
  - 🎨 Vivid
  - 🌈 Rainbow
  - 🌊 Ocean
  - 🍬 Candy
  - 💡 Neon
  - 🎲 Random (dynamically generated, hue separation > 60°)
- **Opacity** (`colorOpacity`): 0 ~ 1, default 0.3
- **Visual style**: an underline is drawn beneath the tab header in the parent-child color (left-aligned, growing rightward). Width ramps by state — 10% inactive / 20% hover / 30% active — with a spring pulse on click-to-activate or duplicate activation (30% → 90% → 30%). Tabs without a color fall back to the theme gray and get the same full animation set.

### 5. Tab Navigator

A keyboard-driven tab-switching modal combining leader-key switching, name search, quick close, and history restore.

**Default hotkey**: `Alt + T` (customizable in Settings → Hotkeys)

#### Modal layout

```
┌─────────────────────────────────────────────┐
│  🔍 Search tabs...                            │  ← input (auto-focused)
├─────────────────────────────────────────────┤
│  📂 Open tabs                                 │
│  [a]  📄 Note title 1               [×]      │  ← letter + title + close button
│  [s]  📄 Note title 2               [×]      │
├─────────────────────────────────────────────┤
│  🕒 Recently closed                           │
│  [k]  📄 Closed note 1              ↩        │  ← letter + title + restore button
└─────────────────────────────────────────────┘
   Tap Alt for open mode | Tap Ctrl for close mode | ↑↓ select | Enter confirm | ESC exit
```

#### Keyboard interaction

| Key | Behavior |
|---|---|
| Tap `Alt` then release | Enter **open mode** (footer highlights `▶ Open mode`) |
| Tap `Ctrl` then release | Enter **close mode** (footer highlights `✕ Close mode`) |
| `a` ~ `z` while armed | Open / close the tab assigned to that letter |
| `Esc` | Cancel the current mode (keeps the modal open); closes the modal when no mode is armed |
| `↑` / `↓` | Move the selection |
| `Enter` | Activate / restore the selected item |
| Any printable character | Typed into the search box, live filtering |

#### Highlights

- **Leader-key sequences**: tap `Alt`/`Ctrl` first to arm open/close mode, then press a letter. Built on *tap detection* rather than modifier combos — combos like `Alt+A` or `Ctrl+C` pass through untouched, so **system and global hotkeys are never hijacked**. Once armed, focus leaves the search box, so **pinyin IME users never have to switch input methods** — the letter key executes directly.
- **Live search**: matches file name, full path, and parent folder name (case-insensitive).
- **History restore**: automatically records the last 30 closed tabs, restorable in one click from the Recently closed section.
- **Deduplicated display**: open tabs never appear again in the history section.
- **Search covers history**: results include both open tabs and closed-tab history.
- **Archive section**: the top of the right sidebar holds the Archived module (see feature 8 below).

### 6. Tab jump / cycle hotkeys

Switch tabs fast via the command palette or custom hotkeys. All hotkeys are rebindable in **Settings → Hotkeys**.

| Hotkey | Action |
|---|---|
| `Alt+1` ~ `Alt+8` | Jump to tab 1~8 |
| `Alt+9` | Jump to the last tab |
| `Alt+←` / `Alt+→` | Previous / next tab (wraps around) |

> Numbering follows the tab bar order with **pinned tabs first**, preserving the original relative order within each group.

### 7. Per-tab navigation history

- **Reuses Obsidian's built-in per-pane history** (core feature since v0.16.3). The plugin does not build its own stack, so behavior matches the built-in `Ctrl+Alt+←/→` exactly and persists with the workspace.
- **History counts render next to the native back/forward buttons** (`[←]3 [→]1` in the view header, 0 included), read straight from `leaf.history`. Requires Settings → Appearance → Show tab title bars.
- **Mouse side buttons**: **button 4 = back, button 5 = forward** (delegates to the built-in `app:go-back` / `app:go-forward` commands).
- Settings: **Enable mouse side-button navigation** (`enableMouseSideNav`), **Show history counts** (`historyShowCount`).
- Integrated with the Tab Navigator: every open tab shows its `◀N ▶M` history counts.

### 8. Auto-archive + Focus mode

- Off by default; enable it in settings.
- Configurable idle timeout (default 30 min): checked once per minute, unpinned, non-active tabs that exceed the timeout are closed and moved to the archive.
- The archive lives at the top of the Tab Navigator's right sidebar (above Recently closed); archived tabs restore on click.
- Archive history cap is configurable (default 100); the oldest entries are dropped beyond it.
- **Focus mode**: closes every unpinned tab in one shot (all into the archive). Entry points: ① a command-palette command; ② the **tab context menu**.
- **Enable switch** (`enableFocusMode`, default on): when off, both the command and the context-menu item are disabled.

### 9. Focus lock

- **Two independent settings**:
  - **Show status bar button** (`enableFocusLock`): whether the focus-lock toggle appears in the status bar.
  - **Focus lock** (`focusLockOn`): directly toggles the lock, **two-way synced** with the status bar icon (change either, the other follows).
- Status bar icons are lucide SVGs: locked = `locate-fixed`, unlocked = `locate-off`; locked is highlighted in the accent color, unlocked is semi-transparent.
- While locked, clicking sidebar panels (file tree, search, tags panel, etc.) will not steal focus from the main editor, and links will not open into the wrong pane.
- Typing inside a sidebar input is never interrupted.
- Lock state persists in `data.json` and survives restarts.

### 10. Zen mode

- One click into **flow state**: hides every irrelevant UI — the left ribbon, both sidebars, the status bar, the tab bar, the note title bar, and the window title bar — and the current note fills the whole screen (no fixed width).
- Enter via: ① the command palette; ② the **feather icon in the left ribbon**; ③ the **tab context menu**; ④ a custom hotkey.
- Exit with `ESC`, by running the command again, or by clicking the feather icon again.
- On entry, focus returns to the editor and an `ESC` exit hint appears in the top-right corner.
- **Enable switch** (`enableZenMode`, default on): when off, the command / icon / context-menu item are all disabled (and zen mode exits automatically if active).

### 11. Hotkey cheat sheet in settings

- The bottom of the settings tab gains a "⌨️ Hotkeys" section listing every command with its default hotkey (including mouse side buttons), plus an **Open hotkey settings** button that jumps straight there for rebinding.

---

## 🌐 Multilingual support

Ships with Chinese and English, and can follow Obsidian's UI language automatically.

| Option | Behavior |
|---|---|
| `auto` | Follow Obsidian's UI language (default) |
| `en` | Force English |
| `zh` | Force Chinese |

---

## 📦 Installation

### Option 1: Community plugin browser (recommended)

1. Open **Settings → Community plugins → Browse**.
2. Search for **Tab Settings Enhanced** and click Install.
3. Click Enable in the installed-plugin list.

### Option 2: Manual install

1. Download `main.js` and `manifest.json` (`data.json` is user data generated at runtime — you do not need it).
2. Create the directory `.obsidian/plugins/tab-settings-enhanced/` inside your vault.
3. Drop the downloaded files into that directory.
4. In Obsidian, open **Settings → Community plugins** and turn off **Restricted mode**.
5. Find **Tab Settings Enhanced** in the list and click Enable.

### Option 3: From source (developers)

This project has **no build step**. `main.js` *is* the plugin — hand-written, unminified, unobfuscated — so a clone is ready to use:

```bash
git clone https://github.com/wonderez/tab-settings-enhanced.git
```

Copy (or symlink) `main.js` and `manifest.json` into `<your-vault>/.obsidian/plugins/tab-settings-enhanced/` and enable it in Obsidian. After editing, run `node --check main.js` to validate the syntax.

---

## ⚙️ Settings reference

All settings are stored in `.obsidian/plugins/tab-settings-enhanced/data.json` and are also adjustable in **Settings → Tab Settings Enhanced**.

| Field | Type | Default | Description |
|---|---|---|---|
| `language` | string | `"auto"` | UI language |
| `newTabPlacement` | string | `"after-parent"` | Where new tabs open |
| `closeTabActivation` | string | `"parent"` | Which tab activates on close |
| `openInNewTab` | boolean | `true` | Open links in a new tab by default |
| `openQuickSwitchInNewTab` | boolean | `false` | Quick switcher opens in a new tab |
| `openPanelLinkInNewTab` | boolean | `false` | Panel links (bookmarks/search/file list/backlinks/outgoing) open in a new tab |
| `deduplicateTabs` | boolean | `true` | Prevent duplicate tabs |
| `enableTabColors` | boolean | `true` | Enable tab color coding |
| `colorPalette` | string | `"morandi"` | Color palette |
| `colorOpacity` | number | `0.3` | Color opacity |
| `enableMouseSideNav` | boolean | `true` | Mouse side-button history navigation (button 4 back / 5 forward) |
| `historyShowCount` | boolean | `true` | Show history counts next to the native back/forward buttons |
| `enableAutoArchive` | boolean | `false` | Enable auto-archive |
| `autoArchiveTimeout` | number | `30` | Auto-archive idle timeout (minutes) |
| `autoArchiveMaxHistory` | number | `100` | Archive history cap |
| `enableFocusMode` | boolean | `true` | Enable focus mode (disables the command / context-menu item when off) |
| `enableFocusLock` | boolean | `false` | Show the focus-lock button in the status bar |
| `focusLockOn` | boolean | `false` | Focus lock on/off (synced with the status bar icon, persisted) |
| `enableZenMode` | boolean | `true` | Enable zen mode (disables command/icon/context-menu item when off) |

> The Tab Navigator's history (`closedTabsHistory`, max 30 entries) and the archive (`archivedTabs`) are also persisted into `data.json`.

---

## ⌨️ Commands and hotkeys

| Command | Default hotkey | Description |
|---|---|---|
| Open Tab Navigator | `Alt + T` | Bring up the Tab Navigator modal |
| Jump to Tab 1~8 | `Alt + 1` ~ `Alt + 8` | Jump to the Nth tab (pinned-first ordering) |
| Jump to Last Tab | `Alt + 9` | Jump to the last tab |
| Previous / Next Tab | `Alt + ←` / `Alt + →` | Cycle between tabs |
| Focus mode: close all unpinned tabs | — (rebindable) | Close and archive every unpinned tab (also in the tab context menu) |
| Zen Mode | — (rebindable) | Hide all irrelevant UI for full-screen focus (ESC to exit) |

All hotkeys are rebindable in **Settings → Hotkeys**.

---

## 🛠️ How it works

- **Open interception**: `patchOpenLink()` rewrites `workspace.openLinkText` and decides the insert position per `newTabPlacement`, detecting the quick-switcher modal in the DOM to identify the call source.
- **Close interception**: `patchLeafDetach()` rewrites `WorkspaceLeaf.prototype.detach`, records history before the tab closes, and activates the next tab per the `closeTabActivation` strategy.
- **Parent-child tracking**: maintains a parent-child tab map used for color assignment and for returning to the parent tab on close.
- **Color assignment**: pulls from the selected palette by hierarchy level so a color family marks each parent-child group.
- **Tab Navigator**: `TabNavigatorModal` extends `obsidian.Modal` with its own letter assignment, search filtering, and keyboard handling.

> Full design doc: [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md).

---

## 🔒 Compatibility and notes

- Fully backward compatible — every new setting defaults to the original behavior.
- Every patch is registered through `register()`, so unloading the plugin restores all original behavior without polluting Obsidian.
- The Tab Navigator is a standalone modal and does not touch the native quick switcher, so it does not conflict with Quick Switcher++ and similar plugins.
- History stores path information only (never file content), capped at 30 entries, with negligible memory use.

---

## 📁 Project structure

```
tab-settings-enhanced/
├── manifest.json            # Obsidian plugin manifest
├── main.js                  # Plugin entry file (ready to use as-is)
├── LICENSE                  # MIT license
├── IMPLEMENTATION_PLAN.md   # Design document
└── README.md                # This file
```

> `data.json` (user settings and history) is generated at runtime, contains personal note paths, and is intentionally not version-controlled.

---

## 📝 Changelog

### v1.6.11

- Tab color underline widths narrowed to 10% / 20% / 30% (inactive / hover / active); pulse peak 100% → 90%. Tabs without a parent-child relationship get a gray fallback underline with the same hover, active, and click-pulse animations.

### v1.6.1 ~ v1.6.10 (summary)

- **v1.6.1**: 16 bug fixes — auto-archive never fired for never-activated tabs, recently-closed history was not persisted, backlink/outgoing panel clicks double-opened the same file, parentMap cycle protection, popout window misdetection, stale history badges, and more.
- **v1.6.2**: the Tab Navigator switched to tap-the-leader-key sequences (tap Alt = open mode / Ctrl = close mode) so `Alt+letter` global hotkeys are no longer hijacked; the underline moved under the centered title with spring animation and a 60% active width.
- **v1.6.3**: leader-key sequences became pinyin-IME friendly — arming a mode moves focus out of the search box so the IME never intercepts letter keys; no input-method switching required.
- **v1.6.4 ~ v1.6.10**: continued underline polish — a dedicated child element replaces the native pseudo-element to avoid style conflicts, a duplicate-activation "underline pulse" replaces the native yellow flash, left-aligned rightward growth, three-tier height/opacity hierarchy, 6px left offset, 90% pulse peak.

### v1.6.0

- **Fixed the tab context menu**: the `tab-context-menu` event proved unreliable, replaced with pure DOM injection — listen for `contextmenu` on the tab header, wait for the native menu to render, then inject items into `.menu`. The **zen mode entry was also added to the context menu**.
- **Zen mode fills the screen**: dropped the fixed 880px width so note content takes the whole viewport.
- **New feature switches**: `enableFocusMode` (focus mode) and `enableZenMode` (zen mode), on by default; when off, the matching command / icon / context-menu item is disabled, and turning the zen switch off while in zen mode exits it and hides the feather icon.
- **Hotkey cheat sheet in settings**: a new "⌨️ Hotkeys" section listing every command with its default hotkey (including mouse side buttons) and a one-click jump to the hotkey settings.

### v1.5.0

- **Simplified per-tab history settings**: removed "Enable per-tab history" (a built-in feature needing no switch) in favor of **Enable mouse side-button history navigation** (`enableMouseSideNav`).
- **History counts moved**: from tab-header badges to the **native back/forward buttons** (`[←]3 [→]1` in the view header), including zeros.
- **More focus mode entry points**: in addition to the command palette, focus mode now lives in the **tab context menu**.
- **Added zen mode**: hides the ribbon, sidebars, status bar, tab bar, and title bars for distraction-free writing; enter via command or the ribbon feather icon, exit with `ESC`.

### v1.4.0

- **Refactored per-tab history** to reuse Obsidian's built-in `leaf.history` instead of a self-built stack, so counts and side buttons match the built-in `Ctrl+Alt+←/→` exactly and persist with the workspace. Simpler code.
- **Focus lock refinement**: split into "Show status bar button" + "Focus lock switch" as two independent, two-way-synced settings; status bar icons switched from emoji to lucide SVGs (`locate-fixed` / `locate-off`) with a highlighted locked state.
- **New panel link switch** `openPanelLinkInNewTab`: file links in Bookmarks / Search / File list / Backlinks / Outgoing links panels open in a new tab by default (off by default).

### v1.3.0

- Added **tab jump / cycle hotkeys**: `Alt+1~9` to jump, `Alt+←/→` to cycle (pinned tabs first).
- Added **per-tab navigation history**: forward/back stacks, tab-header count badges (`◀3 ▶1`), mouse side-button support, and integration with the Tab Navigator.
- Added **auto-archive**: idle tabs are auto-closed into a restorable archive with a configurable cap, plus a **focus mode** command that closes every unpinned tab at once.
- Added **focus lock**: a status bar icon that prevents sidebars from stealing editor focus, with persisted state.
- Closed-tab history and the archive switched to persistent storage (written into `data.json`).

### v1.2.2

- Added the independent "Quick switcher opens in new tab" switch.
- Added the Tab Navigator modal
  - Letter-key switching, name search, `Ctrl+letter` close, history restore.
- Improved multilingual coverage.

### Early versions

- New tab placement control (5 strategies)
- Close-tab activation strategy (6 strategies)
- Duplicate tab prevention
- Parent-child tab color coding (7 palettes)

---

## 💖 Support

If this plugin helps, consider leaving a Star on [GitHub](https://github.com/wonderez/tab-settings-enhanced), or filing an issue with feedback and suggestions.

---

## License

Released under the [MIT License](./LICENSE). Copyright (c) 2026 CTA System.
