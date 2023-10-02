import { getProjects } from "@/sanity/sanity-utils";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className="max-w-[1920px] mx-auto py-20 px-5">
      {/*TITLE */}

      <h1 className="text-7xl font-extrabold">
        Hello I&apos;m{" "}
        <span className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          vanesascode
        </span>
      </h1>

      {/*SUBTITLE */}

      <p className="mt-3 text-xl">
        Glad to see you here! Check out my projects!
      </p>

      <div className="mt-24 lg:grid-cols-3 md:grid-cols-2 grid gap-8 ">
        {projects.map((project) => (
          <Link
            href={`/projects/${project.slug}`}
            key={project._id}
            className="border border-white rounded-lg p-5 d-flex justify-center items-center hover:scale-105 hover:border-blue-500 transition"
          >
            {project.image && (
              <Image
                src={project.image}
                alt={project.name}
                width={350}
                height={350}
                className="object-cover mx-auto"
              />
            )}

            <div className="font-extrabold  bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent p-3">
              {project.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// if you want your data to be fetched on the server side and shown to your react
// component on a page, you would do export function get static props, and then if you had a page that had multiple paths, like a dynamic route, you would also have to do export function get static paths
