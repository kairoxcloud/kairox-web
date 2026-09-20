import { defineConfig, globalIgnores } from "eslint/config";
import boundaries from "eslint-plugin-boundaries";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist/**"]),
  ...tseslint.configs.recommended,
  reactHooks.configs.flat["recommended-latest"],
  // sections -> components -> lib, and nothing flows back up
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      // The default resolver only knows .js, so without this every TSX import looks external.
      "import/resolver": { node: { extensions: [".js", ".jsx", ".ts", ".tsx"] } },
      "boundaries/elements": [
        { type: "section", pattern: "src/sections" },
        { type: "components", pattern: "src/components" },
        { type: "lib", pattern: "src/lib" },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            {
              from: { element: { type: "section" } },
              allow: { to: { element: { types: { anyOf: ["components", "lib"] } } } },
            },
            {
              from: { element: { type: "components" } },
              allow: { to: { element: { types: { anyOf: ["components", "lib"] } } } },
            },
            {
              from: { element: { type: "lib" } },
              allow: { to: { element: { type: "lib" } } },
            },
          ],
        },
      ],
    },
  },
]);
