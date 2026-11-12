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

// src/plugin.ts
var plugin_exports = {};
__export(plugin_exports, {
  default: () => QuietOutline
});
module.exports = __toCommonJS(plugin_exports);
var import_obsidian7 = require("obsidian");

// src/utils/promise.ts
var Deferred = class _Deferred {
  state = "unresolved";
  resolve;
  reject;
  promise = new Promise((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  }).then(
    (res) => (this.setState("resolved"), res),
    (err) => (this.setState("rejected"), Promise.reject(toError(err)))
  );
  setState(state) {
    if (this.state === "unresolved") {
      this.state = state;
    }
  }
  static resolved(t2) {
    const deferred = new _Deferred();
    deferred.resolve(t2);
    return deferred;
  }
  isResolved() {
    return this.state === "resolved";
  }
  isRejected() {
    return this.state === "rejected";
  }
};
function toError(err) {
  return err instanceof Error ? err : new Error(String(err));
}

// src/navigators/base.ts
var Nav = class {
  _used = false;
  // a navigator only allowed to be used once
  _loaded = new Deferred();
  _events = [];
  plugin;
  view;
  constructor(plugin2, view) {
    this.plugin = plugin2;
    this.view = view;
  }
  async load() {
    if (this._used) return;
    this._used = true;
    if (!this.constructor._installed) {
      await this.install();
      this.constructor._installed = true;
    }
    await this.onload();
    this._loaded.resolve();
  }
  async unload() {
    await this._loaded.promise;
    for (; this._events.length > 0; ) {
      await this._events.pop()?.();
    }
    await this.onunload();
    this.plugin.navigator = new DummyNav(this.plugin, null);
  }
  register(cb) {
    this._events.push(cb);
  }
  registerEvent(eventRef) {
    this.register(() => {
      eventRef.e?.offref(eventRef);
    });
  }
  registerDomEvent(el, type, callback, options) {
    el.addEventListener(type, callback, options);
    this.register(() => {
      el.removeEventListener(type, callback, options);
    });
  }
  getDefaultLevel() {
    const n = parseInt(this.plugin.settings.expand_level);
    return Number.isFinite(n) ? Math.max(0, Math.min(5, n)) : 2;
  }
  // whether this navigator tracks the given file (used to filter
  // metadataCache change events)
  handlesFile(_file) {
    return false;
  }
  getPath() {
    return "";
  }
  async install() {
  }
  async onload() {
  }
  async onunload() {
  }
  async handleDrop(_from, _to, _position) {
  }
  toBottom() {
  }
  async jumpWhenClick(index) {
    await this.jump(index);
  }
};
var DummyNav = class extends Nav {
  getId() {
    return "dummy";
  }
  async unload() {
  }
  async jump(_index) {
  }
  async getHeaders() {
    return [];
  }
  async updateHeaders() {
  }
};

// src/navigators/markdown.ts
var import_obsidian3 = require("obsidian");

// src/editor-ext.ts
var import_view = require("@codemirror/view");

// src/utils/event-bus.ts
var import_obsidian = require("obsidian");
var EventBus = class extends import_obsidian.Events {
  on(name, callback, ctx) {
    return super.on(name, callback, ctx);
  }
  off(name, callback) {
    super.off(name, callback);
  }
  trigger(name, ...data) {
    super.trigger(name, ...data);
  }
};
var eventBus = new EventBus();

// src/editor-ext.ts
var EditorEvent = class {
  constructor(_view) {
  }
  update(update) {
    if (update.selectionSet) {
      eventBus.trigger("cursorchange", update.docChanged);
    }
  }
  destroy() {
  }
};
var editorEvent = import_view.ViewPlugin.fromClass(EditorEvent);

// src/store.ts
var Store = class {
  headers = [];
  dark = true;
  dragModify = true;
  modifyKeys = { offsetModifies: [], removes: [], adds: [], modifies: [] };
  theme = {
    patchColor: false,
    primaryColorLight: "",
    primaryColorDark: "",
    rainbowLine: false,
    rainbowColor1: "",
    rainbowColor2: "",
    rainbowColor3: "",
    rainbowColor4: "",
    rainbowColor5: "",
    fontSize: "",
    fontFamily: "",
    fontWeight: "",
    lineHeight: "",
    lineGap: ""
  };
  init(plugin2) {
    const { settings } = plugin2;
    this.dark = activeDocument.body.hasClass("theme-dark");
    this.dragModify = settings.drag_modify;
    this.theme.patchColor = settings.patch_color;
    this.theme.primaryColorLight = settings.primary_color_light;
    this.theme.primaryColorDark = settings.primary_color_dark;
    this.theme.rainbowLine = settings.rainbow_line;
    this.theme.rainbowColor1 = settings.rainbow_color_1;
    this.theme.rainbowColor2 = settings.rainbow_color_2;
    this.theme.rainbowColor3 = settings.rainbow_color_3;
    this.theme.rainbowColor4 = settings.rainbow_color_4;
    this.theme.rainbowColor5 = settings.rainbow_color_5;
    this.theme.fontSize = settings.font_size;
    this.theme.fontFamily = settings.font_family;
    this.theme.fontWeight = settings.font_weight;
    this.theme.lineHeight = settings.line_height;
    this.theme.lineGap = settings.line_gap;
  }
};
var store = new Store();

// src/lang/locale/zh.ts
var zh_default = {
  "Settings for Quiet Outline.": "Quiet Outline 的设置页面",
  setting_title: "XU Quiet Outline（大纲）",
  setting_header_desc: "在侧边栏生成大纲树，支持点击跳转、滚动与光标双向定位、层级滑条、拖拽改层级、双链标题着色与样式定制。",
  Documentation: "使用文档",
  "View the full manual on GitHub": "在 GitHub 查看完整使用说明",
  GitHub: "GitHub",
  "Set Primary Color": "设置主颜色 明/暗",
  "Patch default color": "用设置覆盖默认主颜色",
  "Set Rainbow Line Color": "设置彩虹大纲线颜色",
  "Render Markdown": "渲染markdown元素",
  "Render heading string as markdown format.": "以markdown格式渲染标题文本",
  "Search Support": "开启搜索",
  "Add a searching area on the top": "在顶部添加一个搜索框",
  "Level Switch": "层级切换器",
  "Expand headings to certain level.": "展开标题到特定层级",
  "Default Level": "默认层级",
  "Default expand level when opening a new note.": "打开新笔记时，标题展开到的默认层级",
  "No expand": "不展开",
  "To Bottom": "跳转到笔记末尾",
  Reset: "重置",
  "Input to search": "输入以搜索",
  "result(s):": "条匹配结果：",
  "Hide Unsearched": "过滤未搜索的标题",
  "Hide irrelevant headings when searching": "搜索时，隐藏未命中的标题",
  "Regex Search": "正则搜索",
  "Search headings using regular expression": "支持使用正则表达式来搜索",
  "Auto Expand": "自动展开",
  "Auto expand and collapse headings when scrolling and cursor position change": "当滚动页面时，自动跟踪当前所在标题并展开",
  "Auto Scroll Into View": "自动滚动到定位的标题",
  "Auto scroll located heading into view": "当滚动或者光标位置变化时，大纲自动滚动到相应标题",
  "Only Expand": "仅展开当前标题",
  "Expand and Collapse Rest": "展开同时折叠剩余标题",
  "Expand and Collapse Rest to Default": "展开同时折叠剩余标题至默认层级",
  "Expand and Collapse Rest to Setting Level (Level Switch)": "展开同时折叠剩余标题至设置层级(层级切换器)",
  Disabled: "关闭自动展开",
  "Locate By Cursor": "定位到光标处",
  "Highlight and Auto expand postion will be determined by cursor position": "高亮和自动展开位置将由光标位置决定",
  "Show Popover on hover": "鼠标悬停在标题时显示笔记内容",
  "Press functional key and move cursor to heading": "按住功能键，移动光标到标题处",
  Disable: "关闭",
  Ellipsis: "省略长标题",
  "Tooltip direction": "完整标题显示方向",
  "Keep one line per heading": "保持标题只有一行,省略多余部分",
  "Persist Markdown States": "记录 markdown 状态",
  "Save and restore cursor, scroll state of markdown note, as well as expanded/collapsed state of headings": "保存和恢复 markdown 笔记的光标、滚动状态以及标题的展开/折叠状态",
  "Save Cursor Position": "保存光标位置",
  "Save and restore cursor position of markdown note": "保存和恢复 markdown 笔记的光标位置",
  "Save Scroll Position": "保存滚动位置",
  "Save and restore scroll position of markdown note": "保存和恢复 markdown 笔记的滚动位置",
  "Save Heading Expansion State": "保存标题展开状态",
  "Save and restore expanded/collapsed state of headings": "保存和恢复标题的展开/折叠状态",
  "Save Delay": "保存延迟",
  "Delay after the last change before saving markdown-states.json, in seconds. Set to 0 to save immediately.": "最后一次变化后延迟保存 markdown-states.json 的秒数。设置为 0 时立即保存。",
  "Keep Search Input": "保留搜索输入",
  "Keep search input when switching between notes": "切换笔记时保留搜索输入",
  "Drag headings to modify note": "启用拖拽标题来调整文档结果",
  "❗ This will modify note content, be careful.": "❗ 拖拽操作会改变文档内容，小心使用",
  "Text Direction": "文本方向",
  "is decided by": "由什么决定",
  "Export Format": "标题输出格式",
  // 设置页签
  Canvas: "白板",
  Bases: "数据库",
  General: "常规设置",
  Styles: "样式设置",
  // Canvas 相关设置
  "Canvas Sort Order": "白板大纲排序",
  "Heading Truncate Length": "标题截断长度",
  "Sort method for canvas nodes": "白板卡片的排序逻辑",
  "Sort by Area": "按面积 (大 -> 小)",
  "Sort by Name (A -> Z)": "按名称 (A -> Z)",
  "Sort by Name (Z -> A)": "按名称 (Z -> A)",
  "Show group nodes": "显示组节点",
  "Show file nodes": "显示文件节点",
  "Show text nodes": "显示文本节点",
  "Show link nodes": "显示链接节点",
  // Bases 相关设置
  "Display Property": "显示属性",
  "Property shown for each row": "每一行显示的属性，例如 file.name、file.path",
  "Bases syntax": "Bases 语法",
  // menu
  Copy: "复制",
  Heading: "标题",
  "Heading and children headings": "标题和子标题",
  "Heading and Content": "该段内容",
  "Heading and siblings headings": "标题和兄弟标题",
  "Rename heading": "重命名标题",
  "Link of heading": "标题链接",
  // Context menu items
  "Collapse Recursively": "递归折叠",
  "Expand Recursively": "递归展开",
  "Collapse Sibling": "折叠同级标题",
  "Expand Sibling": "展开同级标题",
  // Markdown navigator menu: change heading level（调整标题层级）
  "Change Level": "调整层级",
  Increase: "增加",
  "Increase Recursively": "递归增加",
  Decrease: "减少",
  "Decrease Recursively": "递归减少",
  "Maximum level reached": "已达到最大层级",
  "Minimum level reached": "已达到最小层级",
  "Vimlize Canvas": "Vim Canvas",
  "Add vim-like keymap for canvas": "给 Canvas 添加 Vim 风格的快捷键",
  // Confirm modal
  Confirm: "确认",
  Cancel: "取消",
  // Markdown navigator menu
  Delete: "删除",
  // Confirm prompt (dangerous operation)
  "This will delete heading:": "即将删除标题：",
  "This will modify the note content. Continue?": "此操作会修改笔记内容，是否继续？",
  // Drag & drop notices
  "Cannot move heading into its own subtree": "不能将标题移动到它自己的子标题内",
  "Outline changed while dragging, move aborted": "拖拽时文档已变化，本次移动已取消",
  "Failed to move heading": "移动标题失败",
  // New settings
  "Font Size": "字体大小",
  "Custom font size for outline text (e.g., 14px, 1rem)": "大纲文本的自定义字体大小（例如：14px, 1rem）",
  "Font Family": "字体家族",
  "Custom font family for outline text": "大纲文本的自定义字体家族",
  "Font Weight": "字体粗细",
  "Custom font weight for outline text (e.g., normal, bold, 400, 700)": "大纲文本的自定义字体粗细（例如：normal, bold, 400, 700）",
  "Line Height": "行高",
  "Custom line height for outline text (e.g., 1.5, 2)": "大纲文本的自定义行高（例如：1.5, 2）",
  "Line Gap": "行间距",
  "Custom gap between lines (e.g., 4px, 0.5rem)": "行之间的自定义间距（例如：4px, 0.5rem）",
  // Font color settings
  "Custom Font Color": "自定义字体颜色",
  "Enable custom font colors for different heading levels": "为不同级别的标题启用自定义字体颜色",
  "H1 Color": "H1 颜色",
  "H2 Color": "H2 颜色",
  "H3 Color": "H3 颜色",
  "H4 Color": "H4 颜色",
  "H5 Color": "H5 颜色",
  "H6 Color": "H6 颜色",
  "General Settings": "常规",
  "Default expanding level": "默认展开层级",
  "Default expanding level desc": "打开笔记时默认展开的标题层级：0 为全部折叠，数字越大展开越深（最高到 H5）。",
  "Indent level": "缩进层级",
  "Auto expand mode": "自动展开模式",
  "Control the expansion behavior when a leaf is changed": "切换文档时控制大纲的展开行为",
  "Drag to modify": "拖拽改层级",
  "Expand and collapse the rest to default level": "展开当前并折叠其余到默认层级",
  "Expand and collapse the rest to the level below": "展开当前并折叠其余到下方指定层级",
  "Allow dragging headings in the outline to change their level and position. This will modify the note content.": "允许在大纲中拖拽标题改变其层级和位置。此操作会修改笔记内容。",
  "Locate by cursor": "光标定位",
  "Highlight the nearest heading by the cursor": "根据光标位置高亮最近的标题",
  "Auto scroll into view": "自动滚动到可见区域",
  "Highlighting headings auto scroll into view": "高亮标题时自动滚动到可见区域",
  "Style Settings": "样式",
  "Override primary color": "覆盖主色",
  "Primary color (light mode)": "主色（浅色模式）",
  "Primary color (dark mode)": "主色（深色模式）",
  "This setting is used to override the primary color of the theme": "此设置用于覆盖主题的主色调（左浅色/右深色）",
  "Rainbow line color": "彩虹缩进线",
  "The color of the line can be customized by rainbow": "用彩虹色自定义缩进线颜色",
  "Rainbow line colors": "彩虹线颜色",
  "Font Settings": "字体",
  "Font size": "字号",
  "Font family": "字体族",
  "Font weight": "字重",
  "Line height": "行高",
  "Line gap": "行间距",
  // 设置页统一键（2026-09-23 七插件规范）
  setting_language: "界面语言",
  setting_language_desc: "选择设置面板的显示语言",
  lang_auto: "跟随系统",
  lang_zh: "简体中文",
  lang_en: "English",
  "lang_zh-TW": "繁體中文",
  sec_advanced: "高级",
  setting_docs: "使用文档",
  setting_docs_desc: "在 GitHub 查看完整使用说明",
  btn_github: "GitHub"
};

