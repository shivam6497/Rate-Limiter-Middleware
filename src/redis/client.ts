import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis({
    host: "127.0.0.1",
    port: 6379,
});

redis.on("connect", () => {
    console.log("Redis connnected successfully");
});

redis.on("error", (err) => {
    console.error("Redis connection error:", err);
});

export default redis;