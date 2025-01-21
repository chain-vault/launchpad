// vite.config.ts
import { defineConfig } from "file:///Users/mre/projects/eywa/launchpad/.yarn/__virtual__/vite-virtual-184a44fc11/4/.yarn/berry/cache/vite-npm-5.4.10-30d2e3a4e2-10.zip/node_modules/vite/dist/node/index.js";
import react from "file:///Users/mre/projects/eywa/launchpad/.yarn/__virtual__/@vitejs-plugin-react-virtual-e0f1e7c30e/4/.yarn/berry/cache/@vitejs-plugin-react-npm-4.3.3-36a77676a2-10.zip/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tsconfigPaths from "file:///Users/mre/projects/eywa/launchpad/.yarn/__virtual__/vite-tsconfig-paths-virtual-9f6ad9576a/4/.yarn/berry/cache/vite-tsconfig-paths-npm-4.3.2-96d4ddd73d-10.zip/node_modules/vite-tsconfig-paths/dist/index.mjs";
import svgr from "file:///Users/mre/projects/eywa/launchpad/.yarn/__virtual__/vite-plugin-svgr-virtual-9d984c5b8b/4/.yarn/berry/cache/vite-plugin-svgr-npm-4.2.0-e0c6a7a1f0-10.zip/node_modules/vite-plugin-svgr/dist/index.js";
import rollupNodePolyFill from "file:///Users/mre/.yarn/berry/cache/rollup-plugin-node-polyfills-npm-0.2.1-d0e4f85f30-10.zip/node_modules/rollup-plugin-node-polyfills/dist/index.js";
import { nodePolyfills } from "file:///Users/mre/projects/eywa/launchpad/.yarn/__virtual__/vite-plugin-node-polyfills-virtual-97e5837dab/4/.yarn/berry/cache/vite-plugin-node-polyfills-npm-0.22.0-b49f4f8ad0-10.zip/node_modules/vite-plugin-node-polyfills/dist/index.js";
import { sentryVitePlugin } from "file:///Users/mre/.yarn/berry/cache/@sentry-vite-plugin-npm-2.22.6-e8af8577c3-10.zip/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
import * as child from "child_process";
import { TanStackRouterVite } from "file:///Users/mre/.yarn/berry/cache/@tanstack-router-vite-plugin-npm-1.76.4-dd5ef7cd6a-10.zip/node_modules/@tanstack/router-vite-plugin/dist/esm/index.js";
var commitHash = child.execSync("git rev-parse HEAD").toString();
var fileNames = [
  "src",
  "components",
  "assets",
  "hooks",
  "screens",
  "theme",
  "app-types",
  "utils",
  "constants",
  "routes",
  "adapters",
  "integrations",
  "idl",
  "atoms"
];
var filePaths = fileNames.reduce(
  (filePathAcc, currentFileName) => ({
    ...filePathAcc,
    [`@${currentFileName}`]: `/${currentFileName === "src" ? currentFileName : `src/${currentFileName}`}`
  }),
  {}
);
var vite_config_default = defineConfig({
  // base: './',
  plugins: [
    tsconfigPaths(),
    TanStackRouterVite(),
    react({
      babel: {
        presets: ["jotai/babel/preset"]
      }
    }),
    nodePolyfills({
      exclude: ["fs"],
      // Whether to polyfill specific globals.
      globals: {
        Buffer: true,
        global: true,
        process: true
      },
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true
    }),
    svgr(),
    sentryVitePlugin({
      org: "apeon",
      project: "apeonlbp",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        filesToDeleteAfterUpload: ["dist/**/*.js.map"]
      }
    })
    // visualizer({
    //   open: true,
    //   filename: 'bundle-visualization.html',
    //   template: 'treemap',
    // }),
  ],
  // worker: {
  //   plugins: [comlink()],
  // },
  optimizeDeps: {
    esbuildOptions: {
      define: { global: "globalThis" }
    },
    include: ["react-icons"]
  },
  server: {
    host: "0.0.0.0",
    port: 3e3
  },
  resolve: {
    alias: {
      ...filePaths,
      process: "process/browser",
      path: "path-browserify",
      os: "os-browserify",
      stream: "stream-browserify"
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      plugins: [rollupNodePolyFill()]
    }
  },
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(commitHash)
  }
  // esbuild: {
  //   drop: ['console', 'debugger'],
  // },
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbXJlL3Byb2plY3RzL2V5d2EvbGF1bmNocGFkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbXJlL3Byb2plY3RzL2V5d2EvbGF1bmNocGFkL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tcmUvcHJvamVjdHMvZXl3YS9sYXVuY2hwYWQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcbmltcG9ydCBzdmdyIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Z3InO1xuaW1wb3J0IHJvbGx1cE5vZGVQb2x5RmlsbCBmcm9tICdyb2xsdXAtcGx1Z2luLW5vZGUtcG9seWZpbGxzJztcbmltcG9ydCB7IG5vZGVQb2x5ZmlsbHMgfSBmcm9tICd2aXRlLXBsdWdpbi1ub2RlLXBvbHlmaWxscyc7XG5pbXBvcnQgeyBzZW50cnlWaXRlUGx1Z2luIH0gZnJvbSAnQHNlbnRyeS92aXRlLXBsdWdpbic7XG5pbXBvcnQgKiBhcyBjaGlsZCBmcm9tICdjaGlsZF9wcm9jZXNzJztcbi8vIGltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInO1xuXG5jb25zdCBjb21taXRIYXNoID0gY2hpbGQuZXhlY1N5bmMoJ2dpdCByZXYtcGFyc2UgSEVBRCcpLnRvU3RyaW5nKCk7XG5cbmltcG9ydCB7IFRhblN0YWNrUm91dGVyVml0ZSB9IGZyb20gJ0B0YW5zdGFjay9yb3V0ZXItdml0ZS1wbHVnaW4nO1xuXG5jb25zdCBmaWxlTmFtZXMgPSBbXG4gICdzcmMnLFxuICAnY29tcG9uZW50cycsXG4gICdhc3NldHMnLFxuICAnaG9va3MnLFxuICAnc2NyZWVucycsXG4gICd0aGVtZScsXG4gICdhcHAtdHlwZXMnLFxuICAndXRpbHMnLFxuICAnY29uc3RhbnRzJyxcbiAgJ3JvdXRlcycsXG4gICdhZGFwdGVycycsXG4gICdpbnRlZ3JhdGlvbnMnLFxuICAnaWRsJyxcbiAgJ2F0b21zJyxcbl07XG5cbmNvbnN0IGZpbGVQYXRocyA9IGZpbGVOYW1lcy5yZWR1Y2UoXG4gIChmaWxlUGF0aEFjYywgY3VycmVudEZpbGVOYW1lKSA9PiAoe1xuICAgIC4uLmZpbGVQYXRoQWNjLFxuICAgIFtgQCR7Y3VycmVudEZpbGVOYW1lfWBdOiBgLyR7XG4gICAgICBjdXJyZW50RmlsZU5hbWUgPT09ICdzcmMnID8gY3VycmVudEZpbGVOYW1lIDogYHNyYy8ke2N1cnJlbnRGaWxlTmFtZX1gXG4gICAgfWAsXG4gIH0pLFxuICB7fVxuKTtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIC8vIGJhc2U6ICcuLycsXG4gIHBsdWdpbnM6IFtcbiAgICB0c2NvbmZpZ1BhdGhzKCksXG4gICAgVGFuU3RhY2tSb3V0ZXJWaXRlKCksXG4gICAgcmVhY3Qoe1xuICAgICAgYmFiZWw6IHtcbiAgICAgICAgcHJlc2V0czogWydqb3RhaS9iYWJlbC9wcmVzZXQnXSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgbm9kZVBvbHlmaWxscyh7XG4gICAgICBleGNsdWRlOiBbJ2ZzJ10sXG4gICAgICAvLyBXaGV0aGVyIHRvIHBvbHlmaWxsIHNwZWNpZmljIGdsb2JhbHMuXG4gICAgICBnbG9iYWxzOiB7XG4gICAgICAgIEJ1ZmZlcjogdHJ1ZSxcbiAgICAgICAgZ2xvYmFsOiB0cnVlLFxuICAgICAgICBwcm9jZXNzOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIC8vIFdoZXRoZXIgdG8gcG9seWZpbGwgYG5vZGU6YCBwcm90b2NvbCBpbXBvcnRzLlxuICAgICAgcHJvdG9jb2xJbXBvcnRzOiB0cnVlLFxuICAgIH0pLFxuICAgIHN2Z3IoKSxcbiAgICBzZW50cnlWaXRlUGx1Z2luKHtcbiAgICAgIG9yZzogJ2FwZW9uJyxcbiAgICAgIHByb2plY3Q6ICdhcGVvbmxicCcsXG4gICAgICBhdXRoVG9rZW46IHByb2Nlc3MuZW52LlNFTlRSWV9BVVRIX1RPS0VOLFxuICAgICAgc291cmNlbWFwczoge1xuICAgICAgICBmaWxlc1RvRGVsZXRlQWZ0ZXJVcGxvYWQ6IFsnZGlzdC8qKi8qLmpzLm1hcCddLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICAvLyB2aXN1YWxpemVyKHtcbiAgICAvLyAgIG9wZW46IHRydWUsXG4gICAgLy8gICBmaWxlbmFtZTogJ2J1bmRsZS12aXN1YWxpemF0aW9uLmh0bWwnLFxuICAgIC8vICAgdGVtcGxhdGU6ICd0cmVlbWFwJyxcbiAgICAvLyB9KSxcbiAgXSxcbiAgLy8gd29ya2VyOiB7XG4gIC8vICAgcGx1Z2luczogW2NvbWxpbmsoKV0sXG4gIC8vIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICBkZWZpbmU6IHsgZ2xvYmFsOiAnZ2xvYmFsVGhpcycgfSxcbiAgICB9LFxuICAgIGluY2x1ZGU6IFsncmVhY3QtaWNvbnMnXSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogJzAuMC4wLjAnLFxuICAgIHBvcnQ6IDMwMDAsXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgLi4uZmlsZVBhdGhzLFxuICAgICAgcHJvY2VzczogJ3Byb2Nlc3MvYnJvd3NlcicsXG4gICAgICBwYXRoOiAncGF0aC1icm93c2VyaWZ5JyxcbiAgICAgIG9zOiAnb3MtYnJvd3NlcmlmeScsXG4gICAgICBzdHJlYW06ICdzdHJlYW0tYnJvd3NlcmlmeScsXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgcGx1Z2luczogWyhyb2xsdXBOb2RlUG9seUZpbGwgYXMgYW55KSgpXSxcbiAgICB9LFxuICB9LFxuICBkZWZpbmU6IHtcbiAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVBQX1ZFUlNJT04nOiBKU09OLnN0cmluZ2lmeShjb21taXRIYXNoKSxcbiAgfSxcbiAgLy8gZXNidWlsZDoge1xuICAvLyAgIGRyb3A6IFsnY29uc29sZScsICdkZWJ1Z2dlciddLFxuICAvLyB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdSLFNBQVMsb0JBQW9CO0FBQ3JULE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLFVBQVU7QUFDakIsT0FBTyx3QkFBd0I7QUFDL0IsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyx3QkFBd0I7QUFDakMsWUFBWSxXQUFXO0FBS3ZCLFNBQVMsMEJBQTBCO0FBRm5DLElBQU0sYUFBbUIsZUFBUyxvQkFBb0IsRUFBRSxTQUFTO0FBSWpFLElBQU0sWUFBWTtBQUFBLEVBQ2hCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGO0FBRUEsSUFBTSxZQUFZLFVBQVU7QUFBQSxFQUMxQixDQUFDLGFBQWEscUJBQXFCO0FBQUEsSUFDakMsR0FBRztBQUFBLElBQ0gsQ0FBQyxJQUFJLGVBQWUsRUFBRSxHQUFHLElBQ3ZCLG9CQUFvQixRQUFRLGtCQUFrQixPQUFPLGVBQWUsRUFDdEU7QUFBQSxFQUNGO0FBQUEsRUFDQSxDQUFDO0FBQ0g7QUFHQSxJQUFPLHNCQUFRLGFBQWE7QUFBQTtBQUFBLEVBRTFCLFNBQVM7QUFBQSxJQUNQLGNBQWM7QUFBQSxJQUNkLG1CQUFtQjtBQUFBLElBQ25CLE1BQU07QUFBQSxNQUNKLE9BQU87QUFBQSxRQUNMLFNBQVMsQ0FBQyxvQkFBb0I7QUFBQSxNQUNoQztBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsY0FBYztBQUFBLE1BQ1osU0FBUyxDQUFDLElBQUk7QUFBQTtBQUFBLE1BRWQsU0FBUztBQUFBLFFBQ1AsUUFBUTtBQUFBLFFBQ1IsUUFBUTtBQUFBLFFBQ1IsU0FBUztBQUFBLE1BQ1g7QUFBQTtBQUFBLE1BRUEsaUJBQWlCO0FBQUEsSUFDbkIsQ0FBQztBQUFBLElBQ0QsS0FBSztBQUFBLElBQ0wsaUJBQWlCO0FBQUEsTUFDZixLQUFLO0FBQUEsTUFDTCxTQUFTO0FBQUEsTUFDVCxXQUFXLFFBQVEsSUFBSTtBQUFBLE1BQ3ZCLFlBQVk7QUFBQSxRQUNWLDBCQUEwQixDQUFDLGtCQUFrQjtBQUFBLE1BQy9DO0FBQUEsSUFDRixDQUFDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTUg7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUlBLGNBQWM7QUFBQSxJQUNaLGdCQUFnQjtBQUFBLE1BQ2QsUUFBUSxFQUFFLFFBQVEsYUFBYTtBQUFBLElBQ2pDO0FBQUEsSUFDQSxTQUFTLENBQUMsYUFBYTtBQUFBLEVBQ3pCO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsR0FBRztBQUFBLE1BQ0gsU0FBUztBQUFBLE1BQ1QsTUFBTTtBQUFBLE1BQ04sSUFBSTtBQUFBLE1BQ0osUUFBUTtBQUFBLElBQ1Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUEsSUFDWCxlQUFlO0FBQUEsTUFDYixTQUFTLENBQUUsbUJBQTJCLENBQUM7QUFBQSxJQUN6QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLG9DQUFvQyxLQUFLLFVBQVUsVUFBVTtBQUFBLEVBQy9EO0FBQUE7QUFBQTtBQUFBO0FBSUYsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
