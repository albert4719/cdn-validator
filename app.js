import 'use-strict'
import app from "./src/Service.js";
import {logInfo} from "./src/utils/LogUtil.js";
import config from "./config.js";

const port = process.env.PORT || config.app.port;

app.listen(port, () => logInfo(`Server started on port ${port}`));
