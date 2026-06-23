import type { MDXComponents } from "mdx/types";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { ComponentPreview } from "@/components/docs/component-preview";
import { PropsTable } from "@/components/docs/props-table";
import {
  StatCardDemo,
  SwitchDemo,
  CheckboxDemo,
  PaginationDemo,
  NavTabsDemo,
  ComboboxDemo,
  CustomSelectDemo,
  SegmentedSelectDemo,
  ModalDemo,
  SheetDemo,
  ConfirmModalDemo,
  ToastDemo,
  StatCardVariantsDemo,
  SidebarDemo,
  AccountLockedCardDemo,
  MediaPageHeaderDemo,
  MediaEmptyStateDemo,
  BlogPaginationDemo,
  CategoryFilterDemo,
  CapabilitySelectorDemo,
  LanguageSwitcherDemo,
} from "@/components/docs/demos";

/**
 * Global MDX component map for @next/mdx (App Router reads this file by
 * convention). Merges fumadocs' styled defaults (headings, code, tables,
 * callouts, cards) with the YunUI doc components so every .mdx page can use
 * <ComponentPreview>, <PropsTable> and the client demo wrappers without
 * importing them.
 */
export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ComponentPreview,
    PropsTable,
    StatCardDemo,
    SwitchDemo,
    CheckboxDemo,
    PaginationDemo,
    NavTabsDemo,
    ComboboxDemo,
    CustomSelectDemo,
    SegmentedSelectDemo,
    ModalDemo,
    SheetDemo,
    ConfirmModalDemo,
    ToastDemo,
    StatCardVariantsDemo,
    SidebarDemo,
    AccountLockedCardDemo,
    MediaPageHeaderDemo,
    MediaEmptyStateDemo,
    BlogPaginationDemo,
    CategoryFilterDemo,
    CapabilitySelectorDemo,
    LanguageSwitcherDemo,
    ...components,
  };
}

export const getMDXComponents = useMDXComponents;