// src/lang/locale/en.ts
var en_default = {
  // Markdown navigator menu: change heading level
  "Change Level": "Change Level",
  Increase: "Increase",
  "Increase Recursively": "Increase Recursively",
  Decrease: "Decrease",
  "Decrease Recursively": "Decrease Recursively",
  "Maximum level reached": "Maximum level reached",
  "Minimum level reached": "Minimum level reached",
  "Settings for Quiet Outline.": "Settings for Quiet Outline.",
  setting_title: "XU Quiet Outline",
  setting_header_desc: "Renders an outline tree in the sidebar: click to jump, two-way scroll/cursor locate, level slider, drag to restructure headings, wikilink coloring and style customization.",
  Documentation: "Documentation",
  "View the full manual on GitHub": "View the full manual on GitHub",
  GitHub: "GitHub",
  "Set Primary Color": "Set Primary Color Light/Dark",
  "Patch default color": "Patch default color",
  "Set Rainbow Line Color": "Set Rainbow Line Color",
  "Render Markdown": "Render Markdown",
  "Render heading string as markdown format.": "Render heading string as markdown format",
  "Search Support": "Search Support",
  "Add a searching area on the top": "Add a search area on the top",
  "Level Switch": "Level Switch",
  "Expand headings to certain level.": "Expand headings to certain level",
  "Default Level": "Default Level",
  "Default expand level when opening a new note.": "Default expand level",
  "No expand": "No expand",
  "To Bottom": "To Bottom",
  Reset: "Reset",
  "Input to search": "Input to search",
  "result(s):": "result(s):",
  "Hide Unsearched": "Hide Unsearched",
  "Hide irrelevant headings when searching": "Hide irrelevant headings when searching",
  "Regex Search": "Regex Search",
  "Search headings using regular expression": "Search headings using regular expression",
  "Auto Expand": "Auto Expand",
  "Auto expand and collapse headings when scrolling and cursor position change": "Auto expand and collapse headings when scrolling and cursor position change",
  "Auto Scroll Into View": "Auto Scroll Into View",
  "Auto scroll located heading into view": "Auto scroll located heading into view",
  "Only Expand": "Only Expand",
  "Expand and Collapse Rest": "Expand and Collapse Rest",
  "Expand and Collapse Rest to Default": "Expand and Collapse Rest to Default",
  "Expand and Collapse Rest to Setting Level (Level Switch)": "Expand and Collapse Rest to Setting Level (Level Switch)",
  Disabled: "Disabled",
  "Locate By Cursor": "Locate By Cursor",
  "Show Popover on hover": "Show Popover on hover",
  "Press functional key and move cursor to heading": "Press functional key and move cursor to heading",
  Disable: "Disable",
  "Highlight and Auto expand postion will be determined by cursor position": "Highlight and Auto expand postion will be determined by cursor position",
  Ellipsis: "Ellipsis",
  "Tooltip direction": "Tooltip direction",
  "Keep one line per heading": "Keep one line per heading",
  "Persist Markdown States": "Persist Markdown States",
  "Save and restore cursor, scroll state of markdown note, as well as expanded/collapsed state of headings": "Save and restore cursor, scroll state of markdown note, as well as expanded/collapsed state of headings",
  "Save Cursor Position": "Save Cursor Position",
  "Save and restore cursor position of markdown note": "Save and restore cursor position of markdown note",
  "Save Scroll Position": "Save Scroll Position",
  "Save and restore scroll position of markdown note": "Save and restore scroll position of markdown note",
  "Save Heading Expansion State": "Save Heading Expansion State",
  "Save and restore expanded/collapsed state of headings": "Save and restore expanded/collapsed state of headings",
  "Save Delay": "Save Delay",
  "Delay after the last change before saving markdown-states.json, in seconds. Set to 0 to save immediately.": "Delay after the last change before saving markdown-states.json, in seconds. Set to 0 to save immediately.",
  "Keep Search Input": "Keep Search Input",
  "Keep search input when switching between notes": "Keep search input when switching between notes",
  "Drag headings to modify note": "Drag headings to modify note",
  "❗ This will modify note content, be careful.": "❗ This will modify note content, be careful",
  "Text Direction": "Text Direction",
  "is decided by": "is decided by",
  "Export Format": "Export Format",
  // Settings tabs
  General: "General",
  Styles: "Styles",
  Canvas: "Canvas",
  Bases: "Bases",
  // Canvas settings
  "Canvas Sort Order": "Canvas Sort Order",
  "Heading Truncate Length": "Heading Truncate Length",
  "Sort method for canvas nodes": "Sort method for canvas nodes",
  "Sort by Area": "Sort by Area (Big -> Small)",
  "Sort by Name (A -> Z)": "Sort by Name (A -> Z)",
  "Sort by Name (Z -> A)": "Sort by Name (Z -> A)",
  "Show group nodes": "Show group nodes",
  "Show file nodes": "Show file nodes",
  "Show text nodes": "Show text nodes",
  "Show link nodes": "Show link nodes",
  // Bases settings
  "Display Property": "Display Property",
  "Property shown for each row": "Property shown for each row, e.g. file.name, file.path",
  "Bases syntax": "Bases syntax",
  // menu
  Copy: "Copy",
  Heading: "Heading",
  "Heading and children headings": "Heading and children headings",
  "Heading and Content": "Heading and Content",
  "Heading and siblings headings": "Heading and siblings headings",
  "Rename heading": "Rename",
  "Link of heading": "Link of heading",
  "Collapse Recursively": "Collapse Recursively",
  "Expand Recursively": "Expand Recursively",
  "Collapse Sibling": "Collapse Sibling",
  "Expand Sibling": "Expand Sibling",
  "Vimlize Canvas": "Vimlize Canvas",
  "Add vim-like keymap for canvas": "Add vim-like keymap for canvas",
  // Confirm modal
  Confirm: "Confirm",
  Cancel: "Cancel",
  // Markdown navigator menu
  Delete: "Delete",
  // Confirm prompt (dangerous operation)
  "This will delete heading:": "This will delete heading:",
  "This will modify the note content. Continue?": "This will modify the note content. Continue?",
  // Drag & drop notices
  "Cannot move heading into its own subtree": "Cannot move heading into its own subtree",
  "Outline changed while dragging, move aborted": "Outline changed while dragging, move aborted",
  "Failed to move heading": "Failed to move heading",
  // Text style settings
  "Font Size": "Font Size",
  "Custom font size for outline text (e.g., 14px, 1rem)": "Custom font size for outline text (e.g., 14px, 1rem)",
  "Font Family": "Font Family",
  "Custom font family for outline text": "Custom font family for outline text",
  "Font Weight": "Font Weight",
  "Custom font weight for outline text (e.g., normal, bold, 400, 700)": "Custom font weight for outline text (e.g., normal, bold, 400, 700)",
  "Line Height": "Line Height",
  "Custom line height for outline text (e.g., 1.5, 2)": "Custom line height for outline text (e.g., 1.5, 2)",
  "Line Gap": "Line Gap",
  "Custom gap between lines (e.g., 4px, 0.5rem)": "Custom gap between lines (e.g., 4px, 0.5rem)",
  // Font color settings
  "Custom Font Color": "Custom Font Color",
  "Enable custom font colors for different heading levels": "Enable custom font colors for different heading levels",
  "H1 Color": "H1 Color",
  "H2 Color": "H2 Color",
  "H3 Color": "H3 Color",
  "H4 Color": "H4 Color",
  "H5 Color": "H5 Color",
  "H6 Color": "H6 Color",
  "General Settings": "General",
  "Default expanding level": "Default expanding level",
  "Default expanding level desc": "Default heading expansion level when opening a note. 0 collapses all; larger numbers expand deeper (up to H5).",
  "Indent level": "Indent level",
  "Auto expand mode": "Auto expand mode",
  "Control the expansion behavior when a leaf is changed": "Control the expansion behavior when a leaf is changed",
  "Drag to modify": "Drag to modify",
  "Expand and collapse the rest to default level": "Expand and collapse the rest to default level",
  "Expand and collapse the rest to the level below": "Expand and collapse the rest to the level below",
  "Allow dragging headings in the outline to change their level and position. This will modify the note content.": "Allow dragging headings in the outline to change their level and position. This will modify the note content.",
  "Locate by cursor": "Locate by cursor",
  "Highlight the nearest heading by the cursor": "Highlight the nearest heading by the cursor",
  "Auto scroll into view": "Auto scroll into view",
  "Highlighting headings auto scroll into view": "Highlighting headings auto scroll into view",
  "Style Settings": "Style",
  "Override primary color": "Override primary color",
  "Primary color (light mode)": "Primary color (light mode)",
  "Primary color (dark mode)": "Primary color (dark mode)",
  "This setting is used to override the primary color of the theme": "This setting is used to override the primary color of the theme",
  "Rainbow line color": "Rainbow line color",
  "The color of the line can be customized by rainbow": "The color of the line can be customized by rainbow",
  "Rainbow line colors": "Rainbow line colors",
  "Font Settings": "Font",
  "Font size": "Font size",
  "Font family": "Font family",
  "Font weight": "Font weight",
  "Line height": "Line height",
  "Line gap": "Line gap",
  // Unified settings keys (2026-09-23 house style)
  setting_language: "UI Language",
  setting_language_desc: "Select the display language for the settings panel",
  lang_auto: "Follow system",
  lang_zh: "简体中文",
  lang_en: "English",
  "lang_zh-TW": "繁體中文",
  sec_advanced: "Advanced",
  setting_docs: "Documentation",
  setting_docs_desc: "View the full manual on GitHub",
  btn_github: "GitHub"
};

