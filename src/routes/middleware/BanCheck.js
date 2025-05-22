import redis from "../../database/redis.js";
import {logWarn} from "../../utils/LogUtil.js";
import {getIPLoc} from "../../utils/IPUtil.js";
import express from "express";
import config from "../../../config.js";

let router = express.Router();

router.use(async function (req, res, next) {
    let {remote_addr, referer} = req;
    req.blockKey = `:block:${remote_addr}`
    const origin = req.get('host')
    const ttl = await redis.ttl(req.blockKey)
    if (ttl > -1) {
        const inc = config.limits.ban.banIncr
        if (inc > 0) {
            await redis.expire(req.blockKey, ttl + inc)
        }
        logWarn(`[拒绝访问] ${remote_addr}(${getIPLoc(remote_addr)}) ${origin + req.path} ${referer} +${inc}封禁时间: ${ttl}`)
        return res.status(403).send('');
    }
    const uri = req.path;
    if (await redis.exists(`block-image:${uri}`)) {
        logWarn(`[拒绝访问(ban)] ${remote_addr}(${getIPLoc(remote_addr)}) ${origin + req.path} ${referer}`)
        return res.status(403).send('');
    }
    next();
})

export default router;