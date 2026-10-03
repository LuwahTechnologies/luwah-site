import { PROJECTS } from "@/data/projects";
import { getSanityProjects } from "@/lib/sanity";
import { WorkContent } from "./WorkContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Work",
  description:
    "Real automation case studies with real results. Lead generation, community messaging, self-hosted infrastructure, and more.",
  path: "/work",
});

export const revalidate = 60;

export default async function WorkPage() {
  const projects = (await getSanityProjects()) ?? PROJECTS;
  return <WorkContent projects={projects} />;
}
