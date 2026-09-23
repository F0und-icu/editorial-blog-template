# 写作与定制指南

这份指南按“想改哪里 → 修改哪个文件 → 页面如何变化”组织。所有路径都以仓库根目录为起点。仅添加文章、修改文案或替换图片时，通常不需要修改 React 组件。

[返回 README](../README.md) · [设计与创作说明](DESIGN.zh-CN.md) · [Markdown 起稿文件](examples/article.md) · [文章配置示例](examples/article-meta.json)

## 先认识三个位置

| 想做什么 | 修改位置 | 作用 |
| --- | --- | --- |
| 写正文 | `content/articles/文章标识.md` | 正文段落、章节、代码、表格和图片 |
| 设置文章信息 | `content/article-meta.json` | 展示标题、副标题、摘要、日期、分类、标签与封面 |
| 修改网站信息 | `content/site-config.json` | 站名、导航、首页、About、页脚文案和联系方式 |

文章标识（slug）是 Markdown 文件名去掉 `.md` 后的部分。建议使用小写英文、数字和连字符，例如 `understanding-cash-flow`。同一个标识必须同时用于文件名和文章配置中的键。

```text
content/articles/understanding-cash-flow.md
                  ↕ 必须对应
content/article-meta.json 中的 "understanding-cash-flow"
                  ↓ 生成页面
/articles/understanding-cash-flow/
```

## 从零添加一篇文章

### 启动本地预览

在仓库根目录运行：

```sh
nvm use
npm ci
npm run dev
```

打开 `http://localhost:3000/`。`nvm use` 使用仓库 `.nvmrc` 中指定的 Node.js 22；未安装 nvm 时，也可以自行安装 Node.js 22。

### 新建正文文件

复制 [起稿文件](examples/article.md) 到 `content/articles/my-first-essay.md`，再修改内容。这个示例使用模板已经附带的图，复制后不必先找图片。

````markdown
# My first essay

开头用一两段说明文章要解决什么问题。

## The question

这里写背景、问题和假设。

## The evidence

可以写 **强调文字**、`行内代码`，也可以引用资料。

![图表的含义与数据范围](/images/editorial/bond-price.svg)

```python
principal = 1000
rate = 0.04
print(principal * rate)
```

## What follows

说明结论、限制和下一步问题。
````

开头的 `#` 标题不会在正文重复显示，页面顶部标题使用配置中的 `title`。建议让两者含义一致。目录从 `##` 二级标题自动生成；`###` 及更深标题会显示在正文中，但不加入侧边目录。开头以外的 `#` 会按二级章节处理，仍建议直接写 `##`。

Markdown 开头不要添加 YAML front matter。这个模板只从独立的 JSON 文件读取文章配置。

### 添加文章配置

打开 `content/article-meta.json`，在已有顶层对象中加入下面的键值。**合并这个条目，不要用它覆盖整个文件**。如果前面已有条目，需要用逗号分隔；JSON 不支持注释或尾随逗号。

```json
{
  "my-first-essay": {
    "title": "My first essay.",
    "subtitle": "A clear sentence explaining what the reader will learn.",
    "excerpt": "A short summary for the homepage, archive, and search results.",
    "date": "2026-06-25",
    "category": "Markets & Macro",
    "tags": ["bonds", "interest rates"],
    "type": "Essay",
    "featuredOrder": 1,
    "artwork": "/images/editorial/rates.svg"
  }
}
```

| 字段 | 是否需要 | 对应页面位置 |
| --- | --- | --- |
| `title` | 必填 | 文章顶部、首页卡片、列表、搜索结果、浏览器标题 |
| `subtitle` | 必填 | 文章主标题下方的介绍；文章页面描述元数据 |
| `excerpt` | 必填 | 首页精选、Recent writing、文章列表摘要；部分搜索结果摘要 |
| `date` | 必填 | 日期展示、Recent writing 顺序、相同精选顺序时的排序；格式为 `YYYY-MM-DD` |
| `category` | 必填 | 分类小标题、面包屑、列表筛选和分类计数；可自由命名 |
| `tags` | 必填数组 | 文章底部标签、搜索匹配和相关文章计算；没有标签时填 `[]` |
| `type` | 建议填写 | `Essay` 进入 Articles，`Journal` 进入 Notes；省略时默认为 `Essay` |
| `featuredOrder` | 可选数字 | 全局列表的编辑排序，较小的数字更靠前；影响首页精选候选顺序 |
| `artwork` | 建议填写 | 首页精选和 Articles 列表的小图；省略时使用默认装饰图 |

