import tailwindcss from "@tailwindcss/vite";
import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  // Teachers use older classroom tablets; keep the output runnable on iOS 15 Safari.
  build: { target: ["es2020", "safari15"] },
  plugins: [
    tailwindcss(),
    sveltekit({
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
      },
      adapter: adapter(),
      prerender: {
        // #how-it-works opens the How it works panel rather than naming an
        // element, so nothing on the page carries that id on purpose.
        handleMissingId: ({ id, message }) => {
          if (id !== "how-it-works") throw new Error(message);
        },
      },
    }),
  ],
});
