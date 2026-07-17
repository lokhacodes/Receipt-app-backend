declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    CLIENT_ORIGIN?: string;
    JWT_SECRET?: string;
    ACCESS_TOKEN_SECRET?: string;
    REFRESH_TOKEN_SECRET?: string;
    SUPABASE_DB_URL?: string;
    USERS_TABLE?: string;
  }
}

