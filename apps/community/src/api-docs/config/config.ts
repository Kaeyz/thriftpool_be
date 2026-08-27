import path, { resolve } from "path";
import swaggerJsDoc from "swagger-jsdoc";
import { getKeys } from "@/config/keys";
import { serverApiSchemas, webAppApiSchemas } from "@/registries/api-schemas";

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
        schemas: webAppApiSchemas,
        securitySchemes: {
          DeviceId: {
            type: "apiKey",
            in: "header",
            name: "dv-id",
          },
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
        },
      },
      security: [],
    },

    apis: [path.join(__dirname, "../docs/web-app/*.ts"), resolve(__dirname, "./web-app/****.ts")],
  }),
  serverApiDocsConfig: swaggerJsDoc({
    swaggerDefinition: {
      openapi: "3.0.0",
      servers: [{ url: `${getKeys().host}/server-api` }],
      info: {
        title: "Api docs for Thriftpool account server-apis",
        description: `Base Url: ${getKeys().host}/server-api`,
        contact: { name: "Thriftpool Suite dev team", email: "dev@thriftpool.com" },
        version: "1.0.0",
      },
      components: {
        schemas: serverApiSchemas,
      },
      security: [],
    },

    apis: [path.join(__dirname, "../docs/server-api/*.ts"), resolve(__dirname, "./server-api/****.ts")],
  }),
};

export default docsConfig;