// src/lang/locale/zh-TW.ts
var zh_TW_default = {
  // Markdown navigator menu: change heading level（調整標題層級）
  "Change Level": "調整層級",
  setting_title: "XU Quiet Outline（大綱）",
  setting_header_desc: "在側邊欄產生大綱樹，支援點擊跳轉、捲動與游標雙向定位、層級滑條、拖曳改層級、雙鏈標題著色與樣式定製。",
  Documentation: "使用文檔",
  "View the full manual on GitHub": "在 GitHub 查看完整使用說明",
  GitHub: "GitHub",
  Increase: "增加",
  "Increase Recursively": "遞迴增加",
  Decrease: "減少",
  "Decrease Recursively": "遞迴減少",
  "Maximum level reached": "已達到最大層級",
  "Minimum level reached": "已達到最小層級",
  // Confirm modal
  Confirm: "確認",
  Cancel: "取消",
  // Markdown navigator menu
  Delete: "刪除",
  // Confirm prompt (dangerous operation)
  "This will delete heading:": "即將刪除標題：",
  "This will modify the note content. Continue?": "此操作會修改筆記內容，是否繼續？",
  "Settings for Quiet Outline.": "Quiet Outline 的設定頁面",
  "Set Primary Color": "設定主要顏色 明/暗",
  "Patch default color": "使用設定覆蓋預設主要顏色",
  "Set Rainbow Line Color": "設定彩虹大綱線顏色",
  "Render Markdown": "渲染 markdown 元素",
  "Render heading string as markdown format.": "以 markdown 格式渲染標題文字",
  "Search Support": "開啟搜尋",
  "Add a searching area on the top": "在頂部新增一個搜尋框",
  "Level Switch": "層級切換器",
  "Expand headings to certain level.": "展開標題到特定層級",
  "Default Level": "預設層級",
  "Default expand level when opening a new note.": "開啟新筆記時，標題展開到的預設層級",
  "No expand": "不展開",
  "To Bottom": "跳轉到筆記末尾",
  Reset: "重置",
  "Input to search": "輸入以搜尋",
  "result(s):": "筆相符結果：",
  "Hide Unsearched": "過濾未搜尋的標題",
  "Hide irrelevant headings when searching": "搜尋時，隱藏未命中的標題",
  "Regex Search": "正則搜尋",
  "Search headings using regular expression": "支援使用正則運算式來搜尋",
  "Auto Expand": "自動展開",
  "Auto expand and collapse headings when scrolling and cursor position change": "當捲動頁面或游標改變時，自動跟隨目前所在標題並展開",
  "Auto Scroll Into View": "自動捲動到定位的標題",
  "Auto scroll located heading into view": "當捲動或游標位置變化時，大綱自動捲動到相應標題",
  "Only Expand": "僅展開目前標題",
  "Expand and Collapse Rest": "展開同時摺疊剩餘標題",
  "Expand and Collapse Rest to Default": "展開同時摺疊剩餘標題至預設層級",
  "Expand and Collapse Rest to Setting Level (Level Switch)": "展開同時摺疊剩餘標題至設定層級（層級切換器）",
  Disabled: "關閉自動展開",
  "Locate By Cursor": "定位到游標處",
  "Highlight and Auto expand postion will be determined by cursor position": "高亮和自動展開位置將由游標位置決定",
  "Show Popover on hover": "滑鼠懸停在標題時顯示筆記內容",
  "Press functional key and move cursor to heading": "按住功能鍵，移動游標到標題處",
  Disable: "關閉",
  Ellipsis: "省略長標題",
  "Tooltip direction": "完整標題顯示方向",
  "Keep one line per heading": "保持標題只有一行，省略多餘部分",
  "Persist Markdown States": "持續保存 Markdown 狀態",
  "Save and restore cursor, scroll state of markdown note, as well as expanded/collapsed state of headings": "儲存並恢復 Markdown 筆記的游標、捲動狀態，以及標題的展開/摺疊狀態",
  "Save Cursor Position": "儲存游標位置",
  "Save and restore cursor position of markdown note": "儲存並恢復 Markdown 筆記的游標位置",
  "Save Scroll Position": "儲存捲動位置",
  "Save and restore scroll position of markdown note": "儲存並恢復 Markdown 筆記的捲動位置",
  "Save Heading Expansion State": "儲存標題展開狀態",
  "Save and restore expanded/collapsed state of headings": "儲存並恢復標題的展開/摺疊狀態",
  "Save Delay": "儲存延遲",
  "Delay after the last change before saving markdown-states.json, in seconds. Set to 0 to save immediately.": "最後一次變化後延遲儲存 markdown-states.json 的秒數。設定為 0 時立即儲存。",
  "Keep Search Input": "保留搜尋輸入",
  "Keep search input when switching between notes": "切換筆記時保留搜尋輸入",
  "Drag headings to modify note": "啟用拖曳標題來調整文件結構",
  "❗ This will modify note content, be careful.": "❗ 拖曳操作會改變文件內容，請小心使用",
  "Text Direction": "文字方向",
  "is decided by": "由什麼決定",
  "Export Format": "標題輸出格式",
  // 設定頁籤
  Canvas: "白板",
  Bases: "資料庫",
  General: "一般設定",
  Styles: "樣式設定",
  // Canvas 相關設定
  "Canvas Sort Order": "白板大綱排序",
  "Heading Truncate Length": "標題截斷長度",
  "Show group nodes": "顯示群組節點",
  "Show file nodes": "顯示檔案節點",
  "Show text nodes": "顯示文字節點",
  "Show link nodes": "顯示連結節點",
  "Sort method for canvas nodes": "白板卡片的排序邏輯",
  "Sort by Area": "按面積 (大 -> 小)",
  "Sort by Name (A -> Z)": "按名稱 (A -> Z)",
  "Sort by Name (Z -> A)": "按名稱 (Z -> A)",
  // Bases 相關設定
  "Display Property": "顯示屬性",
  "Property shown for each row": "每一列顯示的屬性，例如 file.name、file.path",
  "Bases syntax": "Bases 語法",
  // menu
  Copy: "複製",
  Heading: "標題",
  "Heading and children headings": "標題和子標題",
  "Heading and Content": "該段內容",
  "Heading and siblings headings": "標題和兄弟標題",
  "Rename heading": "重命名標題",
  "Link of heading": "標題連結",
  // Context menu items
  "Collapse Recursively": "遞迴摺疊",
  "Expand Recursively": "遞迴展開",
  "Collapse Sibling": "摺疊同級標題",
  "Expand Sibling": "展開同級標題",
  "Vimlize Canvas": "Vim Canvas",
  "Add vim-like keymap for canvas": "給 Canvas 新增 Vim 風格的快捷鍵",
  // New settings
  "Font Size": "字型大小",
  "Custom font size for outline text (e.g., 14px, 1rem)": "大綱文字的自訂字型大小（例如：14px, 1rem）",
  "Font Family": "字型家族",
  "Custom font family for outline text": "大綱文字的自訂字型家族",
  "Font Weight": "字型粗細",
  "Custom font weight for outline text (e.g., normal, bold, 400, 700)": "大綱文字的自訂字型粗細（例如：normal, bold, 400, 700）",
  "Line Height": "行高",
  "Custom line height for outline text (e.g., 1.5, 2)": "大綱文字的自訂行高（例如：1.5, 2）",
  "Line Gap": "行間距",
  "Custom gap between lines (e.g., 4px, 0.5rem)": "行之間的自訂間距（例如：4px, 0.5rem）",
  // Font color settings
  "Custom Font Color": "自訂字型顏色",
  "Enable custom font colors for different heading levels": "為不同級別的標題啟用自訂字型顏色",
  "H1 Color": "H1 顏色",
  "H2 Color": "H2 顏色",
  "H3 Color": "H3 顏色",
  "H4 Color": "H4 顏色",
  "H5 Color": "H5 顏色",
  "H6 Color": "H6 顏色",
  // 分組標題（guidelines：不得含「設定/Settings」字樣）
  "General Settings": "常規",
  "Style Settings": "樣式",
  "Font Settings": "字體",
  "Indent level": "縮排層級",
  "Primary color (light mode)": "主色（淺色模式）",
  "Primary color (dark mode)": "主色（深色模式）",
  "Rainbow line colors": "彩虹縮排線顏色",
  // 設置頁統一鍵（2026-09-23 規範）
  setting_language: "介面語言",
  setting_language_desc: "選擇設定面板的顯示語言",
  lang_auto: "跟隨系統",
  lang_zh: "简体中文",
  lang_en: "English",
  "lang_zh-TW": "繁體中文",
  sec_advanced: "進階",
  setting_docs: "使用文件",
  setting_docs_desc: "在 GitHub 查看完整使用說明",
  btn_github: "GitHub"
};

// src/lang/helper.ts
var import_obsidian2 = require("obsidian");
var localeMap = {
  en: en_default,
  zh: zh_default,
  "zh-TW": zh_TW_default
};
var currentLang = "auto";
function resolveLang(lang) {
  if (lang !== "auto") return lang;
  return (0, import_obsidian2.getLanguage)() || "en";
}
function setLanguage(lang) {
  currentLang = lang || "auto";
}
function t(text) {
  const resolved = resolveLang(currentLang);
  const locale = localeMap[resolved];
  return locale && locale[text] || en_default[text];
}

