import config from "../../config.js";
import {logError, logInfo} from "../utils/LogUtil.js";
import Redis from "ioredis";

const client = new Redis(config.redis);


client.on('error', (err) => logError('Redis Client Error', err));

client.on('connect', () => logInfo('Redis数据库连接成功!'));

export default client;