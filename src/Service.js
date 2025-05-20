import express from "express";
import cluster from "cluster";
//检查爬虫限制
import {logError} from "./utils/LogUtil.js";
import SkyRoutes from "./routes/SkyRoutes.js";

const app = express();

app.disable('x-powered-by');

app.use(function (req, res, next) {
    // logInfo(req.path)
    res.header('Cluster-ID', 'A-' + cluster?.worker?.id);
    next()
});

app.use(SkyRoutes)

app.use(function (err, req, res, next) {
    let errStr = err?.stack ?? JSON.stringify(err ?? {});
    if (errStr === '{}') {
        errStr = err;
    }
    logError(errStr);
    res?.status(500).send('An error occurred!');
});

export default app;