//1小时内最多访问1w次OSS文件
import {Ban} from "../../../utils/BanUtil.js";
import {submitLimit} from "../../../utils/CommonUtil.js";
import config from "../../../../config.js";
import express from "express";

let router = express.Router();

router.use(async function (req, res, next) {
    const remote_addr = req.remote_addr;
    const limit = config.limits.total
    let key = `${config.redis.keyPrefix}:total:${remote_addr}`
    if (!(await submitLimit(key, limit.count, limit.time))) {
        return Ban(req, res, limit.banTime, `limit_total:${req.path}`);
    }
    next()
})

export default router;
