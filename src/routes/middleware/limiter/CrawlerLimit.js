//限制爬虫访问,如果连续24小时持续访问且每次访问间隔小于1分钟
//则封禁1天
import redis from "../../../database/redis.js";

import {Ban} from "../../../utils/BanUtil.js";
import express from "express";
import config from "../../../../config.js";

let router = express.Router();

router.use(async function (req, res, next) {
    const remote_addr = req.remote_addr;

    let totalTimeKey = `${config.redis.keyPrefix}:crawler:${remote_addr}:totalTime`

    let timeKey = `${config.redis.keyPrefix}:crawler:${remote_addr}:time`

    let currentTimeStamp = Date.now() / 1000;

    let time = +await redis.get(timeKey) || currentTimeStamp;

    let passed = currentTimeStamp - time;

    let totalTime = +await redis.get(totalTimeKey) ?? 0;

    totalTime = totalTime + passed;

    //超过24小时连续访问且间隔小于1分钟封禁1天
    const crawlerLimits = config.limits.crawler;
    if (totalTime > crawlerLimits.totalTime) {
        return Ban(req, res, crawlerLimits.banTime, `crawler-${req.uri}`);
    }

    if (passed < crawlerLimits.delay) {
        //增加总访问时间,60秒过期
        await redis.setex(totalTimeKey, crawlerLimits.delay, totalTime.toString());
    }

    await redis.setex(timeKey, crawlerLimits.delay, currentTimeStamp.toString());

    next();
})

export default router;