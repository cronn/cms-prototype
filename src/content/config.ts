import { defineCollection, reference, z } from "astro:content";
import { WORKING_HOURS, WORKING_PLACES } from "../constants";

const blog = defineCollection({
  type: "content",
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
  type: "content",
  schema: z.object({
    title: z.string(),
    referenceDate: z.coerce.date(),
    titleImage: z.string(),
    industry: z.string().optional(),
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
  type: "data",
  schema: z.object({
    title: z.string(),
    // Transform string to Date object
    jobDate: z.coerce.date(),
    workingHours: z.union([
      z.literal(WORKING_HOURS.fullTime),
      z.literal(WORKING_HOURS.partTime),
    ]),
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

const wiki = defineCollection({
  type: "content",
  schema: z.object({
    ogTitle: z.string(),
    ogDescription: z.string(),
    title: z.string(),
    titleImage: z.string(),
    relatedArticles: z.array(reference("wiki")).max(3).optional(),
  }),
});

const authors = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    image: z.string(),
  }),
});

export const collections = { blog, references, jobs, wiki, authors };
