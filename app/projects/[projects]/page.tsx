import { getProject } from "@/sanity/sanity-utils";

type Props = {
  params: {
    project: string;
  };
};

export default async function Project({ params }: Props) {
  const slug = params.project;
  const project = await getProject(String(slug));

  if (project === null) {
    return <div>Project not found</div>;
  }

  return <div>{project.name}</div>;
}
