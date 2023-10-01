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
