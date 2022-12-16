'use strict';

const app = require("./index");

require("greenlock-express").init({
    packageRoot: __dirname,
    configDir: "../greenlock.d",
    cluster: false,
}).serve(app);