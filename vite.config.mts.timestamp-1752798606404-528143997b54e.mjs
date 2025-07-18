// vite.config.mts
import { defineConfig } from "file:///d:/vnpt/canlua/canlua-zalominiapp/node_modules/vite/dist/node/index.js";
import zaloMiniApp from "file:///d:/vnpt/canlua/canlua-zalominiapp/node_modules/zmp-vite-plugin/dist/index.mjs";
import react from "file:///d:/vnpt/canlua/canlua-zalominiapp/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tsconfigPaths from "file:///d:/vnpt/canlua/canlua-zalominiapp/node_modules/vite-tsconfig-paths/dist/index.mjs";
import { fileURLToPath } from "url";
import path from "path";
var __vite_injected_original_import_meta_url = "file:///d:/vnpt/canlua/canlua-zalominiapp/vite.config.mts";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = path.dirname(__filename);
var vite_config_default = () => {
  return defineConfig({
    root: "./src",
    base: "",
    plugins: [zaloMiniApp(), react(), tsconfigPaths()],
    resolve: {
      alias: {
        css: path.resolve(__dirname, "src/css"),
        components: path.resolve(__dirname, "src/components"),
        pages: path.resolve(__dirname, "src/pages"),
        store: path.resolve(__dirname, "src/store"),
        services: path.resolve(__dirname, "src/services"),
        assets: path.resolve(__dirname, "src/assets"),
        apiRequest: path.resolve(__dirname, "src/apiRequest"),
        utils: path.resolve(__dirname, "src/utils"),
        constants: path.resolve(__dirname, "src/constants"),
        envConfig: path.resolve(__dirname, "src/envConfig")
      }
    },
    server: {
      proxy: {
        "/api": {
          target: "https://qlkhupho.vnpt.me",
          changeOrigin: true,
          secure: false
        }
      }
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiZDpcXFxcdm5wdFxcXFxjYW5sdWFcXFxcY2FubHVhLXphbG9taW5pYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJkOlxcXFx2bnB0XFxcXGNhbmx1YVxcXFxjYW5sdWEtemFsb21pbmlhcHBcXFxcdml0ZS5jb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9kOi92bnB0L2Nhbmx1YS9jYW5sdWEtemFsb21pbmlhcHAvdml0ZS5jb25maWcubXRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB6YWxvTWluaUFwcCBmcm9tIFwiem1wLXZpdGUtcGx1Z2luXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cblxuY29uc3QgX19maWxlbmFtZSA9IGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKTtcbmNvbnN0IF9fZGlybmFtZSA9IHBhdGguZGlybmFtZShfX2ZpbGVuYW1lKTtcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4ge1xuICByZXR1cm4gZGVmaW5lQ29uZmlnKHtcbiAgICByb290OiBcIi4vc3JjXCIsXG4gICAgYmFzZTogXCJcIixcbiAgICBwbHVnaW5zOiBbemFsb01pbmlBcHAoKSwgcmVhY3QoKSwgdHNjb25maWdQYXRocygpXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICBjc3M6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvY3NzJyksXG4gICAgICAgIGNvbXBvbmVudHM6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvY29tcG9uZW50cycpLFxuICAgICAgICBwYWdlczogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9wYWdlcycpLFxuICAgICAgICBzdG9yZTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9zdG9yZScpLFxuICAgICAgICBzZXJ2aWNlczogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9zZXJ2aWNlcycpLFxuICAgICAgICBhc3NldHM6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvYXNzZXRzJyksXG4gICAgICAgIGFwaVJlcXVlc3Q6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvYXBpUmVxdWVzdCcpLFxuICAgICAgICB1dGlsczogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy91dGlscycpLFxuICAgICAgICBjb25zdGFudHM6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvY29uc3RhbnRzJyksXG4gICAgICAgIGVudkNvbmZpZzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9lbnZDb25maWcnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHByb3h5OiB7XG4gICAgICAgIFwiL2FwaVwiOiB7XG4gICAgICAgICAgdGFyZ2V0OiBcImh0dHBzOi8vcWxraHVwaG8udm5wdC5tZVwiLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgIH0sXG4gIH0pO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1IsU0FBUyxvQkFBb0I7QUFDNVQsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sVUFBVTtBQUxpSyxJQUFNLDJDQUEyQztBQVNuTyxJQUFNLGFBQWEsY0FBYyx3Q0FBZTtBQUNoRCxJQUFNLFlBQVksS0FBSyxRQUFRLFVBQVU7QUFFekMsSUFBTyxzQkFBUSxNQUFNO0FBQ25CLFNBQU8sYUFBYTtBQUFBLElBQ2xCLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFNBQVMsQ0FBQyxZQUFZLEdBQUcsTUFBTSxHQUFHLGNBQWMsQ0FBQztBQUFBLElBQ2pELFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLFdBQVcsU0FBUztBQUFBLFFBQ3RDLFlBQVksS0FBSyxRQUFRLFdBQVcsZ0JBQWdCO0FBQUEsUUFDcEQsT0FBTyxLQUFLLFFBQVEsV0FBVyxXQUFXO0FBQUEsUUFDMUMsT0FBTyxLQUFLLFFBQVEsV0FBVyxXQUFXO0FBQUEsUUFDMUMsVUFBVSxLQUFLLFFBQVEsV0FBVyxjQUFjO0FBQUEsUUFDaEQsUUFBUSxLQUFLLFFBQVEsV0FBVyxZQUFZO0FBQUEsUUFDNUMsWUFBWSxLQUFLLFFBQVEsV0FBVyxnQkFBZ0I7QUFBQSxRQUNwRCxPQUFPLEtBQUssUUFBUSxXQUFXLFdBQVc7QUFBQSxRQUMxQyxXQUFXLEtBQUssUUFBUSxXQUFXLGVBQWU7QUFBQSxRQUNsRCxXQUFXLEtBQUssUUFBUSxXQUFXLGVBQWU7QUFBQSxNQUNwRDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxVQUNOLFFBQVE7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLFFBQVE7QUFBQSxRQUNWO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFtdCn0K
