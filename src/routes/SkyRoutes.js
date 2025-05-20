import express from "express";
import ReqParser from "./middleware/ReqParser.js";
import BanCheck from "./middleware/BanCheck.js";
import directLimit from "./middleware/limiter/DirectLimit.js";
import TotalLimit from "./middleware/limiter/TotalLimit.js";
import SingleLimit from "./middleware/limiter/SingleLimit.js";
import crawlerLimit from "./middleware/limiter/CrawlerLimit.js";
import {logInfo} from "../utils/LogUtil.js";
import {getIPLoc} from "../utils/IPUtil.js";

let router = express.Router();

//初始化变量
router.use(ReqParser)

//如果被封禁直接拒绝访问
router.use(BanCheck);

//检查referer限制
router.use(directLimit);

//检查总访问量限制
router.use(TotalLimit);

//单文件限制
router.use(SingleLimit);

router.use(crawlerLimit);

//最终返回200,允许访问资源
router.use(function (req, res, next) {
    let origin = req.get('host')
    logInfo(`[接收访问] ${req.remote_addr}(${getIPLoc(req.remote_addr)}) ${origin + req.path} ${req.referer}`);
    return res.status(200).send('');
})


export default router;