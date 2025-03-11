// Environment variables for Cloudflare Functions
export interface Env {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT_URL: string;
  SCRIBEAI_API_KEY?: string;
}

// Export environment variables for use in functions
export const getEnv = (env: Env) => ({
  CLIENT_ID: env.CLIENT_ID,
  CLIENT_SECRET: env.CLIENT_SECRET,
  REDIRECT_URL: env.REDIRECT_URL || 'http://localhost:8788',
  SCRIBEAI_API_KEY: env.SCRIBEAI_API_KEY
});
