import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";
import { INDUSTRY_OPTIONS, WORKING_HOURS, WORKING_PLACES } from "./constants";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    ogTitle: z.string(),
    ogDescription: z.string(),
    title: z.string(),
    titleImage: z.string().optional(),
    authors: z.array(reference("authors")),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    teaser: z.string().optional(),
  }),
});

const references = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/references" }),
  schema: z.object({
    title: z.string(),
    referenceDate: z.coerce.date(),
    titleImage: z.string(),
    industry: z.enum([
      INDUSTRY_OPTIONS.eGovernment,
      INDUSTRY_OPTIONS.entertainment,
      INDUSTRY_OPTIONS.ki,
      INDUSTRY_OPTIONS.logistics,
      INDUSTRY_OPTIONS.services,
      INDUSTRY_OPTIONS.telecommunication,
      INDUSTRY_OPTIONS.mobility,
    ]),
    ogTitle: z.string().optional(),
    ogDescription: z.string(),
    customerLogo: z.string(),
    customerTitle: z.string(),
    projectAspects: z.array(
      z.object({ title: z.string(), specification: z.string() }),
    ),
    plusPoints: z.array(
      z.object({ title: z.string(), specification: z.string() }),
    ),
    relatedReferences: z.array(reference("references")).max(3).optional(),
  }),
});

const jobs = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/jobs" }),
  schema: z.object({
    title: z.string(),
    // Transform string to Date object
    jobDate: z.coerce.date(),
    applicationLink: z.string().optional(),
    workingHours: z
      .array(
        z.union([
          z.literal(WORKING_HOURS.fullTime),
          z.literal(WORKING_HOURS.partTime),
        ]),
      )
      .nonempty(),
    workingPlace: z.enum([
      WORKING_PLACES.bonn,
      WORKING_PLACES.hamburg,
      WORKING_PLACES.bialystok,
    ]),
    tasks: z.array(z.object({ task: z.string() })),
    qualifications: z.array(z.object({ qualification: z.string() })),
    benefits: z.array(z.object({ benefit: z.string() })),
  }),
});

const solutions = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/solutions" }),
  schema: z.object({
    ogTitle: z.string(),
    ogDescription: z.string(),
    title: z.string(),
    articleDate: z.coerce.date(),
    titleImage: z.string(),
    relatedArticles: z.array(reference("solutions")).max(3).optional(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/authors" }),
  schema: z.object({
    name: z.string(),
    image: z.string(),
  }),
});

export const collections = { blog, references, jobs, solutions, authors };
