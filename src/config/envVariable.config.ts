import dotenv from 'dotenv';
dotenv.config();

interface IEnvVariables {
    PORT: string;
    NODE_ENV: 'development' | 'production' | 'test';
    DB_URL: string;
    BCRYPT_SALT_ROUNDS: string;
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_PASSWORD: string;
    SUPER_ADMIN_NAME: string;
};

// Load and validate environment variables
const loadEnvVariables = (): IEnvVariables => {

    const requiredEnvVars = [
        'PORT', 'NODE_ENV', 'DB_URL', 'BCRYPT_SALT_ROUNDS', 'SUPER_ADMIN_EMAIL', 'SUPER_ADMIN_PASSWORD', 'SUPER_ADMIN_NAME'
    ];

    requiredEnvVars.forEach((varName) => {
        if (!process.env[varName]) {
            throw new Error(`Environment variable ${varName} is not set. Please define it in the .env file.`);
        }
    });

    return {
        PORT: process.env.PORT as string,
        NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
        DB_URL: process.env.DB_URL as string,
        BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
        SUPER_ADMIN_NAME: process.env.SUPER_ADMIN_NAME as string,
    };
};

export const envVars = loadEnvVariables();