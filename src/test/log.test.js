const Log = require('../modules/log.js');

const log = new Log();
log
    .set_message("Hola")
    .set_type("info")
    .set_prefix("🔍")
    .set_filepath("./.logs/test.log")
    .run();