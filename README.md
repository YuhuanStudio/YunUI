# YunUI

Yunxin 的设计系统(YUNXIN Design System v3 / Zinc),提取成一个独立、版本化、可被多项目引用的 UI 库 —— 对标 [once-ui.com](https://once-ui.com)。

改 YunUI 一处 → 发版 → 各项目升级版本号即可同步获得统一的 **设计 token、动画、组件**。

---

## 安装

```bash
pnpm add github:yuhuanowo/YunUI#v0.1.0
# 或私有 registry: pnpm add yunui@0.1.0
```

YunUI 要求消费方使用 **React 19** 与 **Tailwind CSS v4**(均为 peerDependencies)。

## 接入(3 步)

### 1. 引入设计系统样式

在你的全局 CSS(如 `app/globals.css`)里:

```css
@import "tailwindcss";
@import "yunui/css";

/* 关键:让 Tailwind v4 扫描 YunUI 产物里的内联工具类,否则组件会"没样式" */
@source "../node_modules/yunui/dist";
```

> `@source` 的相对路径以该 CSS 文件为基准,按你的项目结构调整。

### 2. 用组件

```tsx
import { Button, Card, Dialog, DialogContent } from "yunui";

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
import { YunUIProvider } from "yunui/adapters";
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
| `yunui` | 原子组件(Button / Input / Card / Dialog / Select / Tabs / DropdownMenu / Tooltip …) |
| `yunui/css` | 设计系统样式(token 变量、`@theme` 映射、全局类、动画 keyframes) |
| `yunui/adapters` | `YunUIProvider` / `useYunUI` 与适配器接口 |
| `yunui/patterns` | 中等耦合的页面级组件(landing / blog / docs) |
| `yunui/ai` | Yunxin AI 产品域组件(prop 驱动,无 API 直连) |

---

## 主题

三套主题,通过根元素 class 切换(配合 `next-themes`):`light`(默认 `:root`)、`.dark`、`.true-black`(OLED)。

## 同步流程

1. 改 YunUI 源码 → `pnpm build`。
2. 提交并打 tag:`git tag v0.2.0 && git push --tags`。
3. 各消费项目 `pnpm up yunui` 升到新版本。

## 开发

```bash
pnpm install
pnpm dev        # tsup watch
pnpm build      # 产出 dist/
pnpm typecheck
```