日期是你填写的文章日期，不是文件创建时间、修改时间或上传时间。阅读时间则由程序根据正文粗略计算，无需填写。当前算法按空白分词、以每分钟约 220 个词估算，更适合英文；写中文时，正文仍可正常显示，但如需准确的中文阅读时间，应调整 `lib/content.ts`。

### 确认文章出现在正确位置

保存后打开 `/articles/my-first-essay/`，再检查 Articles、首页和搜索。若刚添加的路由仍显示 404，停止并重新运行 `npm run dev`；新增文章需要重新构建后才会出现在已部署的静态站点。

## 图片放哪里、路径怎么写

推荐按文章建立目录，避免不同文章的图片重名：

```text
public/
  images/
    articles/
      my-first-essay/
        cover.png
        chart.svg
        source-chart.png
```

| 文件在磁盘上的位置 | 配置或正文中使用的路径 |
| --- | --- |
| `public/images/articles/my-first-essay/cover.png` | `/images/articles/my-first-essay/cover.png` |
| `public/images/articles/my-first-essay/chart.svg` | `/images/articles/my-first-essay/chart.svg` |
| `public/images/editorial/architecture.png` | `/images/editorial/architecture.png` |

**网页路径不包含 `public`。** 不要写成本机绝对路径，不要写 `file://`，也不要把图片放进 `out/`；`out/` 会在构建时重新生成。建议使用不带空格的文件名，统一大小写。

### 列表封面

在 `content/article-meta.json` 对应文章中设置：

```json
"artwork": "/images/articles/my-first-essay/cover.png"
```

这只修改首页卡片和文章列表的图，不会自动把封面插入正文，也不会替换首页右侧的建筑主图。卡片会按固定区域显示图片；重要信息应留在图中央，不要把正文所必需的数据只放在装饰封面上。

### 正文插图

在 Markdown 正文中单独写一段：

```markdown
![图表说明：数据口径、单位和示例条件](/images/articles/my-first-essay/chart.svg)
```

方括号中的说明会用于无障碍替代文字，也会显示为图片下方的图注。正文图保持比例，不会为了填满区域而裁切。支持常见的 PNG、JPEG、WebP 和 SVG 图片；复杂 SVG 中的文字应同时考虑手机端的可读性。

添加或替换正文图片后，在开发阶段运行：

```sh
node scripts/article-image-metadata.mjs
```

此脚本读取本地正文插图的尺寸，更新 `content/image-dimensions.json`，为延迟加载预留空间。`npm run build` 会自动运行它；生成的 JSON 建议随图片一起提交，不需要手改。为了让尺寸脚本识别图片，请使用上面示例中的标准 Markdown 写法，不加空格文件名或额外的图片标题参数。

### 重绘图与原图对照（可选）

如果要在图注旁加入 “View original”，保留原图文件，并在 `content/figure-meta.json` 添加映射：

```json
{
  "/images/articles/my-first-essay/chart.svg": {
    "caption": "Cash-flow bridge — hypothetical example",
    "original": "/images/articles/my-first-essay/source-chart.png"
  }
}
```

键必须与正文图片地址完全一致。这个 `caption` 会覆盖 Markdown 图片说明，并显示原图链接。普通图片无需配置此文件。

### GitHub 子路径

若站点部署在 `/repository-name/` 下，用 `NEXT_PUBLIC_BASE_PATH` 配置此前缀。**Markdown 图片和 `artwork` 仍写 `/images/...`，不要手动加仓库名**；模板的图片处理函数会添加此前缀。

Markdown 中的普通链接使用原样 `href`。链接到站内页面时，可以使用相对地址，例如从一篇文章指向另一篇文章写 `[Next essay](../another-essay/)`；直接写 `/articles/...` 的普通 Markdown 链接不会自动补上部署子路径。React 页面内的 Next.js `Link` 则会自动处理。

## 首页精选、最近文章与 Notes 如何排序

