'use strict';

const winston = require('winston');
const ajv = require('ajv');
const ajvInstance = new ajv();

const sendDataValidator = ajvInstance.compile({
	type: 'object',
	required: ['payload'],
	additionalProperties: false,
	definitions: {},
	properties: {
		payload: {
			description: 'list of shows',
			type: 'array',
			minItems: 1,
			items: {
				description: 'detail of show',
				type: 'object',
				additionalProperties: false,
				required: ['slug', 'title', 'tvChannel'],
				properties: {
					slug: {
						type: 'string'
					},
					title: {
						type: 'string'
					},
					tvChannel: {
						type: 'string'
					},
					country: {
						type: 'string'
					},
					description: {
						type: 'string'
					},
					drm: {
						type: 'boolean'
					},
					episodeCount: {
						type: 'integer',
						'minimum': 0
					},
					genre: {
						type: 'string'
					},
					language: {
						type: 'string'
					},
					nextEpisode: {
						type: ['object', 'null'],
						additionalProperties: false,
						properties: {
							channel: {
								type: ['string', 'null'],
								description: 'show channel'
							},
							channelLogo: {
								type: 'string',
								description: 'channel logo'
							},
							date: {
								type: ['string', 'null']
							},
							html: {
								type: 'string'
							},
							url: {
								type: 'string',
								description: 'url of nextEpisode'
							}
						}
					},
					seasons: {
						type: ['array', 'null'],
						items: {
							description: 'A paragraph of content',
							type: 'object',
							additionalProperties: false,
							required: ['slug'],
							properties: {
								slug: {
									description: 'slug of next season',
									type: 'string'
								}
							}
						}
					},
					image: {
						type: 'object',
						additionalProperties: false,
						required: ['showImage'],
						properties: {
							showImage: {
								type: 'string',
								description: 'show image link'
							}
						}
					},
					primaryColour: {
						type: 'string'
					}
				}
			}
		},
		skip: {
			type: 'integer',
			'minimum': 0
		},
		take: {
			type: 'integer',
			'minimum': 0
		},
		totalRecords: {
			type: 'integer',
			'minimum': 0
		}
	}
});

function filterDataor(params, errback) {
	if(!sendDataValidator(params)) {
		winston.error('Invalid request data', sendDataValidator.errors);
		errback({
			error: 'Could not decode request: JSON parsing failed'
		});
		return;
	}
	let selectedData = params.payload.reduce((result, item) => {
		if(item.drm && item.episodeCount > 0) {
			result.push({
				image: item.image.showImage,
				slug: item.slug,
				title: item.title
			});
		}
		return result;
	}, []);
	winston.info('Success filtered request data');
	errback(undefined, selectedData);
}

/**
 * @api {post} / select data from request.body
 * @apiName filterDataPostRoute
 * @apiGroup dataQuerying
 *
 * @apiParam {integer} skip
 * @apiParam {integer} take
 * @apiParam {integer} totalRecords
 * @apiParam {array} payload
 *
 * @apiParamExample {json} requestDataExample
 *     {
 *       "payload": [
 *           {
 *              "slug" : "show/showName",
 *              "title" : "Show Name",
 *              "tvChannel" : "channelName",
 *              "drm": true,
 *              "episodeCount": 3,
 *              "image": {
 *                  "showImage": "http://imagelink.jpg",
 *                       },
 *              "title": "16 Kids and Counting",
 *              "tvChannel": "GEM"
 *
 *           }
 *       ],
 *       "skip": 0,
 *       "take": 2,
 *       "totalRecords": 4
 *     }
 *
 * @apiSuccess {Object} return data info depend on its drm & episodeCount value.
 *
 * @apiSuccessExample  Success-Response Example:
 *     HTTP/1.1 200 OK
 *     {
 *        "response": [
 *                      {
 *                      "image": "http://imagelink.jpg",
 *                      "slug": "show/showName",
 *                      "title": "Show Name"
 *                      }
 *                    ]
 *     }
 *
 * @apiError (Error 404) invalid reqeust data.
 *
 * @apiErrorExample requestDataInvalid
 *     HTTP/1.1 404 Not Found
 *     {
 *      "message": "invalid data input",
 *      "detail" : [
 *                   {...},
 *                   "message" : " should have ..... "
 *                 ]
 *     }
 *
 **/
function filterDataPostRoute(req, res) {
	const params = req.body;
	filterDataor(params, (err, result) => {
		if(err) {
			res.set('Content-Type', 'application/json');
			res.status(400).send(err);
			return;
		}
		res.json({
			response: result
		});
	});
}

module.exports = filterDataPostRoute;
