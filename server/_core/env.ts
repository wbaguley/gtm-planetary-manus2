const DEV_FALLBACK_SECRET = "dev-only-jwt-secret-do-not-use-in-production";

const jwtSecret = process.env.JWT_SECRET;
const isProduction = process.env.NODE_ENV === "production";

if (!jwtSecret || jwtSecret.length < 32) {
  if (isProduction) {
    console.error(
      "[FATAL] JWT_SECRET is missing or too short (min 32 chars). Refusing to start in production."
    );
    process.exit(1);
  } else {
    console.warn(
      "[WARN] JWT_SECRET is missing or too short. Using dev-only fallback. Do NOT use this in production."
    );
  }
}

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: jwtSecret && jwtSecret.length >= 32 ? jwtSecret : DEV_FALLBACK_SECRET,
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction,
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};
