import type { AppEnv } from "@packages/core/types";

interface keysInterface {
  port: string;
  appEnv: AppEnv;
  host: string;
  mongoUri: string;
  redisUrl: string;
  secretKey: string;
  serverUsername: string;
  serverPassword: string;
  discord: {
    key: string;
    guildName: string;
  };
  resendApiKey: string;
  resendFrom: string;
  cloudinaryKeys: {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  };
}

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env variable ${key}`);
  return value;
};

export const getKeys = (): keysInterface => {
  const env = process.env;
  const appEnv = env.APP_ENV as AppEnv;
  const appEnvOptions: AppEnv[] = ["prod", "test", "dev"];

  if (appEnv && !appEnvOptions.includes(appEnv)) {
    throw new Error(`APP_ENV must be one of ${appEnvOptions.join(", ")}`);
  }

  return {
    port: getEnv("PORT"),
    host: getEnv("HOST"),
    appEnv: getEnv("APP_ENV") as AppEnv,
    mongoUri: getEnv("MONGO_URI"),
    redisUrl: getEnv("REDIS_URL"),
    secretKey: getEnv("SECRET_KEY"),
    serverUsername: getEnv("SERVER_USERNAME"),
    serverPassword: getEnv("SERVER_PASSWORD"),
    discord: {
      key: getEnv("DISCORD_KEY"),
      guildName: getEnv("DISCORD_GUILD_NAME"),
    },
    resendApiKey: getEnv("RESEND_API_KEY"),
    resendFrom: getEnv("RESEND_FROM"),
    cloudinaryKeys: {
      cloud_name: getEnv("CLOUDINARY_CLOUD_NAME"),
      api_key: getEnv("CLOUDINARY_API_KEY"),
      api_secret: getEnv("CLOUDINARY_API_SECRET"),
    },
  };
};