| 位置 | 当前规则 |
| --- | --- |
| Selected essays | 从非 `Journal` 文章中，按全局编辑顺序取前 3 篇；不要求每篇都设置 `featuredOrder` |
| Recent writing | 所有文章和 Notes 按 `date` 倒序取前 3 篇；不会排除已经精选的文章 |
| Articles | 所有非 `Journal` 文章，先按 `featuredOrder` 升序，再按日期倒序 |
| Notes | 所有 `Journal` 文章，也使用全局编辑顺序；通常不设置精选顺序即可按日期排列 |
| Keep reading | 优先相同分类与共享标签，得分相同再比较日期 |

如果新文章没有出现在 Recent writing，先检查它的 `date` 是否确实比现有条目新。仅仅上传一个日期较早的文章不会把它置顶。若想放入首页精选，给它合适的 `featuredOrder`，并调整其他文章的顺序以避免并列。

一篇短札记与长文的文件位置、配置格式完全相同，只需把 `type` 改成 `Journal`。Notes 列表展示正文中提取的前两段文字；完整内容仍在 `/articles/文章标识/` 打开，不使用 `/notes/文章标识/`。

当前模板没有 `draft` 开关。放入 `content/articles/` 的 Markdown 会参与构建；草稿可以先放在此目录之外，准备好后再移动进去并添加配置。删除文章时，同时删除 Markdown 和对应配置，确认没有其他文章仍引用其图片后再清理图片。

## 改哪个配置，对应页面哪里

以下字段均位于 `content/site-config.json`。数组可以增减条目，字符串中的 `\n` 表示显式换行（用于支持换行的标题字段）。

| 页面区域 | 字段 | 修改后的效果 |
| --- | --- | --- |
| 顶部站名 | `site.name` | 网站左上角名称，也用于文章署名和浏览器标题后缀 |
| 顶部字母标志 | `site.shortName` | 页头取它的第一个字符作为字母标志 |
| 页脚标志 | `site.mark` | 页脚品牌左侧的小标记 |
| 浏览器默认标题 / 描述 | `site.title`、`site.description` | 首页默认标题和网站描述元数据 |
| 页脚年份 | `site.year` | 页脚年份；不会自动随日历更新 |
| 顶部与手机导航 | `navigation[].label`、`navigation[].href` | 导航文字与目标路径；新增导航不等于新建页面 |
| 首页标题上方的小字 | `hero.eyebrow` | 刊物定位，例如独立财经期刊 |
| 首页主标题 | `hero.headline`、`hero.emphasis` | 正常衬线标题与斜体重点部分 |
| 首页简介 | `hero.deck` | 主标题下的描述 |
| 首页主入口 | `hero.primaryCta.label`、`hero.primaryCta.href` | 入口文字与链接 |
| 首页右侧大图 | `hero.image.src` | 替换图片；About 顶部也复用此图 |
| 主图替代文字 / 图注 | `hero.image.alt`、`hero.image.caption` | 图片说明与首页底部图注；About 不显示该图注 |
| 首页两个区块标题 | `archive.selectedTitle`、`archive.latestTitle` | Selected essays 与 Recent writing |
| Articles 顶部 | `archive.eyebrow`、`archive.headline`、`archive.description` | 归档页小标题、大标题与介绍 |
| Notes 顶部 | `journal.eyebrow`、`journal.headline`、`journal.description` | 札记页小标题、大标题与介绍 |
| 文章目录标题 | `article.planLabel` | 桌面目录与手机折叠目录标题 |
| 文章底部入口 / 相关阅读 | `article.backLabel`、`article.relatedHeadline` | 返回归档的文字与相关阅读区标题 |
| About 顶部 | `about.eyebrow`、`about.headline`、`about.deck` | About 首屏内容 |
| About 简介 | `about.summary[]` | About 段落；第一段也用于首页右侧介绍 |
| About 方向列表 | `about.focus[].title`、`description` | Focus 区块 |
| About 写作原则 | `about.principles[].title`、`description` | Editorial practice 区块 |
| About 联系方式 | `site.contactEmail`、`site.githubUrl` | 至少一个不为空时显示联系区；都留空则隐藏 |
| 页脚短句 | `footer.motto` | 页脚中部文案 |
| 浏览器标签图标 | `public/icon.svg` 文件 | 直接替换 favicon；不通过 JSON 设置 |

`footer.copyright` 当前保留在配置结构中，但页脚组件没有读取它；修改它不会改变页面显示。当前页脚实际使用 `site.name`、`site.mark`、`site.year` 和 `footer.motto`。

搜索页标题、部分旁栏提示、About 的区块标签、404 文案，以及按钮的无障碍标签仍写在组件中，位置见下一节。

