# tfi2026-programacion3-grupoM
TFI Grupo M - Materia Programación III
Tecnicatura en Desarrollo Web - FCAD UNER 2026

**Integrantes:** Beceiro Joel, Chisté Sandra, Mamberti Victoria Belén, Perez Martin y Sanchez Miriam.

---

## Descripción del Proyecto
Este sistema fue desarrollado con **Node.js**, **Express** y **MySQL**.

La aplicación contempla distintos roles dentro de una clínica médica:

- Administrador
- Médico
- Paciente

En esta **primera entrega** se incluye:

- BREAD funcional de la entidad **Especialidades**

## Tecnologías y Librerías Utilizadas
*   **Backend:** Node.js, Express.
*   **Base de Datos:** MySQL.
*   **Seguridad:** JSON Web Tokens (JWT) para autenticación y autorización por roles.
*   **Middlewares:** Multer (carga de archivos), Morgan (registro de solicitudes), Express-Validator (validación de datos), CORS.
*   **Documentación:** Swagger.

## Funcionalidad Extra
*A definir.

## Requisitos Previos
Antes de ejecutar el proyecto, se requiere:

- Node.js instalado
- MySQL en ejecución
- phpMyAdmin, XAMPP, o similar
- Cliente API (Postman, Bruno, etc.)

## Conexión Base de Datos
1. Crear la base de datos oficial del proyecto
CREATE DATABASE prog3_turnos;

2. Crear un usuario específico para la aplicación (reemplazar 'tu_contraseña' por la que desees)
CREATE USER 'usuario_tfi'@'localhost' (o db-host) IDENTIFIED BY 'tu_contraseña';

3. Otorgar solo los privilegios necesarios (leer, insertar y modificar)
GRANT SELECT, INSERT, UPDATE ON prog3_turnos.* TO 'usuario_tfi'@'localhost';

4. Refrescar los privilegios para aplicar los cambios
FLUSH PRIVILEGES;

5. Importar el archivo SQL de la cátedra.

## Instalación y Ejecución

1. Clonar el repositorio.
2. Instalar las dependencias del proyecto:
   \`\`\`bash
   npm install
   \`\`\`
3. Configurar las variables de entorno (ver sección correspondiente).
4. Ejecutar el proyecto utilizando alguno de los siguientes scripts:

**Scripts disponibles:**
- \`npm start\`: Inicia el servidor en modo producción (`node index.js`).
- \`npm run dev\`: Inicia el servidor en modo desarrollo con reinicio automático (`node --watch index.js`).
- \`npm run test-db\`: Ejecuta una prueba de conexión a la base de datos.
- \`npm run test-models\`: Ejecuta pruebas sobre los modelos.

## Configuración de Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example` o agrega las siguientes variables:

PORT=3000
DB_HOST=localhost
DB_USER=usuario_tfi
DB_PASS=tu_contraseña
DB_NAME=prog3_turnos

# Seguridad JWT
SECRET_KEY=tu_clave_secreta

## Documentación de la API (Swagger)
La API está documentada utilizando Swagger. Una vez que el servidor esté en ejecución, puedes acceder a la interfaz gráfica de la documentación ingresando a:
👉 `http://localhost:3000/api-docs`

## Estructura del Proyecto (Arquitectura)

El proyecto fue organizado siguiendo una arquitectura modular por capas, utilizando **ES Modules** (`import / export`) para mantener el código ordenado, reutilizable y escalable.

```bash
/src
 ├── controllers
 ├── db
 ├── docs
 ├── middlewares
 ├── models
 ├── routes
 ├── scripts
 └── services