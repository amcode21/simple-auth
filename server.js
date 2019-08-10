'use strict';

const requiredEnvVars = ['MONGODB_URI', 'AUTH_KEY'];

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`process.env${envVar} missing`);
    }
});

require('console-stamp')(console, {
    metadata: function () {
        return ('[' + process.pid + ']');
    },
    colors: {
        stamp: 'yellow',
        label: 'white',
        metadata: 'green'
    }
});

const path = require('path');

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const logger = require('morgan');

const mongoose = require('mongoose');

const os = require('os');
const cluster = require('cluster');

const requireAll = require('require-all');

const app = express();
app.server = http.createServer(app);

const MONGODB_URI = process.env.MONGODB_URI

if (cluster.isMaster) {
    console.info('[MASTER] Spawning workers');

    for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
    }
}
else {
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(logger('tiny'));

    const routes = requireAll(path.join(__dirname, 'routes'));

    Object.keys(routes).forEach((route) => {
        const BuildRoute = routes[route];
        const router = express();

        app.use(`/${route}`, BuildRoute(router));
    });

    mongoose.set('debug', false);
    mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

    mongoose.connection.once('open', () => {
        console.info(`[WORKER] Connected to database`);
        
        app.server.listen(process.env.PORT || 5454, () => console.info(`[WORKER] Listening @ port: ${app.server.address().port}`));
    });

    mongoose.connection.on('error', (err) => {
        console.error(err);

        process.exit(1);
    });
}