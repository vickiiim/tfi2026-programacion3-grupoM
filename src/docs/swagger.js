import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API TFI Programación III - Grupo M',
      version: '1.0.0',
      description: 'Documentación de la API para el Trabajo Final Integrador. Incluye la gestión de especialidades, usuarios y turnos.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
  },
  // Aquí le decimos a Swagger dónde buscar los comentarios para documentar
  apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('✅ Documentación disponible en http://localhost:3000/api-docs');
};