// src/utils/diff.ts
var MODIFY_CHECK_STEP = 5;
function diff(prev, cur) {
  let i = 0, j = 0;
  const res = [];
  while (i < prev.length && j < cur.length) {
    if (prev[i].title === cur[j].title && prev[i].level === cur[j].level) {
      i++;
      j++;
      continue;
    }
    const action = addOrRemoveOrModify(prev, cur, i, j);
    if (action.type == "modify") {
      const levelChangeType = prev[i].level < prev[i + 1].level ? cur[j].level < cur[j + 1].level ? "parent2parent" : "parent2child" : cur[j].level < cur[j + 1].level ? "child2parent" : "child2child";
      res.push({
        type: action.type,
        begin: i,
        length: action.length,
        levelChange: prev[i].level !== cur[j].level,
        levelChangeType
      });
    } else {
      res.push({
        type: action.type,
        begin: i,
        length: action.length
      });
    }
    if (action.type === "add") {
      j += action.length;
    } else if (action.type === "remove") {
      i += action.length;
    } else {
      i += action.length;
      j += action.length;
    }
  }
  if (i === prev.length && j !== cur.length) {
    res.push({
      type: "add",
      begin: i,
      length: cur.length - j
    });
  }
  if (i !== prev.length && j === cur.length) {
    res.push({
      type: "remove",
      begin: i,
      length: prev.length - i
    });
  }
  return res;
}
function addOrRemoveOrModify(prev, cur, i, j) {
  const stepAdd = findSteps(prev[i], cur, j);
  const stepRm = findSteps(cur[j], prev, i);
  const stepMod = findModifyStep(prev, cur, i, j);
  const res = [
    { type: "add", length: stepAdd },
    { type: "remove", length: stepRm },
    { type: "modify", length: stepMod }
  ];
  res.sort((a, b) => a.length - b.length);
  if (res[0].type == "add" && res[1].type == "remove" && res[0].length === res[1].length) {
    return res[1];
  }
  return res[0];
}
function findSteps(target, arr, from) {
  const res = arr.slice(from);
  let step = res.findIndex(
    (heading) => heading.title === target.title && heading.level === target.level
  );
  step = step < 0 ? res.length : step;
  return step;
}
function findModifyStep(prev, cur, i, j) {
  const step = Math.min(prev.length - i - 1, cur.length - j - 1, MODIFY_CHECK_STEP);
  for (let id = 1; step > 0 && id <= step; id++) {
    if (prev[i + id].title === cur[j + id].title && prev[i + id].level === cur[j + id].level) {
      return id;
    }
  }
  return Number.MAX_VALUE;
}
function calcModifies(prev, cur) {
  const headingDiff = diff(prev, cur);
  const modifyKeys = {
    offsetModifies: [],
    removes: [],
    adds: [],
    modifies: []
  };
  let offset = 0;
  headingDiff.forEach((diff2) => {
    switch (diff2.type) {
      case "add": {
        modifyKeys.adds.push({
          // add position in new store.headers
          begin: offset + diff2.begin
        });
        offset += diff2.length;
        modifyKeys.offsetModifies.push({
          begin: diff2.begin,
          offset
        });
        break;
      }
      case "remove": {
        offset -= diff2.length;
        modifyKeys.offsetModifies.push({
          begin: diff2.begin + diff2.length,
          offset
        });
        modifyKeys.removes.push({
          begin: diff2.begin,
          length: diff2.length
        });
        break;
      }
      case "modify": {
        if (!diff2.levelChange || diff2.levelChangeType === "child2child") {
          break;
        }
        modifyKeys.modifies.push({
          oldBegin: diff2.begin,
          newBegin: diff2.begin + offset,
          levelChangeType: diff2.levelChangeType
        });
        break;
      }
    }
  });
  return modifyKeys;
}

// src/utils/md-process.ts
async function parseMetaDataCache(app, text) {
  const res = await app.metadataCache.computeMetadataAsync(new TextEncoder().encode(text).buffer);
  return res;
}
async function parseMarkdown(text, app) {
  const res = await parseMetaDataCache(app, text);
  const headings = res.headings || [];
  const sections = res.sections || [];
  const content = {
    preContent: "",
    children: []
  };
  const stack = [
    {
      heading: "",
      headingLevel: 0,
      headingExpaned: false,
      id: -1,
      content,
      type: "section"
    }
  ];
  let start = 0, end = 0, headingIndex = 0;
  for (const section of sections) {
    if (section.type === "heading") {
      end = Math.max(section.position.start.offset, 0);
      stack.last().content.preContent = text.slice(start, end);
      while (headings[headingIndex].level <= stack.last().headingLevel) {
        stack.pop();
      }
      const newEntry = {
        heading: headings[headingIndex].heading,
        headingLevel: headings[headingIndex].level,
        headingExpaned: false,
        id: headingIndex,
        rawLine: text.slice(section.position.start.offset, section.position.end.offset),
        content: {
          preContent: "",
          children: []
        },
        type: "section"
      };
      stack.last().content.children.push(newEntry);
      stack.push(newEntry);
      start = headings[headingIndex].position.end.offset + 1;
      headingIndex++;
    }
  }
  let preContent = text.slice(start);
  if (stack.length > 1 && !preContent.endsWith("\n")) {
    preContent += "\n";
  }
  stack.last().content.preContent = preContent;
  return stack[0];
}
function moveHeading(root, fromNo, toNo, position) {
  const [fromParent, from] = findSection(root, fromNo);
  const [toParent, to] = findSection(root, toNo);
  if (from === to || containsSection(from, to)) {
    return false;
  }
  const newFrom = structuredClone(from);
  switch (position) {
    case "before":
      toParent.content.children.splice(toParent.content.children.indexOf(to), 0, newFrom);
      modifyHeadingLevel(newFrom, to.headingLevel - from.headingLevel);
      break;
    case "after":
      toParent.content.children.splice(toParent.content.children.indexOf(to) + 1, 0, newFrom);
      modifyHeadingLevel(newFrom, to.headingLevel - from.headingLevel);
      break;
    case "inside":
      to.content.children.push(newFrom);
      modifyHeadingLevel(newFrom, to.headingLevel - from.headingLevel + 1);
      break;
  }
  fromParent.content.children.splice(fromParent.content.children.indexOf(from), 1);
  return true;
}
function findSection(root, id) {
  const res = findSectionIn(root, root, id);
  if (!res) {
    throw new Error(`section ${id} not found`);
  }
  return res;
}
function findSectionIn(root, parent, id) {
  if (root.id === id) return [parent, root];
  for (const child of root.content.children) {
    const res = findSectionIn(child, root, id);
    if (res) return res;
  }
}
function containsSection(ancestor, node) {
  if (ancestor === node) return true;
  return ancestor.content.children.some((child) => containsSection(child, node));
}
function stringifyContent(content) {
  return content.preContent + content.children.map(stringifySection).join("");
}
function stringifySection(section) {
  const heading = section.rawLine ?? "#".repeat(section.headingLevel) + " " + section.heading;
  const content = stringifyContent(section.content);
  return section.id < 0 ? content : `${heading}
${content}`;
}
function modifyHeadingLevel(section, delta) {
  section.headingLevel = Math.min(6, Math.max(1, section.headingLevel + delta));
  section.rawLine = void 0;
  section.content.children.forEach((child) => {
    modifyHeadingLevel(child, delta);
  });
}

// src/navigators/markdown.ts
var plugin;
var MarkDownNav = class extends Nav {
  constructor(_plugin, view) {
    super(_plugin, view);
    plugin = _plugin;
  }
  getId() {
    return "markdown";
  }
  async getHeaders() {
    const cache = this.view.file && this.plugin.app.metadataCache.getFileCache(this.view.file);
    const headers = structuredClone(cache?.headings) || [];
    return headers.map((cache2) => ({
      title: cache2.heading,
      level: cache2.level,
      line: cache2.position.start.line,
      position: cache2.position
    }));
  }
  async updateHeaders() {
    const headings = await this.getHeaders();
    store.modifyKeys = calcModifies(store.headers, headings);
    store.headers = headings;
  }
  async jump(index) {
    const line = getHeader(index).line;
    const cursor = {
      from: { line, ch: 0 },
      to: { line, ch: 0 }
    };
    const state = { line, cursor };
    void this.plugin.startJumping();
    plugin.outlineView?.onPosChange(index);
    window.setTimeout(() => {
      this.view.app.workspace.setActiveLeaf(this.view.leaf, { focus: true });
      this.view.setEphemeralState(state);
    });
  }
  async install() {
    this.plugin.registerEditorExtension([editorEvent]);
  }
  async onload() {
    this.registerEvent(eventBus.on("cursorchange", handleCursorChange));
    this.registerDomEvent(this.view.contentEl, "scroll", handleScroll, true);
  }
  async onunload() {
  }
  toBottom() {
    const lines = this.view.data.split("\n");
    const scroll = () => {
      this.view.setEphemeralState({ line: lines.length - 5 });
    };
    scroll();
    window.setTimeout(scroll, 100);
  }
  getDefaultLevel() {
    let level;
    if (this.view.file) {
      const cache = this.plugin.app.metadataCache.getFileCache(this.view.file);
      const raw = cache?.frontmatter?.["qo-default-level"];
      if (typeof raw === "number") {
        level = raw;
      } else if (typeof raw === "string") {
        level = parseInt(raw);
      }
    }
    if (level !== void 0 && Number.isFinite(level)) {
      return Math.max(0, Math.min(5, level));
    }
    const fallback = parseInt(plugin.settings.expand_level);
    return Number.isFinite(fallback) ? Math.max(0, Math.min(5, fallback)) : 2;
  }
  getPath() {
    return this.view.file?.path ?? "";
  }
  handlesFile(file) {
    return this.view.file === file;
  }
  async handleDrop(from, to, position) {
    const file = this.view.file;
    if (!file) return;
    try {
      await this.view.save();
      const data = await plugin.app.vault.read(file);
      const structure = await parseMarkdown(data, this.view.app);
      if (!verifyHeadingIndex(structure, from) || !verifyHeadingIndex(structure, to)) {
        throw new DropAbortedError(t("Outline changed while dragging, move aborted"));
      }
      if (!moveHeading(structure, from, to, position)) {
        throw new DropAbortedError(t("Cannot move heading into its own subtree"));
      }
      await plugin.app.vault.modify(file, stringifySection(structure));
    } catch (e) {
      if (e instanceof DropAbortedError) {
        new import_obsidian3.Notice(e.message);
      } else {
        console.error("[xu-quiet-outline] failed to move heading:", e);
        new import_obsidian3.Notice(`${t("Failed to move heading")}: ${String(e)}`);
      }
    }
  }
};
var DropAbortedError = class extends Error {
};
function verifyHeadingIndex(root, index) {
  const header = store.headers[index];
  if (!header) return false;
  try {
    const [, section] = findSection(root, index);
    return section.heading === header.title && section.headingLevel === header.level;
  } catch {
    return false;
  }
}
function getHeader(idx) {
  return store.headers[idx];
}
function handleCursorChange(docChanged) {
  if (!plugin.allow_cursor_change || !plugin.jumping || docChanged) {
    return;
  }
  if (plugin.settings.locate_by_cursor) {
    plugin.block_scroll();
    const current = currentLine(false, true);
    const index = nearestHeading(current);
    if (index === void 0) return;
    plugin.outlineView?.onPosChange(index);
  }
}
function currentLine(fromScroll, isSourcemode) {
  const markdownView = plugin.navigator.view;
  if (!markdownView.editor) {
    return 0;
  }
  if (plugin.settings.locate_by_cursor && !fromScroll) {
    return isSourcemode ? markdownView.editor.getCursor("from").line : Math.ceil(markdownView.previewMode.getScroll());
  } else {
    return isSourcemode ? getCurrentLineFromEditor(markdownView.editor.cm) : getCurrentLineFromPreview(markdownView);
  }
}
function getCurrentLineFromEditor(editorView) {
  const { y, height } = editorView.dom.getBoundingClientRect();
  const middle = y + height / 2;
  const lineBlocks = editorView.viewportLineBlocks;
  let line = 0;
  lineBlocks.forEach((lb) => {
    const node = editorView.domAtPos(lb.from).node;
    const el = node.nodeName == "#text" ? node.parentNode : node;
    const elRect = el.getBoundingClientRect();
    const base = elRect.y + elRect.height / 2;
    if (base <= middle) {
      line = editorView.state.doc.lineAt(lb.from).number;
    }
  });
  return Math.max(line - 2, 0);
}
function getCurrentLineFromPreview(view) {
  const renderer = view.previewMode.renderer;
  const previewEl = renderer.previewEl;
  const rect = previewEl.getBoundingClientRect();
  const middle = rect.y + rect.height / 2;
  const elsInViewport = previewEl.querySelectorAll(
    ".markdown-preview-sizer>div[class|=el]"
  );
  let line = 0;
  elsInViewport.forEach((el) => {
    const { y } = el.getBoundingClientRect();
    if (y <= middle) {
      const section = renderer.getSectionForElement(el);
      if (section) {
        line = section.lineStart || // this property has been removed since Obsidian v1.9.0
        section.start.line;
      }
    }
  });
  return line;
}
function nearestHeading(line) {
  let current_heading = null;
  let i = store.headers.length;
  while (--i >= 0) {
    if (getHeader(i).line <= line) {
      current_heading = getHeader(i);
      break;
    }
  }
  if (!current_heading) {
    return;
  }
  return i;
}
var handleScroll = (0, import_obsidian3.debounce)(_handleScroll, 150, false);
function _handleScroll(evt) {
  if (!plugin.allow_scroll) {
    return;
  }
  if (!plugin.jumping) {
    plugin.jumping = true;
    return;
  }
  const target = evt.target;
  if (!target.classList.contains("markdown-preview-view") && !target.classList.contains("cm-scroller") && // fix conflict with outliner
  // https://github.com/guopenghui/obsidian-quiet-outline/issues/133
  !target.classList.contains("outliner-plugin-list-lines-scroller")) {
    return;
  }
  const isSourcemode = plugin.navigator.view.getMode() === "source";
  const current = currentLine(true, isSourcemode);
  const index = nearestHeading(current);
  if (index === void 0) return;
  plugin.outlineView?.onPosChange(index);
}

