# Contributing to Tab Settings Enhanced

Thank you for your interest in contributing! 🎉

## How to Contribute

### Reporting Bugs
1. Check if the issue already exists
2. Create a new issue with:
   - Obsidian version
   - Plugin version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features
1. Open a new issue with `[Feature Request]` prefix
2. Describe the feature and use case
3. Explain why it would be valuable

### Code Contributions

#### Setup
```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/tab-settings-enhanced.git
cd tab-settings-enhanced
```

> **本项目无构建流程**：`main.js` 即插件本体（手写 CommonJS，未压缩、未混淆），
> 克隆后可直接使用，没有 `npm install` / `npm run build` 步骤。
> 修改后运行 `npm run check`（等价于 `node --check main.js`）做语法校验。

#### Development Workflow
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes in `main.js`
3. Syntax check: `node --check main.js`
4. Test in a real vault (see below)
5. Commit with clear messages
6. Push and create a Pull Request

#### Code Style
- `main.js` 为手写 JavaScript（CommonJS），**非 TypeScript、无构建步骤**
- Follow existing code patterns
- Add comments for complex logic
- Keep functions focused and small

#### Testing
1. 将 `main.js` 与 `manifest.json` 复制（或软链接）到测试 vault 的
   `.obsidian/plugins/tab-settings-enhanced/`
2. 在 Obsidian 中重载插件（命令面板执行 `Reload app`，或关闭再启用插件）
3. Test all existing features still work
4. Test your new feature/fix
5. Test on both light and dark themes

### Documentation
- Update README if adding features
- Update CHANGELOG for all changes
- Add JSDoc comments for new functions

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person

## Questions?

Feel free to open an issue or reach out!

---

Thank you for helping make Tab Settings Enhanced better! 💖
