import about from "./about.json";
import blog from "./blog.json";
import header from "./header.json";
import index from "./index.json";
import jobs from "./jobs.json";
import references from "./references.json";
import shared from "./shared.json";
import solutions from "./solutions.json";

const germanNamespaces = {
  about,
  blog,
  header,
  index,
  jobs,
  references,
  shared,
  solutions,
} as const;

export default germanNamespaces;
