/**
 * Button styles shaped like fumadocs' own `buttonVariants`, so a docs site can
 * drop this in where it expects that API.
 *
 * The classes are YunUI's registered theme colours, NOT `fd-*`. The `fd-*`
 * family is only declared inside YunUI's true-black scope, never as `@theme`
 * entries, so Tailwind generates no `bg-fd-primary` / `hover:bg-fd-accent` /
 * `ring-fd-ring` utility at all in a consumer that has not separately installed
 * fumadocs' theme — this whole exported API rendered unstyled outside the docs
 * site. Verified against the built stylesheets before and after.
 */
import { cva, type VariantProps } from 'class-variance-authority';

const variants = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary/80 disabled:bg-secondary disabled:text-secondary-foreground',
  outline: 'border border-border hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  secondary:
    'border border-border bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground',
} as const;

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: variants,
      // fumadocs use `color` instead of `variant`
      color: variants,
      size: {
        sm: 'gap-1 px-2 py-1.5 text-xs',
        icon: 'p-1.5 [&_svg]:size-5',
        'icon-sm': 'p-1.5 [&_svg]:size-4.5',
        'icon-xs': 'p-1 [&_svg]:size-4',
      },
    },
  },
);

/** Variant props for {@link buttonVariants}: `variant`/`color` (primary, outline, ghost, secondary) and `size` (sm, icon, icon-sm, icon-xs). */
export type ButtonProps = VariantProps<typeof buttonVariants>;
