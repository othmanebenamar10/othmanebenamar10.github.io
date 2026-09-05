import { defineConfig } from "vite";

const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const owner = process.env.GITHUB_REPOSITORY_OWNER ?? "";
const githubPagesBase =
  repo && owner && repo !== `${owner}.github.io` ? `/${repo}/` : "/";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === "true" ? githubPagesBase : "/",
});
