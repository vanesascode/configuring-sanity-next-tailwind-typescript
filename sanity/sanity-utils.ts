import { Project } from "@/types/Project";
import { groq, createClient } from "next-sanity";

export async function getProjects(): Promise<Project[]> {
  const client = createClient({
    projectId: "7wqo6kcr",
    dataset: "production",
    apiVersion: "2023-10-01",
  });

  return client.fetch(
    groq`*[_type == "project"] {
      _id,
      _createAt, 
      name,
      "slug": slug.current,
      "image": image.asset->url,
      url, 
      content
    }`
  );
}

export async function getProject(slug: string): Promise<Project> {
  const client = createClient({
    projectId: "7wqo6kcr",
    dataset: "production",
    apiVersion: "2023-10-01",
  });

  const response = await client.fetch(
    groq`*[_type == "project" && slug.current == $slug][0]{
      _id,
      _createdAt,
      name,
      "slug": slug.current,
      "image": image.asset->url,
      url,
      content
    }`,
    { slug: slug }
  );

  console.log(response); // Log the API response

  return response;
}
