export interface Env {
  REDIRECT_URL: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  VIM_TOKEN_ENDPOINT?: string;
  VIM_AUTHORIZE_ENDPOINT?: string;
  VIM_ISSUER?: string;
  CLIENT_SECRET_FALLBACK?: string;
}
