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
- Avance de funcionalidad extra: *A definir

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

## Estructura del Proyecto (Arquitectura)

El proyecto fue organizado siguiendo una arquitectura modular por capas, utilizando **ES Modules** (`import / export`) para mantener el código ordenado, reutilizable y escalable.

```bash
/src
 ├── controllers
 ├── db
 ├── middlewares
 ├── models
 ├── routes
 ├── scripts
 └── services