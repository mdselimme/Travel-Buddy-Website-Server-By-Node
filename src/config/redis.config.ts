import { createClient } from 'redis'
import { envVars } from './envVariable.config'

//Configure redis
export const redisClient = createClient({
    username: envVars.REDIS.REDIS_USERNAME,
    password: envVars.REDIS.REDIS_PASSWORD,
    socket: {
        host: envVars.REDIS.REDIS_HOST,
        port: Number(envVars.REDIS.REDIS_PORT)
    }
});

redisClient.on("error", (error) => {
    console.log('Redis Error: ', error);
});

//redis connected
export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log("Redis Connected.")
    }
};