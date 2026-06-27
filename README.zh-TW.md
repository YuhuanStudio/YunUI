# YunUI

[![npm](https://img.shields.io/npm/v/@yuhuanowo/yunui.svg)](https://www.npmjs.com/package/@yuhuanowo/yunui)
[![showcase & docs](https://img.shields.io/badge/展示與文件-ui.yuhuanstudio.com-111)](https://ui.yuhuanstudio.com)

[English](./README.md) · [简体中文](./README.zh-CN.md) · **繁體中文**

一套不喧嘩的 React 19 + Tailwind v4 設計系統 —— 每個細節都被好好想過。

🔗 **線上展示與文件 → [ui.yuhuanstudio.com](https://ui.yuhuanstudio.com)**

<p align="center">
  <a href="https://ui.yuhuanstudio.com"><img src="https://raw.githubusercontent.com/YuhuanStudio/YunUI/main/assets/hero-light.png" alt="YunUI — 安靜的好看，安靜的扎實" width="100%"></a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/YuhuanStudio/YunUI/main/assets/showcase-light.png" alt="所有 YunUI 元件，盡在一頁" width="49%">
  <img src="https://raw.githubusercontent.com/YuhuanStudio/YunUI/main/assets/hero-dark.png" alt="YunUI 純黑主題" width="49%">
</p>

改 YunUI 一處 → 發版 → 各專案升級版本號即可同步取得統一的 **設計 token、動畫、元件**。已在 Yunxin 生產環境使用。

---

## 安裝

```bash
npm i @yuhuanowo/yunui      # 或 pnpm add / yarn add
```

要求消費方使用 **React 19** 與 **Tailwind CSS v4**(peerDependencies)。

> 想讓 import 保持短名 `yunui`?用套件別名:
> ```jsonc
> // package.json
> "dependencies": { "yunui": "npm:@yuhuanowo/yunui@^0.2.0" }
> ```
> 之後 `import { Button } from "yunui"` 即可,下文範例同理。

## 接入(3 步)

### 1. 引入設計系統樣式

在全域 CSS(如 `app/globals.css`):

```css
@import "tailwindcss";
@import "@yuhuanowo/yunui/css";

/* 關鍵:讓 Tailwind v4 掃描 YunUI 產物裡的內聯工具類,否則元件會「沒樣式」 */
@source "../node_modules/@yuhuanowo/yunui/dist";
```

> `@source` 路徑以該 CSS 檔為基準,依你的專案結構調整。字型(Geist / JetBrains Mono)不打包,由消費方自行載入。

### 2. 用元件

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

### 3.(可選)注入框架轉接器

部分元件需要路由 / 圖片 / i18n。在根佈局用 `YunUIProvider` 注入你框架的實作:

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

不注入時,YunUI 使用零相依預設實作(`<a>` / `<img>` / identity 翻譯)。

---

## 入口

| 入口 | 內容 |
| --- | --- |
| `@yuhuanowo/yunui` | 原子元件:Button / IconButton / Input / Textarea / Card / Badge / Dialog / Select / Slider / Progress / Tabs / Avatar / Tooltip / DropdownMenu / Skeleton / Spinner / PageLoader / EmptyState / Label,佈局原語 Flex / Grid / Row / Column / Stack,資料展示 Table / Breadcrumb / Pagination,互動元件 Accordion / RadioGroup / Switch / Checkbox / Combobox / CustomSelect / SegmentedSelect / NavTabs / Collapsible / Popover / Modal / Sheet / ConfirmModal / ThemeToggle,以及 ShinyButton / Marquee / BentoGrid / AnimatedNumber 與 MotionDiv·fadeIn·stagger 等動畫預設 |
| `@yuhuanowo/yunui/css` | 設計系統樣式(token 變數、`@theme` 對應、`.btn`/`.card`/`.glass` 等全域類別、動畫 keyframes) |
| `@yuhuanowo/yunui/adapters` | `YunUIProvider` / `useYunUI` 與轉接器介面 |
| `@yuhuanowo/yunui/patterns` | 頁面級元件:FAQ、StatCard(`tone`/`inline`/`valueFirst` 變體)、BlogCard、CodeBlock、Sidebar、PageHeader、BackgroundEffects 等 |
| `@yuhuanowo/yunui/ai` | AI 產品域元件(prop 驅動,無 API 直連):ProviderIcon / ModelIcon / ModelTypeIcon、ModelCard、CapabilitySelector、Navbar、Footer、LanguageSwitcher、ThinkingBlock、IDBadge … |

**工具 / hooks**(從 `@yuhuanowo/yunui` 匯出):`cn`、`toast` / `Toaster`(基於 sonner)、`MotionDiv` / `MotionSpan` / `fadeIn` / `staggerContainer` / `staggerItem`、`useEscapeKey` / `useBodyScrollLock` / `useModalBehavior`。

> ⚠️ **`yunui/ai` 的圖示素材需要你自備。** `ProviderIcon` / `ModelIcon` / `ModelAvatar` / `ModelCard` 會從 `/icons/providers/*.png`、`/icons/models/*.png` 載入圖示 —— 這些素材**不隨 npm 套件發佈**(套件裡只有 `dist` / `styles`)。消費方需把對應圖示託管到 `iconBasePath` 指向的位置(預設 `/icons`,可從本倉庫 `site/public/icons/` 取),否則圖示會顯示為裂圖。base path 可透過轉接器設定:`<YunUIProvider adapters={{ iconBasePath: "/assets/icons" }}>`(也可指向 CDN)。單個自訂圖示 URL 透過元件 `iconUrl` prop 傳入,原樣使用。
>
> 同樣,`./_deferred/ai-search`(文件 AI 搜尋)**未匯出** —— 它綁定 `@ai-sdk/react` + 聊天堆疊,是產品功能而非通用元件,匯出會給函式庫強加 ai-sdk peer 相依。

---

## 主題

三套主題,透過根元素 class 切換(配合 `next-themes`):`light`(預設 `:root`)、`.dark`、`.true-black`(OLED)。

## 同步流程(改一處,各專案同步)

```bash
# 在 YunUI:改程式碼 → 升 package.json 版本號 → 提交
git tag v0.2.0 && git push origin v0.2.0
# ↑ 推 tag 觸發 GitHub Actions:typecheck → test → build → npm publish
#   (tokenless OIDC trusted publishing + provenance,無需本地發佈/OTP)

# 在消費專案:
pnpm up @yuhuanowo/yunui
```

> 發佈走 GitHub Actions(`.github/workflows/release.yml`)。一次性設定:在
> npmjs.com 的套件 Settings → Trusted Publisher 裡新增 GitHub Actions
> (repo `YuhuanStudio/YunUI`,workflow `release.yml`)。**不需要任何 npm token。**

## 開發

```bash
pnpm install
pnpm dev        # tsup watch(配合 site/ 即時預覽)
pnpm build      # 產出 dist/
pnpm typecheck
pnpm test
```

展示站在 `site/`(Next 16 + Tailwind v4):`pnpm --filter yunui-site dev`。

## 貢獻 / 加新元件

完整規範見 **[CONTRIBUTING.md](./CONTRIBUTING.md)**。最容易踩的一條:**元件不內建文案 / 不綁定 i18n 函式庫**。需要顯示文字的元件必須走 adapter,不要 import next-intl,也不要硬寫字串:

```tsx
import { useYunUI } from "../adapters/context";

export function Thing() {
  const t = useYunUI().useT("thing");   // 命名空間
  return <button>{t("submit")}</button>; // key,不是字面量
}
```

- 不注入 provider 時 `useT` 直接回傳 key(元件照樣渲染,展示站也是這樣跑的)。
- 真正的翻譯文案加到**消費方**(如 Yunxin `messages/{en,zh-CN,zh-TW}.json`),不放 YunUI。
- 同理:路由/圖片走 `useYunUI().Link/Image/useRouter`(別用 `next/*`);業務資料走 **props**(別在元件裡 `useBranding`/`fetch`/`localStorage`)。

## License

Apache-2.0 © YuhuanStudio
