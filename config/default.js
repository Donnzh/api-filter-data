'use strict';

const packageJson = require('../package.json');

const config = {
	// Configure of this server. e.g adding another services
	server: {
		version: packageJson.version,
		port: 8080,
		services: {
			'filterData': true
		}
	},
	//winston logger config
	logger: {
		console: {
			level: 'info',
			colorize: true,
			timestamp: true
		}
	}
};
module.exports = config;
