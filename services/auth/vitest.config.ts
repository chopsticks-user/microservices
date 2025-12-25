import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "build/"],
    },
  },
  // resolve: {
  //   alias: {
  //     utilities: path.resolve(__dirname, "./source/utilities"),
  //     models: path.resolve(__dirname, "./source/models"),
  //     services: path.resolve(__dirname, "./source/services"),
  //     controllers: path.resolve(__dirname, "./source/controllers"),
  //   },
  // },
});
