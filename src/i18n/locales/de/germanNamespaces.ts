import about from "./about.json";
import blog from "./blog.json";
import header from "./header.json";
import index from "./index.json";
import jobs from "./jobs.json";
import references from "./references.json";
import shared from "./shared.json";
import wiki from "./wiki.json";

const germanNamespaces = {
  about,
  blog,
  header,
  index,
  jobs,
  references,
  shared,
  wiki,
} as const;

export default germanNamespaces;
