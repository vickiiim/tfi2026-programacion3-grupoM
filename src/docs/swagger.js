import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API TFI Programación III - Grupo M',
      version: '1.0.0',
      description: 'Documentación de la API para el Trabajo Final Integrador. Incluye la gestión de especialidades, usuarios, médicos, pacientes, obras sociales, turnos y reportes.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Autenticación',
        description: 'Endpoints de login y autenticación',
      },
      {
        name: 'Especialidades',
        description: 'CRUD de especialidades médicas',
      },
      {
        name: 'Usuarios',
        description: 'Gestión de usuarios del sistema',
      },
      {
        name: 'Médicos',
        description: 'Gestión de perfiles de médicos',
      },
      {
        name: 'Pacientes',
        description: 'Gestión de perfiles de pacientes',
      },
      {
        name: 'Obras Sociales',
        description: 'CRUD de obras sociales',
      },
      {
        name: 'Turnos',
        description: 'Gestión de turnos y reservas',
      },
      {
        name: 'Reportes',
        description: 'Generación de reportes y estadísticas',
      },
    ],
  },
  apis: ['./src/routes/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'TFI Grupo M - API Docs',
  }));
  console.log('Documentación disponible en http://localhost:3000/api-docs');
};