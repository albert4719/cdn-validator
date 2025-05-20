import redis from "../database/redis.js";

export async function submitLimit(key, limit, expire) {
    let count = await redis.incr(key);
    await redis.pexpire(key, Math.ceil(expire * 1000), 'NX')
    return count <= limit;
}