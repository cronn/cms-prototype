import type { CollectionEntry, DataEntryMap } from "astro:content";

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

/**
 * Utility funciton to generate filter options by attribute from a given collection
 * @param {CollectionEntry[Array]} entries - Collection to extract the filter options from
 * @param {string} filterAttribute - Attribute to be filtered by
 * @returns {string[Array]} Array of filter options
 */

export function getFilterOptions<
  T extends CollectionEntry<keyof DataEntryMap>,
  E extends StringKeys<T["data"]>,
>(entries: T[], filterAttribute: E): T["data"][E][] {
  return [
    ...(new Set(
      entries
        .map(({ data }) => data[filterAttribute as keyof typeof data] as string)
        .toSorted((a, b) => a.localeCompare(b)),
    ) as unknown as T["data"][E][]),
  ];
}