// src/navigators/index.ts
var NAVIGATORS = {
  dummy: DummyNav,
  markdown: MarkDownNav
};
function isKnownNav(name) {
  return name in NAVIGATORS;
}
function createKnownNav(name, plugin2, view) {
  const Ctor = NAVIGATORS[name];
  return new Ctor(plugin2, view);
}
function createNav(name, plugin2, view) {
  if (isKnownNav(name)) {
    return createKnownNav(name, plugin2, view);
  }
  return new DummyNav(plugin2, view);
}

// src/ui/view.ts
var import_obsidian5 = require("obsidian");

// src/ui/theme.ts
function applyTheme(container) {
  const { theme } = store;
  const line = (hex) => `rgba(${hexToRGB(hex)}, 0.6)`;
  const nativeGuide = "var(--nav-indentation-guide-color)";
  const colors = theme.rainbowLine ? [
    line(theme.rainbowColor1),
    line(theme.rainbowColor2),
    line(theme.rainbowColor3),
    line(theme.rainbowColor4),
    line(theme.rainbowColor5)
  ] : [nativeGuide, nativeGuide, nativeGuide, nativeGuide, nativeGuide];
  colors.forEach((c, i) => container.style.setProperty(`--qo-line-${i + 1}`, c));
  container.style.setProperty("--custom-font-size", theme.fontSize);
  container.style.setProperty("--custom-font-family", theme.fontFamily);
  container.style.setProperty("--custom-font-weight", theme.fontWeight);
  container.style.setProperty("--custom-line-height", theme.lineHeight);
  container.style.setProperty("--custom-line-gap", theme.lineGap);
  const primary = theme.patchColor ? store.dark ? theme.primaryColorDark : theme.primaryColorLight : getDefaultColor();
  container.style.setProperty("--qo-primary", primary);
}
function getDefaultColor() {
  const el = activeDocument.body.createDiv({
    attr: { style: "width: 0px; height: 0px; background-color: var(--interactive-accent);" }
  });
  const color = activeWindow.getComputedStyle(el, null).getPropertyValue("background-color");
  el.remove();
  return color || "#7c3aed";
}
function hexToRGB(hex) {
  return `${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)}`;
}

