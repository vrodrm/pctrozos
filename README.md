# pctrozos - Configurador de PCs

Este es un proyecto educativo desarrollado para la asignatura de **Programación de Aplicaciones Utilizando Frameworks** de 2º de DAW. Consiste en una aplicación web que permite a los usuarios registrarse, iniciar sesión y crear configuraciones personalizadas de componentes de PC (builds).

## Características principales

- **Autenticación de Usuarios:** Registro e inicio de sesión utilizando JWT (JSON Web Tokens) y almacenamiento seguro de contraseñas con bcrypt.
- **Configurador de PC:** Interfaz para seleccionar componentes por categorías (CPU, Placa Base, RAM, GPU, etc.).
- **Gestión de Builds:** Los usuarios autenticados pueden guardar sus configuraciones y verlas en su perfil.
- **API de Piezas:** Implementación de una API interna para la búsqueda y filtrado de componentes de PC.
- **Motor de Plantillas:** Uso de Pug para la generación dinámica de vistas en el servidor.

## Tecnologías Utilizadas

- **Backend:** [Node.js](https://nodejs.org/) con [Express](https://expressjs.com/).
- **Base de Datos:** [MySQL](https://www.mysql.com/) gestionado a través del ORM [Sequelize](https://sequelize.org/).
- **Vistas:** [Pug](https://pugjs.org/) para el renderizado del lado del servidor.
- **Estilos:** CSS (incluido en la carpeta `public`).
- **Seguridad:** [bcrypt](https://www.npmjs.com/package/bcrypt) para hashing y [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) para sesiones.

## Requisitos Previos

- [Node.js](https://nodejs.org/) (versión v16 o superior recomendada).
- [MySQL](https://www.mysql.com/) funcionando localmente o en un servidor.

## Instalación y Configuración

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/vrodrm/pctrozos.git
    cd pctrozos
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:
    ```env
    PORT=3000
    DB_DATABASE=tu_base_de_datos
    DB_USERNAME=tu_usuario
    DB_PASSWORD=tu_password
    DB_HOST=localhost
    JWT_SECRET=tu_clave_secreta_super_segura
    ```

4.  **Iniciar la aplicación:**
    - Modo desarrollo (con nodemon):
      ```bash
      npm run dev
      ```
    - Modo producción:
      ```bash
      node index.js
      ```

## Estructura del Proyecto

- `config/`: Configuración de la base de datos.
- `controllers/`: Lógica de control para usuarios y configuraciones de PC.
- `models/`: Definición de modelos de datos (Usuario, Pieza, Build) usando Sequelize.
- `public/`: Archivos estáticos (imágenes, CSS, JavaScript del cliente).
- `routes/`: Definición de rutas de la aplicación.
- `validators/`: Validaciones para las entradas del usuario.
- `views/`: Plantillas Pug para las diferentes páginas.
- `index.js`: Punto de entrada de la aplicación.

## Autor

- **Vicente Rodríguez** - [GitHub](https://github.com/vrodrm)
