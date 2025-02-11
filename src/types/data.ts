import type { HTMLAttributes } from "astro/types";
import type { InferEntrySchema } from "astro:content";

export type LinkProps = Exclude<HTMLAttributes<"a">, "href"> & {
  href: string;
  background?: "dark" | "light";
  className?: string;
};

export type TReferenceIndustry = InferEntrySchema<"references">["industry"];