// src/ui/expand.ts
var MEMORY_KEY = "xu-quiet-outline-expand-memory";
var MEMORY_MAX_FILES = 800;
function isMemoryEntry(v) {
  if (typeof v !== "object" || v === null) return false;
  const e = v;
  return typeof e.level === "number" && Array.isArray(e.keys) && e.keys.every((k) => typeof k === "number");
}
function isMemoryMap(v) {
  if (typeof v !== "object" || v === null) return false;
  return Object.values(v).every(
    (e) => Array.isArray(e) && e.every((k) => typeof k === "number") || isMemoryEntry(e)
  );
}
function loadAllMemory(app) {
  try {
    const raw = app.loadLocalStorage(MEMORY_KEY);
    if (typeof raw !== "string" || raw.length === 0) return {};
    const parsed = JSON.parse(raw);
    return isMemoryMap(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
function saveAllMemory(app, map) {
  try {
    app.saveLocalStorage(MEMORY_KEY, JSON.stringify(map));
  } catch {
  }
}
function readMemory(app, path) {
  return loadAllMemory(app)[path];
}
function writeMemory(app, path, keys, level) {
  if (!path) return;
  const map = loadAllMemory(app);
  map[path] = { level, keys };
  const paths = Object.keys(map);
  if (paths.length > MEMORY_MAX_FILES) {
    for (const p of paths.slice(0, paths.length - MEMORY_MAX_FILES)) {
      delete map[p];
    }
  }
  saveAllMemory(app, map);
}
var ExpandState = class {
  /** 展开的 header index 集合 */
  keys = /* @__PURE__ */ new Set();
  level = 2;
  plugin;
  constructor(plugin2) {
    this.plugin = plugin2;
  }
  /** index 处标题是否为父节点（有下级标题） */
  isParent(index) {
    const { headers } = store;
    return index >= 0 && index < headers.length - 1 && headers[index + 1].level > headers[index].level;
  }
  /** 过滤掉无效 key（越界或不再是父节点） */
  safeFilter(keys) {
    const res = /* @__PURE__ */ new Set();
    for (const k of keys) {
      if (this.isParent(k)) res.add(k);
    }
    return res;
  }
  modify(keys, mode = "replace") {
    if (mode === "replace") {
      this.keys = this.safeFilter(keys);
    } else if (mode === "remove") {
      for (const k of keys) this.keys.delete(k);
    } else {
      this.keys = this.safeFilter([...this.keys, ...keys]);
    }
  }
  getDefaultLevel() {
    return this.plugin.navigator.getDefaultLevel();
  }
  /** 级别滑杆切换：展开所有 level <= lev 的父节点 */
  switchLevel(lev) {
    this.level = lev;
    this.modify(filterKeysLessThanEqual(lev));
  }
  /** 根据当前文件路径恢复展开记忆；无记忆则按默认级别展开 */
  restore(path) {
    const remembered = readMemory(this.plugin.app, path);
    if (Array.isArray(remembered)) {
      if (remembered.length === 0) {
        this.switchLevel(this.getDefaultLevel());
      } else {
        this.keys = this.safeFilter(remembered);
        this.level = currentLevelOf(this.keys);
      }
    } else if (remembered) {
      this.keys = this.safeFilter(remembered.keys);
      const lv = Number(remembered.level);
      this.level = Number.isFinite(lv) ? Math.max(0, Math.min(5, lv)) : this.getDefaultLevel();
    } else {
      this.switchLevel(this.getDefaultLevel());
    }
  }
  /** 光标/滚动定位到 index 时的自动展开（4 种模式） */
  autoExpand(index) {
    if (this.plugin.settings.auto_expand_ext === "disable") return;
    const { headers } = store;
    const current = headers[index];
    if (!current) return;
    const should_expand = this.isParent(index) ? [index] : [];
    let curLevel = current.level;
    let i = index;
    while (i-- > 0) {
      if (headers[i].level < curLevel) {
        should_expand.push(i);
        curLevel = headers[i].level;
      }
      if (curLevel === 1) break;
    }
    if (this.plugin.settings.auto_expand_ext === "expand-and-collapse-rest-to-setting") {
      this.keys = this.safeFilter(filterKeysLessThanEqual(this.level));
    } else if (this.plugin.settings.auto_expand_ext === "expand-and-collapse-rest-to-default") {
      this.keys = this.safeFilter(filterKeysLessThanEqual(this.getDefaultLevel()));
    }
    this.modify(should_expand, "add");
  }
  /** 编辑导致 headers 变化后，按 diff 增量迁移展开状态（保持用户展开意图） */
  applyModifyKeys(modifyKeys) {
    const { offsetModifies, removes, adds, modifies } = modifyKeys;
    const newKeys = [...this.keys].filter((index) => {
      const notRemove = !removes.some(
        (r) => r.begin <= index && index < r.begin + r.length
      );
      const notParent2Child = !modifies.some(
        (m) => m.oldBegin === index && m.levelChangeType === "parent2child"
      );
      return notRemove && notParent2Child;
    }).map((index) => {
      const offsetBase = offsetModifies.findLastIndex((m) => m.begin <= index);
      if (offsetBase === -1) return index;
      return index + offsetModifies[offsetBase].offset;
    });
    modifies.filter((m) => m.levelChangeType === "child2parent").forEach((m) => newKeys.push(m.newBegin));
    adds.forEach((add) => {
      const path = ancestorsOf(add.begin);
      if (!this.isParent(add.begin)) path.pop();
      path.forEach((index) => newKeys.push(index));
    });
    this.modify([...new Set(newKeys)]);
  }
};
function filterKeysLessThanEqual(lev) {
  const res = [];
  const { headers } = store;
  for (let i = 0; i < headers.length; i++) {
    if (i === headers.length - 1 || headers[i + 1].level <= headers[i].level) continue;
    if (headers[i].level <= lev) res.push(i);
  }
  return res;
}
function ancestorsOf(index) {
  const { headers } = store;
  const res = [];
  if (index < 0 || !headers[index]) return res;
  let curLevel = headers[index].level + 1;
  for (let i = index; i >= 0; i--) {
    if (headers[i].level < curLevel) {
      res.push(i);
      curLevel = headers[i].level;
    }
  }
  return res.reverse();
}
function currentLevelOf(keys) {
  let max = 0;
  const { headers } = store;
  for (const k of keys) {
    if (headers[k]) max = Math.max(max, headers[k].level);
  }
  return Math.min(max, 5);
}

// src/ui/tree.ts
var import_obsidian4 = require("obsidian");

// src/ui/icons.ts
var ICON_TO_BOTTOM = "lucide-chevrons-down";
var ICON_RESET = "lucide-rotate-ccw";
var ICON_CHEVRON = "lucide-chevron-right";

// src/ui/tree.ts
var OVERSCAN = 6;
var WIKILINK_RE = /\[\[([^\][]+?)\]\]/g;
var TreeRenderer = class {
  constructor(container, viewport, handlers) {
    this.container = container;
    this.viewport = viewport;
    this.handlers = handlers;
    this.bindEvents();
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.remeasureIfNeeded());
      this.resizeObserver.observe(this.container);
    }
  }
  rows = [];
  rowEls = /* @__PURE__ */ new Map();
  rowHeight = 24;
  locateIdx = -1;
  selectedIdx = -1;
  draggingIdx = -1;
  measured = false;
  // 行高是否已成功实测（首帧面板可能未布局，测高为 0）
  resizeObserver;
  filterText = "";
  // ============ 渲染 ============
  /** 重算可见行列表并绘制（数据或展开状态变化后调用） */
  render() {
    this.rows = this.computeVisible();
    this.paint();
  }
  /** 仅按滚动位置重绘窗口（行数据不变） */
  paint() {
    const { rows } = this;
    const viewH = this.container.clientHeight;
    const start = Math.max(0, Math.floor(this.container.scrollTop / this.rowHeight) - OVERSCAN);
    const end = Math.min(
      rows.length,
      Math.ceil((this.container.scrollTop + viewH) / this.rowHeight) + OVERSCAN
    );
    const wanted = /* @__PURE__ */ new Set();
    for (let i = start; i < end; i++) wanted.add(rows[i].idx);
    for (const [idx, el] of this.rowEls) {
      if (!wanted.has(idx)) {
        el.remove();
        this.rowEls.delete(idx);
      }
    }
    for (let i = start; i < end; i++) {
      const row = rows[i];
      let el = this.rowEls.get(row.idx);
      if (!el) {
        el = this.createRow(row, i);
        this.rowEls.set(row.idx, el);
        this.viewport.appendChild(el);
      } else {
        this.updateRow(el, row, i);
      }
    }
    this.viewport.style.height = `${Math.max(rows.length * this.rowHeight, 1)}px`;
  }
  /**
   * 测量实际行高（字体/行高/行距设置变化后需重测）。
   * 返回是否测量成功：面板未布局时 offsetHeight 为 0，此时保留默认 24px，
   * 由 ResizeObserver / rAF 在布局完成后补测，绝不能把 0 落成 8px 导致行堆叠。
   */
  measureRow() {
    const probe = this.viewport.createDiv({
      cls: "qo-row qo-measure",
      attr: { style: "visibility:hidden" }
    });
    const content = probe.createDiv({ cls: "qo-content" });
    (0, import_obsidian4.setIcon)(content.createSpan({ cls: "qo-switcher" }), ICON_CHEVRON);
    content.createSpan({ cls: "qo-label", text: "Ag" });
    const h = probe.offsetHeight;
    probe.remove();
    if (h <= 0) return false;
    this.rowHeight = Math.max(h, 8);
    this.measured = true;
    return true;
  }
  /** 布局完成后的补测：仅在首帧测高失败、且容器已有尺寸时执行一次 */
  remeasureIfNeeded() {
    if (this.measured || this.container.clientHeight <= 0) return;
    if (this.measureRow()) this.render();
  }
  /** 释放观察器（面板卸载时调用） */
  destroy() {
    this.resizeObserver?.disconnect();
    this.resizeObserver = void 0;
  }
  // ============ 可见列表计算 ============
  computeVisible() {
    const { headers } = store;
    const ft = this.filterText.trim().toLowerCase();
    const expanded = this.handlers.getExpanded();
    if (ft) {
      const matched = /* @__PURE__ */ new Set();
      const keep = /* @__PURE__ */ new Set();
      for (let i = 0; i < headers.length; i++) {
        if (headers[i].title.toLowerCase().includes(ft)) {
          matched.add(i);
          let curLevel = headers[i].level + 1;
          for (let j = i; j >= 0; j--) {
            if (headers[j].level < curLevel) {
              keep.add(j);
              curLevel = headers[j].level;
            }
          }
        }
      }
      const res2 = [];
      for (let i = 0; i < headers.length; i++) {
        if (!keep.has(i)) continue;
        res2.push(this.makeRow(i, true));
      }
      return res2;
    }
    const res = [];
    const stack = [];
    for (let i = 0; i < headers.length; i++) {
      const h = headers[i];
      while (stack.length > 0 && stack[stack.length - 1].level >= h.level) stack.pop();
      const parentVisible = stack.every((s) => s.expanded);
      if (parentVisible) res.push(this.makeRow(i, false));
      const hasChildren = i < headers.length - 1 && headers[i + 1].level > h.level;
      stack.push({ level: h.level, expanded: hasChildren && expanded.has(i) });
    }
    return res;
  }
  makeRow(i, filterMode) {
    const h = store.headers[i];
    const hasChildren = i < store.headers.length - 1 && store.headers[i + 1].level > h.level;
    return {
      idx: i,
      level: h.level,
      hasChildren,
      expanded: filterMode || this.handlers.getExpanded().has(i)
    };
  }
  // ============ 行 DOM ============
  createRow(row, pos) {
    const el = this.viewport.createDiv({
      cls: "qo-row",
      attr: { "data-idx": String(row.idx) }
    });
    const content = el.createDiv({ cls: "qo-content" });
    this.fillContent(content, row);
    this.applyRowState(el, row);
    el.style.top = `${pos * this.rowHeight}px`;
    el.draggable = true;
    return el;
  }
  /** 填充行的内部结构（缩进线/箭头/标题） */
  fillContent(content, row) {
    content.className = `qo-content level-${row.level}`;
    content.empty();
    for (let j = 0; j < row.level - 1; j++) {
      content.createSpan({ cls: `qo-indent line-${Math.min(j + 1, 5)}` });
    }
    const switcher = content.createSpan({ cls: "qo-switcher" });
    if (row.hasChildren) {
      (0, import_obsidian4.setIcon)(switcher, ICON_CHEVRON);
      if (row.expanded) switcher.addClass("is-open");
    }
    const label = content.createSpan({ cls: "qo-label" });
    buildLabel(label, store.headers[row.idx].title);
  }
  /** 更新已存在行（位置/展开态/高亮/内容签名变化时重建内容） */
  updateRow(el, row, pos) {
    const h = store.headers[row.idx];
    const sig = `${row.level}|${h.title}|${row.hasChildren}`;
    const content = el.firstElementChild;
    if (el.dataset.sig !== sig) {
      this.fillContent(content, row);
      el.dataset.sig = sig;
    } else if (row.hasChildren) {
      const sw = content.querySelector(".qo-switcher");
      sw?.toggleClass("is-open", row.expanded);
    }
    this.applyRowState(el, row);
    el.style.top = `${pos * this.rowHeight}px`;
  }
  applyRowState(el, row) {
    const content = el.firstElementChild;
    content.toggleClass("located", this.locateIdx === row.idx);
    content.toggleClass("selected", this.selectedIdx === row.idx);
    el.toggleClass("dragging", this.draggingIdx === row.idx);
    el.dataset.sig = el.dataset.sig ?? `${row.level}|${store.headers[row.idx].title}|${row.hasChildren}`;
  }
  // ============ 高亮与滚动 ============
  setLocate(idx) {
    const prev = this.locateIdx;
    this.locateIdx = idx;
    this.toggleRowClass(prev, "located", false);
    this.toggleRowClass(idx, "located", true);
  }
  setSelected(idx) {
    const prev = this.selectedIdx;
    this.selectedIdx = idx;
    this.toggleRowClass(prev, "selected", false);
    this.toggleRowClass(idx, "selected", true);
  }
  toggleRowClass(idx, cls, on) {
    const el = this.rowEls.get(idx);
    if (!el) return;
    el.firstElementChild.toggleClass(cls, on);
  }
  /** 将 header idx 滚入视野 */
  scrollToIdx(idx, center = true) {
    const pos = this.rows.findIndex((r) => r.idx === idx);
    if (pos < 0) return;
    const top = pos * this.rowHeight;
    const viewH = this.container.clientHeight;
    const target = center ? top - viewH / 2 + this.rowHeight / 2 : Math.max(0, Math.min(top, this.viewport.offsetHeight - viewH));
    this.container.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
  }
  // ============ 事件委托 ============
  bindEvents() {
    this.container.addEventListener("scroll", () => this.paint());
    this.container.addEventListener("click", (ev) => {
      const row = ev.target.closest(".qo-row");
      if (!row) return;
      const idx = parseInt(row.dataset.idx);
      if (ev.target.closest(".qo-switcher")) {
        this.handlers.onToggle(idx);
        return;
      }
      this.handlers.onRowClick(idx);
    });
    this.container.addEventListener("contextmenu", (ev) => {
      const row = ev.target.closest(".qo-row");
      if (!row) return;
      ev.preventDefault();
      this.handlers.onContextMenu(parseInt(row.dataset.idx), ev);
    });
    this.container.addEventListener("dragstart", (ev) => {
      if (!this.handlers.canDrag()) {
        ev.preventDefault();
        return;
      }
      const row = ev.target.closest(".qo-row");
      if (!row) return;
      this.draggingIdx = parseInt(row.dataset.idx);
      row.firstElementChild.addClass("dragging");
      ev.dataTransfer?.setData("text/plain", store.headers[this.draggingIdx]?.title ?? "");
      ev.dataTransfer && (ev.dataTransfer.effectAllowed = "move");
    });
    this.container.addEventListener("dragover", (ev) => {
      if (this.draggingIdx < 0 || !this.handlers.canDrag()) return;
      const row = ev.target.closest(".qo-row");
      if (!row) return;
      const to = parseInt(row.dataset.idx);
      if (to === this.draggingIdx || isAncestorOf(this.draggingIdx, to)) return;
      ev.preventDefault();
      this.showDropHint(row, ev);
    });
    this.container.addEventListener("drop", (ev) => {
      if (this.draggingIdx < 0) return;
      const row = ev.target.closest(".qo-row");
      if (!row) return this.endDrag();
      const to = parseInt(row.dataset.idx);
      const position = this.dropPositionOf(row, ev);
      this.clearDropHint();
      const from = this.draggingIdx;
      this.endDrag();
      if (from === to || isAncestorOf(from, to)) return;
      ev.preventDefault();
      this.handlers.onDragDrop(from, to, position);
    });
    this.container.addEventListener("dragend", () => this.endDrag());
    this.container.addEventListener("dragleave", (ev) => {
      if (ev.target === this.container) this.clearDropHint();
    });
  }
  endDrag() {
    const el = this.rowEls.get(this.draggingIdx);
    el?.firstElementChild?.removeClass("dragging");
    this.draggingIdx = -1;
    this.clearDropHint();
  }
  /** 依据鼠标在行内的纵向位置判定落点：上 25% 之前 / 下 25% 之后 / 中间放入内部 */
  dropPositionOf(row, ev) {
    const rect = row.getBoundingClientRect();
    const rel = (ev.clientY - rect.top) / rect.height;
    if (rel < 0.25) return "before";
    if (rel > 0.75) return "after";
    return "inside";
  }
  showDropHint(row, ev) {
    this.clearDropHint();
    const content = row.firstElementChild;
    content.addClass(`drop-${this.dropPositionOf(row, ev)}`);
  }
  clearDropHint() {
    for (const el of this.viewport.querySelectorAll(".drop-before, .drop-after, .drop-inside")) {
      el.removeClass("drop-before", "drop-after", "drop-inside");
    }
  }
};
function isAncestorOf(from, to) {
  const { headers } = store;
  const base = headers[from]?.level;
  if (base === void 0 || from >= to) return false;
  for (let i = from + 1; i <= to; i++) {
    if (headers[i].level <= base) return false;
  }
  return true;
}
function buildLabel(el, title) {
  if (typeof title !== "string" || !title.includes("[[") || !title.includes("]]")) {
    el.textContent = title ?? "";
    return;
  }
  let last = 0;
  for (const m of title.matchAll(WIKILINK_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) el.appendText(title.slice(last, idx));
    const inner = m[1];
    const sep = inner.indexOf("|");
    const text = sep >= 0 ? inner.slice(sep + 1) || inner.slice(0, sep) : inner;
    el.createSpan({ cls: "qo-wikilink", text });
    last = idx + m[0].length;
  }
  if (last < title.length) {
    el.appendText(title.slice(last));
  }
}

// src/ui/view.ts
var VIEW_TYPE = "xu-quiet-outline";
var OutlineView = class extends import_obsidian5.ItemView {
  plugin;
  rootEl;
  // .quiet-outline
  renderer;
  expand;
  sliderEl;
  searchEl;
  currentPath = "";
  unloads = [];
  constructor(leaf, plugin2) {
    super(leaf);
    this.plugin = plugin2;
  }
  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    return "Quiet outline";
  }
  getIcon() {
    return "lines-of-text";
  }
  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    this.rootEl = container.createDiv({ cls: "quiet-outline" });
    this.expand = new ExpandState(this.plugin);
    this.buildFunctionBar();
    this.buildSlider();
    this.buildTree();
    this.renderer = new TreeRenderer(this.treeEl, this.viewportEl, {
      onRowClick: (idx) => {
        this.renderer.setSelected(idx);
        void this.plugin.navigator.jumpWhenClick(idx);
      },
      onToggle: (idx) => {
        if (this.expand.keys.has(idx)) this.expand.modify([idx], "remove");
        else this.expand.modify([idx], "add");
        this.renderer.render();
        this.saveMemoryDebounced();
      },
      onContextMenu: (idx, ev) => this.showMenu(idx, ev),
      onDragDrop: (from, to, position) => {
        void this.plugin.navigator.handleDrop(from, to, position);
      },
      canDrag: () => store.dragModify,
      getExpanded: () => this.expand.keys
    });
    this.applyThemeAndRender();
    this.bindGlobalEvents();
    window.requestAnimationFrame(() => this.renderer?.remeasureIfNeeded());
    this.plugin.outlineView = this;
    this.onLeafChange();
  }
  treeEl;
  viewportEl;
  // ============ DOM 骨架 ============
  buildFunctionBar() {
    const bar = this.rootEl.createDiv({ cls: "qo-function-bar" });
    const toBottom = bar.createEl("button", {
      cls: "qo-icon-btn",
      attr: { title: t("To Bottom"), "aria-label": t("To Bottom") }
    });
    (0, import_obsidian5.setIcon)(toBottom, ICON_TO_BOTTOM);
    toBottom.addEventListener("click", () => this.plugin.navigator.toBottom());
    const reset = bar.createEl("button", {
      cls: "qo-icon-btn",
      attr: { title: t("Reset"), "aria-label": t("Reset") }
    });
    (0, import_obsidian5.setIcon)(reset, ICON_RESET);
    reset.addEventListener("click", () => this.resetPanel());
    this.searchEl = bar.createEl("input", {
      type: "search",
      cls: "qo-search",
      attr: { placeholder: t("Input to search"), spellcheck: "false" }
    });
    this.searchEl.addEventListener("input", () => {
      this.renderer.filterText = this.searchEl.value;
      this.renderer.render();
    });
  }
  buildSlider() {
    const box = this.rootEl.createDiv({ cls: "qo-slider-box" });
    this.sliderEl = box.createEl("input", {
      type: "range",
      cls: "qo-slider slider",
      attr: { min: "0", max: "5", step: "1", value: String(this.expand?.level ?? 2) }
    });
    this.sliderEl.addEventListener("input", () => {
      this.expand.switchLevel(parseInt(this.sliderEl.value));
      this.renderer.render();
      this.updateSliderTitle();
      this.updateSliderFill();
      this.saveMemoryDebounced();
    });
    this.updateSliderFill();
    const marks = box.createDiv({ cls: "qo-marks" });
    for (let i = 0; i <= 5; i++) {
      marks.createSpan({ cls: "qo-mark", attr: { "data-v": String(i) } });
    }
  }
  buildTree() {
    this.treeEl = this.rootEl.createDiv({ cls: "qo-tree" });
    this.viewportEl = this.treeEl.createDiv({ cls: "qo-viewport" });
  }
  // ============ 全局事件 ============
  bindGlobalEvents() {
    const onClick = (ev) => {
      if (!ev.target.closest(`.quiet-outline .qo-row`)) {
        this.renderer.setSelected(-1);
      }
    };
    activeWindow.addEventListener("click", onClick);
    this.unloads.push(() => activeWindow.removeEventListener("click", onClick));
  }
  // ============ 对外接口（plugin / navigator 调用） ============
  /** 光标或滚动定位变化：自动展开 + 高亮 + 滚入视野 */
  onPosChange(index) {
    if (!store.headers[index]) return;
    this.expand.autoExpand(index);
    this.renderer.render();
    const path = ancestorsOf(index);
    const firstCollapsed = path.find((i) => this.expand.isParent(i) && !this.expand.keys.has(i));
    const target = firstCollapsed ?? path[path.length - 1] ?? index;
    this.renderer.setSelected(-1);
    this.renderer.setLocate(target);
    if (this.plugin.settings.auto_scroll_into_view) {
      this.renderer.scrollToIdx(target);
    }
    this.saveMemoryDebounced();
  }
  /** 文件切换（或启动初始化）：恢复展开记忆，重置高亮与搜索 */
  onLeafChange() {
    if (this.currentPath) {
      writeMemory(
        this.plugin.app,
        this.currentPath,
        [...this.expand.keys],
        this.expand.level
      );
    }
    this.currentPath = this.plugin.navigator.getPath();
    this.expand.restore(this.currentPath);
    this.renderer.filterText = "";
    this.searchEl.value = "";
    this.renderer.setLocate(-1);
    this.renderer.setSelected(-1);
    this.syncSlider();
    this.renderer.render();
  }
  /** 文件内容编辑后：按 diff 增量迁移展开状态并重绘 */
  onHeadersModified() {
    this.expand.applyModifyKeys(store.modifyKeys);
    this.renderer.render();
    this.saveMemoryDebounced();
  }
  /** 设置变化 / 主题变化 / 强制重建 */
  forceRemakeTree() {
    this.applyThemeAndRender();
  }
  // ============ 内部逻辑 ============
  applyThemeAndRender() {
    applyTheme(this.rootEl);
    this.renderer.measureRow();
    this.updateSliderTitle();
    this.renderer.render();
  }
  resetPanel() {
    this.renderer.setSelected(-1);
    this.renderer.setLocate(-1);
    this.searchEl.value = "";
    this.renderer.filterText = "";
    this.expand.switchLevel(this.expand.getDefaultLevel());
    this.syncSlider();
    this.renderer.render();
    this.saveMemoryDebounced();
  }
  syncSlider() {
    this.sliderEl.value = String(this.expand.level);
    this.updateSliderTitle();
    this.updateSliderFill();
  }
  /** 已选段填充比例（Obsidian .slider 渐变按 --slider-fill-ratio 0..1 着色） */
  updateSliderFill() {
    const min = Number(this.sliderEl.min) || 0;
    const max = Number(this.sliderEl.max) || 1;
    const v = Number(this.sliderEl.value);
    const ratio = max > min ? (v - min) / (max - min) : 0;
    this.sliderEl.style.setProperty("--slider-fill-ratio", ratio.toFixed(3));
  }
  /** 滑杆提示：H{n}: 数量 / No expand */
  updateSliderTitle() {
    const v = this.expand.level;
    if (v > 0) {
      const count = store.headers.filter((h) => h.level === v).length;
      this.sliderEl.title = `H${v}: ${count}`;
    } else {
      this.sliderEl.title = t("No expand");
    }
  }
  saveMemoryDebounced = (0, import_obsidian5.debounce)(() => this.saveMemoryNow(), 500, true);
  saveMemoryNow() {
    const path = this.plugin.navigator.getPath();
    if (path && store.headers.length > 0) {
      writeMemory(this.plugin.app, path, [...this.expand.keys], this.expand.level);
    }
  }
  /** 右键菜单：递归/兄弟 展开/折叠 四项 */
  showMenu(idx, ev) {
    this.renderer.setSelected(idx);
    const menu = new import_obsidian5.Menu().setNoIcon();
    const subtreeKeys = this.collectSubtreeParents(idx);
    const siblingKeys = this.collectSiblingParents(idx);
    const expanded = this.expand.keys.has(idx);
    const modify = (keys, mode) => {
      this.expand.modify(keys, mode);
      this.renderer.render();
      this.saveMemoryDebounced();
    };
    if (expanded) {
      menu.addItem(
        (item) => item.setTitle(t("Collapse Recursively")).onClick(() => modify(subtreeKeys, "remove"))
      );
    } else {
      menu.addItem(
        (item) => item.setTitle(t("Expand Recursively")).onClick(() => modify(subtreeKeys, "add"))
      );
    }
    menu.addItem(
      (item) => item.setTitle(t("Collapse Sibling")).onClick(() => modify(siblingKeys, "remove"))
    );
    menu.addItem(
      (item) => item.setTitle(t("Expand Sibling")).onClick(() => modify(siblingKeys, "add"))
    );
    menu.showAtMouseEvent(ev);
  }
  /** idx 子树内所有父节点（含自身） */
  collectSubtreeParents(idx) {
    const { headers } = store;
    const level = headers[idx]?.level ?? 1;
    const res = [];
    for (let i = idx; i < headers.length; i++) {
      if (i > idx && headers[i].level <= level) break;
      if (this.expand.isParent(i)) res.push(i);
    }
    return res;
  }
  /** idx 的同级（同父）父节点 */
  collectSiblingParents(idx) {
    const { headers } = store;
    if (!headers[idx]) return [];
    const level = headers[idx].level;
    let parentLevel = 0;
    for (let i = idx - 1; i >= 0; i--) {
      if (headers[i].level < level) {
        parentLevel = headers[i].level;
        break;
      }
    }
    const res = [];
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].level !== level) continue;
      let p = 0;
      for (let j = i - 1; j >= 0; j--) {
        if (headers[j].level < headers[i].level) {
          p = headers[j].level;
          break;
        }
      }
      if (p === parentLevel && this.expand.isParent(i)) res.push(i);
    }
    return res;
  }
  async onClose() {
  }
  onunload() {
    for (const fn of this.unloads) fn();
    this.unloads = [];
    this.renderer?.destroy();
    this.saveMemoryNow();
    if (this.plugin.outlineView === this) {
      this.plugin.outlineView = null;
    }
  }
};

