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
export function getFilterOptions<T extends CollectionEntry<keyof DataEntryMap>>(
  entries: T[],
  filterAttribute: StringKeys<T["data"]>,
): string[] {
  return [
    ...new Set(
      entries.map(({ data }): string => {
        // TODO verify if type casting could be improved / avoided
        const value = data[filterAttribute as keyof typeof data] as string;
        return value.toLowerCase();
      }),
    ),
  ];
}
