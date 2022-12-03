'use strict';

import websiteConfig from './config/websiteConfig';

import apiRoute from './routes/apiRoute';
import interfaceRoute from './routes/interfaceRoute';

const ejs = require('ejs');

import {Request, Response} from 'express';
import express = require('express');
const app = express();

app.engine("html", ejs.renderFile);
app.set("view engine", "ejs");

app.use(express.json());

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

const port = websiteConfig.port;
app.listen(port, () =>{
    console.log(`Server is listening on port ${websiteConfig.port}`);
});