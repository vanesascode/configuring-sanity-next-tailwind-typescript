# Portfolio with Next.js 13, Sanity.io, TailwindCSS, and TypeScript

## NEXT.JS 13

- [x] Create a project. Run: `npx create-next-app@latest`

This project is created running the `App` feature (with no src folder).

In Next.js 13, the `app folder` structure has introduced several new features that enhance code organization and modularity. Here are some of the notable features:

`Component Folders`: You can now create a dedicated folder for each component in your application. This folder-based structure allows you to group all the related files and resources for a component in a single location. It promotes better organization and makes it easier to locate and manage components.

`Layout Files`: Within a component folder, you can include a `layout.tsx file`. This file defines the specific layout or structure unique to that component. By separating the layout logic into its own file, you can achieve better code reusability and maintainability. The main layout.tsx file or any higher-level component can import and incorporate the layout.tsx file from the component folder, ensuring a consistent and unified user interface across the application.

`Child Components`: With the component folder structure, you can have multiple child components within a folder. This hierarchical arrangement allows you to encapsulate related functionality and UI elements within a single component folder. It improves the overall structure and readability of your codebase.

`Scoped CSS`: Next.js 13 introduces a new way to handle CSS for components within the app folder. By default, Next.js scopes the CSS for each component, preventing styles from leaking to other components. This promotes better encapsulation and avoids potential conflicts between CSS styles across components.

Our home page is now `page.tsx`

## SANITY

`Sanity.io` is a cloud-based `content management system (CMS)`. It provides a cloud infrastructure where you can store and manage your content.

This means that your content and datasets are hosted and accessible through the cloud, allowing for easy collaboration, scalability, and accessibility from anywhere with an internet connection.

The content within Sanity.io is organized and managed using `datasets`. Datasets are collections of `JSON documents` that can have different types and references to each other. The raw JSON data can be viewed and edited within the Sanity.io dashboard.

- [x] Get a free account and log in: https://www.sanity.io/pricing

Or get boosted free plan: https://www.sanity.io/youtube

- [x] Create a project. Run: `npm create sanity@latest`

Among all the files created, the file `sanity.config.ts` is very important cos in there you have:

```
  projectId: '********',
  dataset: 'production',
```

"All of the content lives in a cloud called the 'Content Link'. All of this happens within datasets.

So, a dataset is a collection of JSON documents that can be of different types and have references to each other.

As we start adding schemas and inputting content, we will be able to see the raw JSON of our data.

## HOW TO EMBED YOUR SANITY STUDIO INTO NEXT.JS

### Dev mode:

- [x] Go to your projects in your personal manage site in Sanity: `https://www.sanity.io/manage/personal`

And open your project.

- [x] Then, in the tab `API`, in the CORS origins section, add the URL of your frontend (for Next in dev mode, it normally is `http://localhost:3000`) and allow credentials (the checkbox)

---

In the frontend folder:

Install the Sanity package and the libray:

- [x] `npm install sanity next-sanity`

Then, in the root create a file called: `sanity.config.ts` and fill it like this:

```

import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';


const config = defineConfig({
  projectId: "********",
  dataset: "production",
  title: "vanesascode portfolio",
  apiVersion: "2023-10-01", (this is today's date)
  basePath: "/admin",
  plugins: [deskTool()],

})

export default config

```

The code imports the `defineConfig function` from the "sanity" package and the `deskTool module` from the "sanity/desk" submodule. These modules are required to configure and set up the Sanity.io CMS.

---

Create a file within the folder app: `admin/[[...index]]/page.tsx`:

`[[...index]]`: This segment is enclosed in double square brackets. In Next.js, this syntax is used for dynamic routes or catch-all routes. It indicates that this part of the path can match multiple segments or subdirectories. The ...index represents a parameter or placeholder that can capture any remaining segments after admin/.

In the file (that will automatically become a page.tsx file with the [[...index]] folder and within the admin folder) add:

```
import config from '@/sanity.config';
import { NextStudio } from 'next-sanity/studio';
export default function Admin() {
  return <NextStudio config={config} />;
}
```

👉 If the last config remains underlined with red, press `CTRL + Space` and select the option @/sanity.config.

The "use client" line is telling Next.js that we don't want this in the server side, but in the client side, so we can see it in the browser.

### Now you can run http://localhost:3000/admin and the sanity studio for this project will be opened there!

Now we have the sanity Studio embedded right into slash admin. This is great because everything lives at one URL and it will be way more seamless for any users or clients or customers or whoever that are using our site, to go to slash admin, create content, log in right there and start editing...

## Creating our schemas

In a folder called Sanity, inside another called schemas, we have a main file called index.ts where we import and export all our schemas so our `sanity.config.ts` is not so full:

```
import project from "./project-schema";

const schemas = [project];

export default schemas;
```

We then import it into the `sanity.config.ts` file:

