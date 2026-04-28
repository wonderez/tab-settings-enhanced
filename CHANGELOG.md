# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-02

### Added
- **New Tab Placement Control**
  - After parent tab (default)
  - Before parent tab
  - First position
  - Last position
  - After pinned tabs

- **Close Tab Activation Control**
  - Activate parent tab
  - Activate left tab
  - Activate right tab
  - Activate most recent
  - Activate first tab
  - Activate last tab

- **Parent-Child Tab Colors**
  - Visual color marking for related tabs
  - 6 built-in color palettes: Morandi, Vivid, Rainbow, Ocean, Candy, Neon
  - Random color option
  - Adjustable opacity (0.1 - 1.0)

- **Duplicate Prevention**
  - Automatically switch to existing tab instead of opening new one

- **Open in New Tab**
  - Default behavior to open links in new tab

- **Bilingual Support**
  - Full English interface
  - Full Chinese interface
  - Auto-detect based on Obsidian language

### Technical
- Parent-child relationship tracking
- Recent tab order tracking
- Clean layout change handling
- Monkey patching for getLeaf, detach, openLinkText

---

## [Unreleased]

### Planned
- Tab group stacking
- Keyboard shortcuts for tab navigation
- Tab history panel
- Custom color picker
- Export/import settings

---

## Notes

### Versioning
- Major: Breaking changes or significant new features
- Minor: New features, backward compatible
- Patch: Bug fixes

### Support
For issues or feature requests, please visit:
https://github.com/wonderez/tab-settings-enhanced/issues
