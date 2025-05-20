import express from "express";


let router = express.Router();

router.use(async function (req, res, next) {
    const headers = req.headers;
    req.remote_addr = req.get('x-forwarded-for')?.split(',')[0] ?? req.ip;
    req.referer = headers['referer'] ?? 'no-referer';
    next();
})

export default router;
