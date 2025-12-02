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
    CLOUDINARY: {
        CLOUD_NAME: string;
        API_KEY: string;
        API_SECRET: string;
        SECRET: string;
    },
    JWT: {
        ACCESS_TOKEN_SECRET: string,
        ACCESS_TOKEN_EXPIRED: string,
        REFRESH_TOKEN_SECRET: string,
        REFRESH_TOKEN_EXPIRED: string,
    },
    SMTP: {
        SMTP_PASS: string,
        SMTP_USER: string,
        SMTP_HOST: string,
        SMTP_PORT: string,
        SMTP_FROM: string,
    },
    REDIS: {
        REDIS_HOST: string,
        REDIS_PORT: string,
        REDIS_USERNAME: string,
        REDIS_PASSWORD: string,
    }
};

// Load and validate environment variables
const loadEnvVariables = (): IEnvVariables => {

    const requiredEnvVars = [
        'PORT', 'NODE_ENV', 'DB_URL', 'BCRYPT_SALT_ROUNDS', 'SUPER_ADMIN_EMAIL', 'SUPER_ADMIN_PASSWORD', 'SUPER_ADMIN_NAME',
        'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'CLOUDINARY_SECRET', "JWT_ACCESS_TOKEN_SECRET",
        "JWT_ACCESS_TOKEN_EXPIRED",
        "JWT_REFRESH_TOKEN_SECRET",
        "JWT_REFRESH_TOKEN_EXPIRED",
        "SMTP_PASS",
        "SMTP_USER",
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_FROM",
        "REDIS_HOST",
        "REDIS_PORT",
        "REDIS_USERNAME",
        "REDIS_PASSWORD"
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
        CLOUDINARY: {
            CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
            API_KEY: process.env.CLOUDINARY_API_KEY as string,
            API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
            SECRET: process.env.CLOUDINARY_SECRET as string,
        },
        JWT: {
            ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET as string,
            ACCESS_TOKEN_EXPIRED: process.env.JWT_ACCESS_TOKEN_EXPIRED as string,
            REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET as string,
            REFRESH_TOKEN_EXPIRED: process.env.JWT_REFRESH_TOKEN_EXPIRED as string,
        },
        SMTP: {
            SMTP_PASS: process.env.SMTP_PASS as string,
            SMTP_USER: process.env.SMTP_USER as string,
            SMTP_HOST: process.env.SMTP_HOST as string,
            SMTP_PORT: process.env.SMTP_PORT as string,
            SMTP_FROM: process.env.SMTP_FROM as string,
        },
        REDIS: {
            REDIS_HOST: process.env.REDIS_HOST as string,
            REDIS_PORT: process.env.REDIS_PORT as string,
            REDIS_USERNAME: process.env.REDIS_USERNAME as string,
            REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
        }
    };
};

export const envVars = loadEnvVariables();