## 修改布局、字体与固定文案

| 想调整的地方 | 文件 |
| --- | --- |
| 首页布局、精选数量、Recent writing 数量、介绍旁栏固定文案 | `app/page.tsx` |
| Articles 顶部结构 | `app/articles/page.tsx` |
| Articles / Notes / Search 的筛选、列表、空状态和侧栏 | `components/editorial/collection.tsx` |
| Notes 顶部结构 | `app/notes/page.tsx` |
| 文章标题区、正文与目录布局、相关阅读 | `app/articles/[slug]/page.tsx` |
| Markdown 图注、图片、表格和代码渲染 | `components/editorial/markdown.tsx` |
| 代码复制按钮与状态文案 | `components/editorial/code-block.tsx` |
| 目录激活和手机折叠逻辑 | `components/editorial/article-toc.tsx` |
| About 固定标签与布局 | `app/about/page.tsx` |
| Search 标题和介绍 | `app/search/page.tsx` |
| 404 文案与返回入口 | `app/not-found.tsx` |
| 页头导航和手机菜单 | `components/site-header.tsx` |
| 页脚结构 | `components/site-footer.tsx` |
| 站点语言、全局标题元数据 | `app/layout.tsx`，其中 `lang="en"` 可按站点语言调整 |
| 文章加载、阅读时间、排序和相关文章规则 | `lib/content.ts` |
| 目录提取、标题处理规则 | `lib/markdown.ts` |

全局样式集中在 `app/globals.css`：

| 视觉元素 | 重点查找 |
| --- | --- |
| 背景与文字配色 | `:root` 中的 `--paper`、`--ink`、`--body`、`--muted` |
| 强调色和分隔线 | `--walnut`、`--sage`、`--line`、`--fine` |
| 字体 | `--serif`、`--sans`、`--mono` |
| 全局内容宽度 | `.wrap` |
| 首页首屏 | `.hero`、`.hero-copy`、`.hero-figure` |
| 正文字号和段间距 | `.prose` 及其 `p`、`h2`、`h3` 规则 |
| 正文 / 目录列宽 | `.article-layout`、`.toc-wrap` |
| 正文图片和图注 | `.article-figure`、`.caption` |
| 代码块外观与高度 | `.code-block`、`.code-toolbar`、`.code-block pre` |
| 手机布局 | 文件中的 `@media` 规则 |

同一个选择器可能在后面被覆盖，也可能在媒体查询中有单独规则。修改前搜索全部匹配位置；不要只改第一处就判断没有生效。

## 写作中可以使用什么

支持常见 Markdown：段落、标题、粗体、斜体、列表、引用、链接、图片，以及 GFM 表格。代码块建议标注语言，如 `python`、`javascript`、`bash` 或 `json`，便于语法高亮。长代码和宽表格会在自身容器内滚动。

不要用原始 HTML 编写页面布局；渲染器不会把文章中的 HTML 当成可执行组件。数学公式没有额外的 LaTeX 渲染插件，可以用文字、代码块或 SVG 表达，或自行扩展渲染器。

标题不需要手写目录锚点。目录会自动为二级章节生成 `section-1`、`section-2` 等锚点；调整章节顺序也会改变这些编号。

## 提交前检查

```sh
npm test
npm run typecheck
npm run build
npm run check:export
```

| 现象 | 优先检查 |
| --- | --- |
| `Missing article metadata` | Markdown 文件名与 JSON 键是否一致 |
| 文章新增后 404 | 开发服务是否需要重启；部署是否已重新构建 |
| 图片构建时找不到 | 是否误写 `/public/images/...`；文件名大小写和路径是否一致 |
| 新文章不在精选或 Recent writing | `featuredOrder`、`type`、`date` 是否符合对应规则 |
| 替换图片后目录跳转偏移 | 是否重新生成 `content/image-dimensions.json` |
| 联系区没有显示 | `site.contactEmail` 和 `site.githubUrl` 是否都为空 |
| 上传后网站没有更新 | CI 成功只代表检查通过；还需正确配置托管和发布开关 |

把修改过的 Markdown、JSON、图片和必要代码一起提交。无需提交 `node_modules/`、`.next/` 或 `out/`。

模板的 GitHub Pages 发布默认关闭。启用方式、子路径与自定义域名配置见 [README 的 Deployment 部分](../README.md#deployment)。
