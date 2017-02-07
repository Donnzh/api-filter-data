'use strict';

const winston = require('winston');
const server = require('./server.js');
const config = require('config');
const port = config.server.port;

server.listen(port);
winston.info(`Listening on port ${port}`);
