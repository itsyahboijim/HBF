'use strict';

import websiteConfig from './config/websiteConfig';

import apiRoute from './routes/apiRoute';
import interfaceRoute from './routes/interfaceRoute';

import {Request, Response} from 'express';
import express = require('express');
import { parseCookies } from './middleware/parseCookies';

const ejs = require('ejs');
const app = express();
const path = require('path');

app.engine("html", ejs.renderFile);
app.set("view engine", "ejs");

app.use(parseCookies);
app.use(express.json({limit: "50mb"}));
app.use(express.static(path.join(__dirname + "/../public")));

const routes = {
    "/api" : apiRoute,
    "/interface" : interfaceRoute,
};
for (const key of Object.keys(routes)){
    app.use(key, routes[key as keyof typeof routes]);
}

app.get('/', (req: Request, res: Response) => {
    res.redirect('/interface/hospitalFeed');
});

module.exports = app;

if (require.main === module){
    const port = websiteConfig.port;
    app.listen(port, () =>{
        console.log(`Server is listening on port ${websiteConfig.port}`);
    });
}