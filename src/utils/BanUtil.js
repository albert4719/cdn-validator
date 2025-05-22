import redis from "../database/redis.js";
import logC from "./LogUtil.js";
import config from "../../config.js";

export async function Ban(req, res, time, reason) {

    const blockKey = req.blockKey;

    await redis.setex(blockKey, time, reason);

    let banCountKey = `:banCount:${req.remote_addr}`;
    let banCount = await redis.incr(banCountKey);
    const banLimit = config.limits.ban
    if (await redis.ttl(banCountKey) < 0) {
        await redis.expire(banCountKey, 86400);
    }
    if (banCount > banLimit.totalCount) {
        time = banLimit.banTime;
        reason = `banCount:${banCount}`;
        await redis.setex(blockKey, time, reason);
    }

    logC('red', '[Ban] 已封禁IP', req.remote_addr, '封禁原因', reason, '封禁时长', time);

    return res.status(403).send('');
}