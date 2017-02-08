'use strict';

const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const cors = require('cors')
const winston = require('winston');
const cookieParser = require('cookie-parser');

winston.info('Config', { config: JSON.stringify(config, undefined, 2) });
winston.info('NODE_ENV', { NODE_ENV: process.env.NODE_ENV });
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, config.get('logger.console'));

const server = express();
const allMiddlewares = [bodyParser.json(), cors()];
const serverConfig = config.server;
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());

Object.keys(serverConfig.services)
	.filter((service) => {
		return config.server.services[service] === true;
	}).forEach((service) => {
		server.use(
			'/',
			require(`./api/${service}/routes.js`));
	});

module.exports = server;
