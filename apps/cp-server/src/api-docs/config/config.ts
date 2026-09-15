import path, { resolve } from "path";
import swaggerJsDoc from "swagger-jsdoc";
import { webAppSchemas } from "./schemas";
import { getKeys } from "@/config/keys";

const docsConfig = {
  webAppDocsConfig: swaggerJsDoc({
    swaggerDefinition: {
      openapi: "3.0.0",
      servers: [{ url: `${getKeys().host}/web-app` }],
      info: {
        title: "Api docs for ThriftPool account portal",
        description: `Base Url: ${getKeys().host}/web-app`,
        contact: { name: "ThriftPool Suite dev team", email: "dev@thriftpool.com" },
        version: "1.0.0",
      },
      components: {
        schemas: webAppSchemas,
        securitySchemes: {
          AuthToken: {
            type: "apiKey",
            in: "header",
            name: "atk",
          },
          RefreshToken: {
            type: "apiKey",
            in: "cookie",
            name: "rtk",
          },
          CommunityKey: {
            type: "apiKey",
            in: "header",
            name: "community-key",
          },
        },
      },
      security: [],
    },

    apis: [path.join(__dirname, "../docs/web-app/*.ts"), resolve(__dirname, "./web-app/****.ts")],
  }),
};

export default docsConfig;
