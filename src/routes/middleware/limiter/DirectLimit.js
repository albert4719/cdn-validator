import {Ban} from "../../../utils/BanUtil.js";
import {submitLimit} from "../../../utils/CommonUtil.js";
import config from "../../../../config.js";
import express from "express";

//单个IP每分钟最多发送120次无referer请求(所有文件)

let router = express.Router();

router.use(async function (req, res, next) {
    const remote_addr = req.remote_addr;
    const referer = req.referer;
    const limits = config.limits.direct
    if (referer === 'no-referer') {
        let key = `${config.redis.keyPrefix}:no-referer:${remote_addr}`
        if (!(await submitLimit(key, limits.count, limits.time))) {
            return Ban(req, res, limits.banTime, `limit_direct:${req.path}`);
        }
    }
    next();
})

export default router;