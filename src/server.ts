'use strict';

const app = require("./index");

require("greenlock-express").init({
    packageRoot: __dirname,
    configDir: "../greenlock.d",
    maintainerEmail: "gironjim@gmail.com",
    cluster: false,
}).serve(app);