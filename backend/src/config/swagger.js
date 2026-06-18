import swaggerUi from 'swagger-ui-express';
import { authDocs } from '../modules/auth/auth.docs.js';
import { storesDocs } from '../modules/stores/stores.docs.js';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Store Rating Platform API Documentation',
    version: '1.0.0',
    description: 'Production-ready API specifications.'
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local development server'
    }
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
        description: 'HttpOnly cookie containing the Access Token.'
      }
    }
  },
  paths: {
    ...authDocs.paths,
    ...storesDocs.paths
  }
};

export const serveSwagger = swaggerUi.serve;
export const setupSwagger = swaggerUi.setup(swaggerDefinition);

export default swaggerDefinition;
