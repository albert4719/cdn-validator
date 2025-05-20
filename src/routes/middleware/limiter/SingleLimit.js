//单个文件1分钟内最多访问20次

import {Ban} from "../../../utils/BanUtil.js";
import {submitLimit} from "../../../utils/CommonUtil.js";
import config from "../../../../config.js";
import express from "express";

let router = express.Router();

router.use(async function (req, res, next) {
    const remote_addr = req.remote_addr;
    const uri = req.path;
    const limit = config.limits.single
    let key = `${config.redis.keyPrefix}:single-limit:${req.get('host')}:${remote_addr}:${uri}`
    if (!(await submitLimit(key, limit.count, limit.time))) {
        return Ban(req, res, limit.banTime, `limit_single:${req.path}`);
    }
    next();
})

export default router;
