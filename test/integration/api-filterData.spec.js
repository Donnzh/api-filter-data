'use strict';
/* eslint-env mocha */

const chai = require('chai');
const chatHttp = require('chai-http')
const expect = chai.expect;
const should = chai.should();
const server = require('../../server/server.js');

chai.use(chatHttp);

describe('/POST filterData', () => {

	it('should return error when request data invalid', (done) => {
		let invalidRequestData = {
			invalidData: 'invalidRequestData'
		};

		chai.request(server)
			.post('/')
			.send(invalidRequestData)
			.end((err, res) => {
				expect(err).to.exist;
				expect(res.error).to.exist;
				expect(res.statusCode).to.equal(404);
				expect(res.body).to.be.an('object');
				expect(res.body.message).to.equal('invalid data input');
				expect(res.body.detail[0].keyword).to.equal('additionalProperties');
				expect(res.body.detail[0].message).to.equal('should NOT have additional properties');
				done();
			});
	});

	it('should return error when request data has invalid format', (done) => {
		let invalidDataFormat = {
			skip: 0,
			take: 7,
			payload: [{
				'country': 'UK',
				'description': 'What\'s life like when you have enough children to field your own football team?',
				'drm': true,
				'episodeCount': 'STRING BUT NOT NUMBER',
				'genre': 'Reality',
				'image': {
					'showImage': 'http://mybeautifulcatchupservice.com/img/shows/16KidsandCounting1280.jpg'
				},
				'language': 'English',
				'nextEpisode': null,
				'primaryColour': '#ff7800',
				'seasons': null,
				'slug': 'show/16kidsandcounting',
				'title': '16 Kids and Counting',
				'tvChannel': 'GEM'
			}]
		};

		chai.request(server)
			.post('/')
			.send(invalidDataFormat)
			.end((err, res) => {
				expect(err).to.exist;
				expect(res.error).to.exist;
				expect(res.statusCode).to.equal(404);
				expect(res.body).to.be.an('object');
				expect(res.body.message).to.equal('invalid data input');
				expect(res.body.detail[0].keyword).to.equal('type');
				expect(res.body.detail[0].dataPath).to.equal('.payload[0].episodeCount');
				expect(res.body.detail[0].message).to.equal('should be integer');
				done();
			});
	});

	it('should return correct data with valid data input', (done) => {
		let validData = {
			'payload': [{
				'country': 'UK',
				'description': 'What\'s life like when you have enough children to field your own football team?',
				'drm': true,
				'episodeCount': 3,
				'genre': 'Reality',
				'image': {
					'showImage': 'http://mybeautifulcatchupservice.com/img/shows/16KidsandCounting1280.jpg'
				},
				'language': 'English',
				'nextEpisode': null,
				'primaryColour': '#ff7800',
				'seasons': null,
				'slug': 'show/16kidsandcounting',
				'title': '16 Kids and Counting',
				'tvChannel': 'GEM'
			},
			{
				'slug': 'show/seapatrol',
				'title': 'Sea Patrol',
				'tvChannel': 'Channel 9'
			},
			{
				'country': ' USA',
				'description': 'The Taste puts 16 culinary competitors in the kitchen, where four of the World\'s most notable culinary masters of the food world judges their creations based on a blind taste. Join judges Anthony Bourdain, Nigella Lawson, Ludovic Lefebvre and Brian Malarkey in this pressure-packed contest where a single spoonful can catapult a contender to the top or send them packing.',
				'drm': true,
				'episodeCount': 2,
				'genre': 'Reality',
				'image': {
					'showImage': 'http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg'
				},
				'language': 'English',
				'nextEpisode': null,
				'primaryColour': '#df0000',
				'seasons': [{
					'slug': 'show/thetaste/season/1'
				}],
				'slug': 'show/thetaste',
				'title': 'The Taste',
				'tvChannel': 'GEM'
			}
			]
		};

		let expectResponse = {
			response: [{
				image: 'http://mybeautifulcatchupservice.com/img/shows/16KidsandCounting1280.jpg',
				slug: 'show/16kidsandcounting',
				title: '16 Kids and Counting'
			},
			{
				image: 'http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg',
				slug: 'show/thetaste',
				title: 'The Taste'
			}
			]
		};

		chai.request(server)
			.post('/')
			.send(validData)
			.end((err, res) => {
				expect(err).to.not.exist;
				expect(res.error).to.exist;
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.be.an('object');
				expect(res.body.response).to.be.an('array');
				expect(res.body.response.length).to.equal(2);
				expect(Object.keys(res.body.response[0]).length).to.equal(3);
				expect(Object.keys(res.body.response[1]).length).to.equal(3);
				expect(res.body.response[0].title).to.equal(expectResponse.response[0].title);
				expect(res.body.response[1].title).to.equal(expectResponse.response[1].title);
				expect(res.body.response[0].slug).to.equal(expectResponse.response[0].slug);
				expect(res.body.response[1].slug).to.equal(expectResponse.response[1].slug);
				expect(res.body).to.deep.equal(expectResponse);
				done();
			});
	});
});