// src/utils/debounce.ts
function debounceCb(fn, wait, cb) {
  let timeoutId = -1;
  return () => {
    fn();
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(cb, wait);
  };
}

// src/settings.ts
var import_obsidian6 = require("obsidian");
var REPO_URL = "https://github.com/xcloud-ai/xu-quiet-outline";
var DEFAULT_SETTINGS = {
  language: "auto",
  expand_level: "2",
  auto_expand_ext: "only-expand",
  drag_modify: true,
  locate_by_cursor: true,
  auto_scroll_into_view: true,
  // Style settings
  patch_color: false,
  primary_color_light: "#18a058",
  primary_color_dark: "#63e2b7",
  rainbow_line: true,
  rainbow_color_1: "#FD8B1F",
  rainbow_color_2: "#FFDF00",
  rainbow_color_3: "#07EB23",
  rainbow_color_4: "#2D8FF0",
  rainbow_color_5: "#BC01E2",
  // New style settings
  font_size: "var(--nav-item-size)",
  font_family: "inherit",
  font_weight: "inherit",
  line_height: "1.6em",
  line_gap: "0px"
};
var SettingTab = class extends import_obsidian6.PluginSettingTab {
  plugin;
  constructor(app, plugin2) {
    super(app, plugin2);
    this.plugin = plugin2;
  }
  /** 声明式控件写入：默认实现只改 settings + saveData，这里追加即时刷新 */
  async setControlValue(key, value) {
    this.plugin.settings[key] = value;
    await this.plugin.saveSettings();
    this.plugin.refreshUI();
  }
  getSettingDefinitions() {
    const s = this.plugin.settings;
    return [
      // 顶部：插件名 + 一句话功能说明（纯信息行，不进设置搜索索引）
      {
        name: t("setting_title"),
        desc: t("setting_header_desc"),
        searchable: false
      },
      // 界面语言（render：切换语言后必须整体重绘，control 无法表达该副作用）
      {
        name: t("setting_language"),
        desc: t("setting_language_desc"),
        aliases: ["language", "语言", "語言", "English", "繁體"],
        render: (setting) => {
          setting.addDropdown(
            (dropdown) => dropdown.addOptions({
              auto: t("lang_auto"),
              zh: t("lang_zh"),
              en: t("lang_en"),
              "zh-TW": t("lang_zh-TW")
            }).setValue(s.language).onChange(async (value) => {
              s.language = value;
              setLanguage(value);
              await this.plugin.saveSettings();
              this.update();
              this.plugin.refreshUI();
            })
          );
        }
      },
      // ── 常规设置 ──
      {
        type: "group",
        heading: t("General Settings"),
        items: [
          {
            name: t("Default expanding level"),
            desc: t("Default expanding level desc"),
            control: {
              type: "dropdown",
              key: "expand_level",
              options: { 0: "0", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5" }
            }
          },
          {
            name: t("Auto expand mode"),
            desc: t("Control the expansion behavior when a leaf is changed"),
            control: {
              type: "dropdown",
              key: "auto_expand_ext",
              options: {
                "only-expand": t("Only Expand"),
                "expand-and-collapse-rest-to-default": t(
                  "Expand and collapse the rest to default level"
                ),
                "expand-and-collapse-rest-to-setting": t(
                  "Expand and collapse the rest to the level below"
                ),
                disable: t("Disable")
              }
            }
          },
          {
            name: t("Drag to modify"),
            desc: t(
              "Allow dragging headings in the outline to change their level and position. This will modify the note content."
            ),
            control: { type: "toggle", key: "drag_modify" }
          },
          {
            name: t("Locate by cursor"),
            desc: t("Highlight the nearest heading by the cursor"),
            control: { type: "toggle", key: "locate_by_cursor" }
          },
          {
            name: t("Auto scroll into view"),
            desc: t("Highlighting headings auto scroll into view"),
            control: { type: "toggle", key: "auto_scroll_into_view" }
          }
        ]
      },
      // ── 样式设置 ──
      {
        type: "group",
        heading: t("Style Settings"),
        items: [
          {
            name: t("Override primary color"),
            desc: t("This setting is used to override the primary color of the theme"),
            control: { type: "toggle", key: "patch_color" }
          },
          {
            name: t("Primary color (light mode)"),
            control: { type: "color", key: "primary_color_light" },
            visible: () => s.patch_color
          },
          {
            name: t("Primary color (dark mode)"),
            control: { type: "color", key: "primary_color_dark" },
            visible: () => s.patch_color
          },
          {
            name: t("Rainbow line color"),
            desc: t("The color of the line can be customized by rainbow"),
            control: { type: "toggle", key: "rainbow_line" }
          }
        ]
      },
      // ── 高级设置（导航式子页面，默认不占主页面空间）──
      {
        type: "page",
        name: t("sec_advanced"),
        items: [
          {
            type: "group",
            heading: t("Rainbow line colors"),
            items: [1, 2, 3, 4, 5].map((i) => ({
              name: `${t("Indent level")} ${i}`,
              control: {
                type: "color",
                key: `rainbow_color_${i}`
              }
            }))
          },
          {
            type: "group",
            heading: t("Font Settings"),
            items: [
              { name: t("Font size"), control: { type: "text", key: "font_size" } },
              { name: t("Font family"), control: { type: "text", key: "font_family" } },
              { name: t("Font weight"), control: { type: "text", key: "font_weight" } },
              { name: t("Line height"), control: { type: "text", key: "line_height" } },
              { name: t("Line gap"), control: { type: "text", key: "line_gap" } }
            ]
          }
        ]
      },
      // ── 底部：GitHub 使用文档 ──
      {
        name: t("setting_docs"),
        desc: t("setting_docs_desc"),
        searchable: false,
        render: (setting) => {
          setting.addButton(
            (btn) => btn.setButtonText(t("btn_github")).onClick(() => {
              window.open(REPO_URL, "_blank");
            })
          );
        }
      }
    ];
  }
};

// src/commands.ts
function registerCommands(plugin2) {
  const commands = [
    {
      id: "quiet-outline",
      name: "Open outline",
      callback: () => {
        void plugin2.activateView();
      }
    },
    {
      id: "prev-heading",
      name: "To previous heading",
      editorCallback: (editor) => {
        const line = editor.getCursor().line;
        const headers = store.headers;
        const idx = headers.findLastIndex((h) => h.line < line);
        if (idx !== -1) {
          void plugin2.navigator.jump(idx);
        }
      }
    },
    {
      id: "next-heading",
      name: "To next heading",
      editorCallback: (editor) => {
        const line = editor.getCursor().line;
        const headers = store.headers;
        const idx = headers.findIndex((h) => h.line > line);
        if (idx !== -1) {
          void plugin2.navigator.jump(idx);
        }
      }
    }
  ];
  for (const command of commands) {
    plugin2.addCommand(command);
  }
}

// src/plugin.ts
var QuietOutline = class extends import_obsidian7.Plugin {
  navigator = createNav("dummy", this, null);
  // jumping flag: false while a jump-initiated scroll is settling (1s window)
  jumping = true;
  /** 当前挂载的大纲面板（单面板模型） */
  outlineView = null;
  /** 延迟兜底清扫定时器（更新后残留重复面板的自愈） */
  staleSweepTimer = -1;
  /** 遍历所有已挂载的大纲面板（插件更新后可能残留多个，均需刷新） */
  forEachOutlineView(cb) {
    if (this.outlineView) {
      cb(this.outlineView);
      return;
    }
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      const view = leaf.view;
      if (view instanceof OutlineView) cb(view);
    }
  }
  allow_scroll = true;
  block_scroll;
  allow_cursor_change = true;
  block_cursor_change;
  prevActiveFile = null;
  prevActiveFileView = null;
  async startJumping() {
    this.jumping = false;
    await sleep(1e3);
    this.jumping = true;
  }
  async onload() {
    await this.loadSettings();
    setLanguage(this.settings.language);
    store.init(this);
    this.registerView(VIEW_TYPE, (leaf) => new OutlineView(leaf, this));
    this.register(() => window.clearTimeout(this.staleSweepTimer));
    this.registerListener();
    registerCommands(this);
    this.addSettingTab(new SettingTab(this.app, this));
    this.app.workspace.onLayoutReady(() => {
      void this.activateView();
      void this.saveSettings();
    });
    this.block_scroll = debounceCb(
      () => {
        this.allow_scroll = false;
      },
      300,
      () => {
        this.allow_scroll = true;
      }
    );
    this.block_cursor_change = debounceCb(
      () => {
        this.allow_cursor_change = false;
      },
      300,
      () => {
        this.allow_cursor_change = true;
      }
    );
  }
  registerListener() {
    this.registerEvent(
      this.app.workspace.on("css-change", () => {
        store.dark = activeDocument.body.hasClass("theme-dark");
        this.forEachOutlineView((view) => view.forceRemakeTree());
      })
    );
    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        if (this.navigator.handlesFile(file)) {
          this.refresh();
        }
      })
    );
    this.registerEvent(
      this.app.metadataCache.on("resolved", () => {
        void this.reinitHeaders();
      })
    );
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", async (leaf) => {
        if (!leaf) return;
        const activeFileView = this.app.workspace.getActiveFileView();
        if (!activeFileView) {
          this.prevActiveFileView = null;
          this.prevActiveFile = null;
          eventBus.trigger("active-fileview-change", null);
          return;
        }
        if (leaf.view instanceof import_obsidian7.FileView && leaf.view.navigation && leaf.view.file) {
          if (leaf.view !== this.prevActiveFileView || leaf.view.file !== this.prevActiveFile) {
            this.prevActiveFileView = leaf.view;
            this.prevActiveFile = leaf.view.file;
            eventBus.trigger("active-fileview-change", leaf.view);
          }
        }
      })
    );
    this.registerEvent(
      eventBus.on("active-fileview-change", async (view) => {
        const outlineLeaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);
        if (outlineLeaves.length > 0 && outlineLeaves.every((leaf) => leaf.group)) {
          return;
        }
        if (!view) {
          await this.updateNavAndRefresh("dummy", null);
          return;
        }
        this.block_cursor_change();
        await this.updateNavAndRefresh(view.getViewType(), view);
      })
    );
  }
  // set store.headers（编辑后统一走 diff 增量迁移）
  refresh_outline = async () => {
    await this.navigator.updateHeaders();
    this.forEachOutlineView((v) => v.onHeadersModified());
  };
  refresh = (0, import_obsidian7.debounce)(this.refresh_outline, 300, true);
  async updateNav(type, view) {
    try {
      await this.navigator.unload();
      this.navigator = createNav(type, this, view);
      await this.navigator.load();
    } catch (e) {
      console.error(`Failed to initialize ${type} navigator: ${String(e)}`);
      this.navigator = createNav("dummy", this, null);
      await this.navigator.load();
    }
  }
  async updateNavAndRefresh(type, view) {
    await this.updateNav(type, view);
    const newHeaders = await this.navigator.getHeaders();
    store.headers = newHeaders;
    this.forEachOutlineView((v) => v.onLeafChange());
  }
  /** resolved 后重拉标题：修复启动期读到旧缓存导致新增/尾部标题缺失 */
  async reinitHeaders() {
    const newHeaders = await this.navigator.getHeaders();
    const oldHeaders = store.headers;
    const changed = newHeaders.length !== oldHeaders.length || newHeaders.some(
      (h, i) => h.title !== oldHeaders[i]?.title || h.level !== oldHeaders[i]?.level || h.line !== oldHeaders[i]?.line
    );
    if (!changed) return;
    store.headers = newHeaders;
    this.forEachOutlineView((v) => v.onHeadersModified());
  }
  onunload() {
    window.clearTimeout(this.staleSweepTimer);
    void this.unloadPlugin();
  }
  async unloadPlugin() {
    try {
      await this.navigator.unload();
    } finally {
      this.outlineView = null;
    }
  }
  async loadSettings() {
    const data = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
    for (const key of ["font_size", "font_family", "font_weight", "line_height", "line_gap"]) {
      if (!this.settings[key].trim()) {
        this.settings[key] = DEFAULT_SETTINGS[key];
      }
    }
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  /** 设置变化后由 SettingTab 调用：同步 store 并让面板重算主题/重绘 */
  refreshUI() {
    store.init(this);
    this.forEachOutlineView((view) => view.forceRemakeTree());
  }
  async activateView() {
    const preExisting = new Set(this.app.workspace.getLeavesOfType(VIEW_TYPE));
    if (preExisting.size === 0) {
      await sleep(60);
      for (const revived of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
        preExisting.add(revived);
      }
    }
    const leaf = await this.app.workspace.ensureSideLeaf(VIEW_TYPE, "right", {
      active: true,
      reveal: true
    });
    await this.app.workspace.revealLeaf(leaf);
    if (!preExisting.has(leaf)) {
      this.scheduleRetractCreatedLeaf(leaf);
    }
  }
  /**
   * 60ms 空窗等待后仍可能因极端时序与框架恢复链并行落地两个 leaf（新建 + 旧 leaf 延迟复活）。
   * 500ms 后清点：仅当本实例新建的 leaf 与其他本类型 leaf 并存时，撤掉新建项，
   * 绝不触碰其余 leaf（用户可能手动拆分或移动过位置）。
   */
  scheduleRetractCreatedLeaf(created) {
    window.clearTimeout(this.staleSweepTimer);
    this.staleSweepTimer = window.setTimeout(() => {
      const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);
      if (leaves.length > 1 && leaves.includes(created)) {
        created.detach();
      }
    }, 500);
  }
};

/* nosourcemap */