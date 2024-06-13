import { join, fromFileUrl } from "https://deno.land/std@0.188.0/path/mod.ts";
import { getIssueEvent } from "./common.ts";

const { githubEvent } = await getIssueEvent();
console.log("GitHub Event:", JSON.stringify(githubEvent, null, 2));

// Ensure you are getting the correct issue number or pull request number
console.log("Issue/PR Number:", githubEvent.issue.number);

const __dirname = fromFileUrl(new URL(".", import.meta.url));

const labels = new Set(githubEvent.issue.labels.map((l: { name: string }) => l.name));
console.log("Labels:", labels);

const entry = labels.has("ui-gen")
  ? "ui-gen"
  : labels.has("vue-ui-gen")
  ? "vue-ui-gen"
  : labels.has("svelte-ui-gen")
  ? "svelte-ui-gen"
  : null;

if (!entry) {
  throw new Error("Unknown entry");
} else {
  const entryPath = join(__dirname, `./${entry}.ts`);
  console.log(`Importing module: ${entryPath}`);
  const module = await import(entryPath);
  if (module.main) {
    module.main();
  } else {
    console.error(`No main function found in ${entryPath}`);
  }
}
