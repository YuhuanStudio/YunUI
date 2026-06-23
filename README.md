# YunUI

[![npm](https://img.shields.io/npm/v/@yuhuanowo/yunui.svg)](https://www.npmjs.com/package/@yuhuanowo/yunui)

Yunxin 的设计系统(YUNXIN Design System v3 / Zinc),提取成一个独立、版本化、可被多项目引用的 UI 库 —— 对标 [once-ui.com](https://once-ui.com)。

改 YunUI 一处 → 发版 → 各项目升级版本号即可同步获得统一的 **设计 token、动画、组件**。已在 Yunxin 生产环境使用。

---

## 安装

```bash
npm i @yuhuanowo/yunui      # 或 pnpm add / yarn add
```

要求消费方使用 **React 19** 与 **Tailwind CSS v4**(peerDependencies)。

> 想让 import 保持短名 `yunui`?用包别名:
> ```jsonc
> // package.json
> "dependencies": { "yunui": "npm:@yuhuanowo/yunui@^0.1.5" }
> ```
> 之后 `import { Button } from "yunui"` 即可,下文示例同理。

## 接入(3 步)

### 1. 引入设计系统样式

在全局 CSS(如 `app/globals.css`):

```css
@import "tailwindcss";
@import "@yuhuanowo/yunui/css";

/* 关键:让 Tailwind v4 扫描 YunUI 产物里的内联工具类,否则组件会"没样式" */
@source "../node_modules/@yuhuanowo/yunui/dist";
```

> `@source` 路径以该 CSS 文件为基准,按你的项目结构调整。字体(Geist / JetBrains Mono)不打包,由消费方自行加载。

### 2. 用组件

```tsx
import { Button, Card, Dialog, DialogContent } from "@yuhuanowo/yunui";

export function Demo() {
  return (
    <Card hover className="p-6">
      <Button variant="primary">Hello YunUI</Button>
    </Card>
  );
}
```

### 3.(可选)注入框架适配器

部分组件需要路由 / 图片 / i18n。在根布局用 `YunUIProvider` 注入你框架的实现:

```tsx
import { YunUIProvider } from "@yuhuanowo/yunui/adapters";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

<YunUIProvider
  adapters={{
    Link,
    Image,
    useRouter,
    useT: (ns) => useTranslations(ns),
  }}
>
  {children}
</YunUIProvider>;
```

不注入时,YunUI 使用零依赖默认实现(`<a>` / `<img>` / identity 翻译)。

---

## 入口

| 入口 | 内容 |
| --- | --- |
| `@yuhuanowo/yunui` | 原子组件:Button / Input / Textarea / Card / Badge / Dialog / Select / Slider / Progress / Tabs / Avatar / Tooltip / DropdownMenu / Skeleton / Spinner / PageLoader / EmptyState / IconButton / Label,以及 MotionDiv·fadeIn·stagger 等动画预设 |
| `@yuhuanowo/yunui/css` | 设计系统样式(token 变量、`@theme` 映射、`.btn`/`.card`/`.glass` 等全局类、动画 keyframes) |
| `@yuhuanowo/yunui/adapters` | `YunUIProvider` / `useYunUI` 与适配器接口 |
| `@yuhuanowo/yunui/patterns` | 页面级组件:FAQ、StatCard(`tone`/`inline`/`valueFirst` 变体)、BlogCard、CodeBlock、Sidebar、BackgroundEffects 等 |
| `@yuhuanowo/yunui/ai` | Yunxin AI 产品域(prop 驱动,无 API 直连):ProviderIcon / ModelIcon / ModelTypeIcon、ModelCard、CapabilitySelector、Navbar、Footer、LanguageSwitcher、ThinkingBlock、IDBadge … |

**工具 / hooks**(从 `@yuhuanowo/yunui` 导出):`cn`、`toast` / `Toaster`(基于 sonner)、`MotionDiv` / `MotionSpan` / `fadeIn` / `staggerContainer` / `staggerItem`、`useEscapeKey` / `useBodyScrollLock` / `useModalBehavior`。

> ⚠️ **`yunui/ai` 的图标素材需要你自备。** `ProviderIcon` / `ModelIcon` / `ModelAvatar` / `ModelCard` 会从 `/icons/providers/*.png`、`/icons/models/*.png` 加载图标 —— 这些素材**不随 npm 包发布**(包里只有 `dist` / `styles`)。消费方需把对应图标托管到 `iconBasePath` 指向的位置(默认 `/icons`,可从本仓库 `site/public/icons/` 取),否则图标会显示为裂图。base path 可通过适配器配置:`<YunUIProvider adapters={{ iconBasePath: "/assets/icons" }}>`(也可指向 CDN)。单个自定义图标 URL 通过组件 `iconUrl` prop 传入,原样使用。
>
> 同样,`./_deferred/ai-search`(文档 AI 搜索)**未导出** —— 它绑定 `@ai-sdk/react` + 聊天栈,是产品功能而非通用组件,导出会给库强加 ai-sdk peer 依赖。

---

## 主题

三套主题,通过根元素 class 切换(配合 `next-themes`):`light`(默认 `:root`)、`.dark`、`.true-black`(OLED)。

## 同步流程(改一处,各项目同步)

```bash
# 在 YunUI:改代码 → 升 package.json 版本号 → 提交
git tag v0.1.6 && git push origin v0.1.6
# ↑ 推 tag 触发 GitHub Actions:typecheck → test → build → npm publish
#   (tokenless OIDC trusted publishing + provenance,无需本地发布/OTP)

# 在消费项目:
pnpm up @yuhuanowo/yunui
```

> 发布走 GitHub Actions(`.github/workflows/release.yml`)。一次性设置:在
> npmjs.com 的包 Settings → Trusted Publisher 里添加 GitHub Actions
> (repo `YuhuanStudio/YunUI`,workflow `release.yml`)。**不需要任何 npm token。**

## 开发

```bash
pnpm install
pnpm dev        # tsup watch(配合 site/ 实时预览)
pnpm build      # 产出 dist/
pnpm typecheck
```

展示站在 `site/`(Next 16 + Tailwind v4):`pnpm --filter yunui-site dev`。

## 贡献 / 加新组件

完整规范见 **[CONTRIBUTING.md](./CONTRIBUTING.md)**。最容易踩的一条:**组件不内置文案 / 不绑定 i18n 库**。需要显示文字的组件必须走 adapter,不要 import next-intl,也不要硬写字符串:

```tsx
import { useYunUI } from "../adapters/context";

export function Thing() {
  const t = useYunUI().useT("thing");   // 命名空间
  return <button>{t("submit")}</button>; // key,不是字面量
}
```

- 不注入 provider 时 `useT` 直接返回 key(组件照样渲染,展示站也是这样跑的)。
- 真正的翻译文案加到**消费方**(如 Yunxin `messages/{en,zh-CN,zh-TW}.json`),不放 YunUI。
- 同理:路由/图片走 `useYunUI().Link/Image/useRouter`(别用 `next/*`);业务数据走 **props**(别在组件里 `useBranding`/`fetch`/`localStorage`)。

## License

Apache-2.0 © yuhuanowo
