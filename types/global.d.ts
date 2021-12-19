declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PUBLIC_URL: string;
    readonly TOKYO_42_USERNAME: string | null | undefined;
    readonly TOKYO_42_PASSWORD: string | null | undefined;
    readonly DISCORD_EMAIL: string | null | undefined;
    readonly DISCORD_PASSWORD: string | null | undefined;
  }
}
