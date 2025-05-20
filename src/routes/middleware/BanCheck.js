import redis from "../../database/redis.js";
import {logWarn} from "../../utils/LogUtil.js";
import {getIPLoc} from "../../utils/IPUtil.js";
import express from "express";
import config from "../../../config.js";

let router = express.Router();

router.use(async function (req, res, next) {
    let {remote_addr, referer} = req;
    req.blockKey = `${config.redis.keyPrefix}:block:${remote_addr}`
    const origin = req.get('host')
    if (await redis.exists(req.blockKey)) {
        logWarn(`[拒绝访问] ${remote_addr}(${getIPLoc(remote_addr)}) ${origin + req.path} ${referer}`)
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