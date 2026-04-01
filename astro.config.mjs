import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";

export default defineConfig({
	site: "https://mateowang.dev",
	integrations: [mdx()],
	markdown: {
		remarkPlugins: [remarkReadingTime],
		shikiConfig: {
			theme: "dracula",
		},
	},
});
