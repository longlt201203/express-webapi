import { config } from 'dotenv';

const ENV = process.env.NODE_ENV || 'development';

switch (ENV) {
    case 'development':
        config({ path: '.env.dev' });
        break;
    case 'production':
        config({ path: '.env.prod' });
        break;
    case 'staging':
        config({ path: '.env.staging' });
        break;
}

export default class Globals {
    // Application Env
    static readonly APP_PORT = parseInt(process.env.APP_PORT || '3000');
    
    // Database Env
    static readonly DB_HOST = process.env.DB_HOST || 'localhost';
    static readonly DB_PORT = parseInt(process.env.DB_PORT || '3306');
    static readonly DB_USER = process.env.DB_USER || 'root';
    static readonly DB_PASS = process.env.DB_PASS || 'root';
    static readonly DB_NAME = process.env.DB_NAME || 'test';

    // Swagger
    static readonly SWAGGER_DOCS_PATH = process.env.SWAGGER_DOCS_PATH || '/swagger';

    // Upload
    static readonly UPLOAD_FOLDER_DEFAULT_PATH = process.env.UPLOAD_FOLDER_DEFAULT_PATH || 'upload';

    // Your Global Variables
}