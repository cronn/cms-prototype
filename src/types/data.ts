import type { HTMLAttributes } from "astro/types";

export type LinkProps = Exclude<HTMLAttributes<"a">, "href"> & {
  href: string;
  background?: "dark" | "light";
  className?: string;
};
