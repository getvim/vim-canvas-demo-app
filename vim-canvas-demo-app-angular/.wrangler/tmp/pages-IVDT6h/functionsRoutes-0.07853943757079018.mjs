import { onRequestGet as __api_launch_ts_onRequestGet } from "/Users/ryanhoffman/projects/vim-canvas-demo-app/vim-canvas-demo-app-angular/functions/api/launch.ts"
import { onRequestGet as __api_settings_ts_onRequestGet } from "/Users/ryanhoffman/projects/vim-canvas-demo-app/vim-canvas-demo-app-angular/functions/api/settings.ts"
import { onRequestPost as __api_settings_ts_onRequestPost } from "/Users/ryanhoffman/projects/vim-canvas-demo-app/vim-canvas-demo-app-angular/functions/api/settings.ts"
import { onRequestPost as __api_token_ts_onRequestPost } from "/Users/ryanhoffman/projects/vim-canvas-demo-app/vim-canvas-demo-app-angular/functions/api/token.ts"

export const routes = [
    {
      routePath: "/api/launch",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_launch_ts_onRequestGet],
    },
  {
      routePath: "/api/settings",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_settings_ts_onRequestGet],
    },
  {
      routePath: "/api/settings",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_settings_ts_onRequestPost],
    },
  {
      routePath: "/api/token",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_token_ts_onRequestPost],
    },
  ]