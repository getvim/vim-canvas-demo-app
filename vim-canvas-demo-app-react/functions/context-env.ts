// Environment variables for Cloudflare Functions
export interface Env {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT_URL: string;
  SCRIBEAI_API_KEY?: string;
  VIM_TOKEN_ENDPOINT?: string;
  VIM_AUTHORIZE_ENDPOINT?: string;
  VIM_ISSUER?: string;
  CLIENT_SECRET_FALLBACK?: string;
}

// Export environment variables for use in functions
export const getEnv = (env: Env) => ({
  CLIENT_ID: env.CLIENT_ID,
  CLIENT_SECRET: env.CLIENT_SECRET,
  REDIRECT_URL: env.REDIRECT_URL || 'http://localhost:8788',
  SCRIBEAI_API_KEY: env.SCRIBEAI_API_KEY,
  VIM_TOKEN_ENDPOINT: env.VIM_TOKEN_ENDPOINT,
  VIM_AUTHORIZE_ENDPOINT: env.VIM_AUTHORIZE_ENDPOINT,
  VIM_ISSUER: env.VIM_ISSUER,
  CLIENT_SECRET_FALLBACK: env.CLIENT_SECRET_FALLBACK
});
