export default {
    app: {
        //监听端口,可通过环境变量PORT覆盖
        port: 3000,
    },
    redis: {
        port: 6379, // Redis port
        host: "127.0.0.1", // Redis host
        // username: "default", // needs Redis >= 6
        password: "",
        db: 0, // Defaults to 0
        keyPrefix: 'cdn-auth'
    },
    limits: {
        //防止爬虫连续自动化访问 (总访问统计,非单一url)
        //默认配置效果: 连续24小时不中断访问，每次访问间隔小于60秒,则封禁一天
        crawler: {
            // 统计周期,默认一天
            totalTime: 86400,
            banTime: 86400,
            //访问间隔
            delay: 60,
        },

        // 无referer访问禁止策略(直接访问) (总访问统计,非单一url)
        // 默认配置效果: 连续对不经过网站引用的所有资源，直接在浏览器进行访问,60秒内超过2000次。封禁ip 5分钟
        direct: {
            // 访问次数
            count: 2000,
            //统计周期
            time: 60,
            //封禁时间
            banTime: 300,
        },

        // 单一资源频率访问限制
        // 默认配置效果: 连续对某一url,60秒内访问超过40次，封禁ip 1分钟
        single: {
            // 访问次数
            count: 40,
            //统计周期
            time: 60,
            //封禁时间
            banTime: 60,
        },

        // 所有资源频率访问限制
        // 默认配置效果: 1小时内总访问次数达到2w,封禁ip 1小时
        total: {
            count: 20000,
            time: 3600,
            banTime: 3600,
        },
    }
}