```
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import schemas from "./sanity/schemas";

const config = defineConfig({
  projectId: "7wqo6kcr",
  dataset: "production",
  title: "vanesascode portfolio",
  apiVersion: "2023-10-01",
  basePath: "/admin",
  plugins: [deskTool()],
  schema: {
    types: schemas,
  },
});

export default config;
```

In a schema, we create a JSON document in which we specify all the fields, names and types we'll have for each object we create. Example:

```
const project = {
  name: "project",
  title: "Projects",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
      },
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "caption",
          title: "Caption",
          type: "string",
        },
      ],
    },
    {
      name: "url",
      title: "Url",
      type: "url",
    },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
};

export default project;

```

## Displaying data

We create the file `sanity-utils.ts` in the sanity folder and in this file we're going to put all the functions that we're going to use to go `grab data`:

```
import { groq, createClient } from "next-sanity";

export async function getProjects() {
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
};

```

This code imports the groq and createClient functions from the "next-sanity" package.

It defines an asynchronous function called getProjects that creates a Sanity client using the createClient function. The createClient function takes an object with the projectId, dataset, and apiVersion properties.

`The getProjects function then uses the Sanity client to fetch data from the Sanity API` using a `GROQ query`.

The GROQ query fetches an `array` of objects with properties such as \_id, \_createAt, name, slug, image, url, and content.

## Dealing with Typescript

At this point, trying to map our data into the main page.tsx file, we encounter a type error in the word project:

```
import { getProjects } from "@/sanity/sanity-utils";

export default async function Home() {
  const projects = await getProjects();

  return (
    <div>
      {projects.map((project) => (
        <div key={project._id}>{project.name}</div>
      ))}
    </div>
  );
}
```

So, we are going to have a folder to deal with our types. We create a folder called `types` and inside a file called `Project.ts`.

In it, we create our type 'Project':

```
import { PortableTextBlock } from "sanity";

export type Project = {
  _id: string;
  _createdAt: string;
  name: string;
  slug: string;
  image: string;
  url: string;
  content: PortableTextBlock[];
};

```

And then, 👉 instead of having to especify it everytime we need to use the type Project, (in our page.tsx now, for example) we do it just once in our `sanity-utils.ts` file:

```
import { Project } from "@/types/Project";
import { groq, createClient } from "next-sanity";

export async function getProjects(): Promise<Project[]> {...etc
```

Now, the code imports the Project type from the "@/types/Project" module, indicating that the Project type is defined in a separate module and can be used in this file. And the getProjects function returns `a Promise of type Project[]`.

## TAILWIND

Install it [(go to docs and choose NEXT)](https://tailwindcss.com/docs/installation/framework-guides)

- [x] run: `npm install -D tailwindcss postcss autoprefixer`
- [x] create a config file: `npx tailwindcss init -p`

Also, paste this in your css file:

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Max-width

1280px and 1920px are the two standard widths for web design. A 1280px website will look great on laptops and mobile devices but not so great on large monitors. To ensure your site looks just as good on big screens as it does on small screens, set your max site width to `1920px` or more:

```
<div className="max-w-[1920px] mx-auto">
 </div>
```

To make `eslint` happy, use entities:

```
  <h1>Hello I&apos;m vanesascode! </h1>
```

### Gradient texts

```
 <span className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
```

### Don't use <img/> in Next, use <Image/>

Compared to the regular <img> tag, the `Image` component offers several benefits:

Image Optimization: Next.js automatically optimizes and optimally serves the images based on the device size and screen resolution. It generates multiple optimized versions of the image and delivers the most appropriate one to the client.

Lazy Loading: The Image component supports lazy loading by default, meaning that images are loaded only when they are visible in the viewport. This improves the performance of your application, especially when there are many images on a page.

Automatic Image Optimization: Next.js optimizes images by default. It applies techniques like image compression, responsive image loading, and automatic format selection to ensure the best performance and user experience.

Accessibility: The Image component provides built-in accessibility features. It automatically adds the required alt attribute to the rendered <img> tag based on the alt prop you provide. This helps improve the accessibility of your application.

### Sanity images config in Next

So there are no problems showing images in the client from Sanity, we add this remote pattern for them:

```
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      }
    ],
  },
}

module.exports = nextConfig

```

👉 If still, your data is not being refreshed in the client, make a `hard refresh` : Pressing `Ctrl + F5 (Windows)` or `Cmd + Shift + R (Mac)` in your web browser will perform a hard refresh.

## Individual project pages

We added a 'Link' to our cards with this route:

```
  <Link
    href={`/projects/${project.slug}`}
```

So now we have to create the folders. Within app, call it `projects/[projects]/page.tsx`
This file path tells us that we have the `dynamic route`(${project.slug})

In the page, we code this for a start:

```
type Props = {
  params: {
    project: string;
  };
};

export default async function ProjectsPage({ params }: Props) {
  const slug = params.project;
  const project = await getProjects(slug);

  return <div>hello world</div>;
}
```

However, the 'getProjects' function will give us the error that cannot be found. So, we add it to our `sanity-utils.ts` file:
