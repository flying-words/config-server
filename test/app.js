var mockery = require("mockery");
var assert = require("assert");
var request = require('supertest');
var mergeConfig = require('../mergeConfig');
var fsMock = require('./fsMock');

describe('app', () => {
    var originToken;
    beforeEach(() => {
        originToken = process.env.CLIENT_TOKEN;
        process.env.CLIENT_TOKEN = 'foobar';
        mockery.enable({
            cleanCache: true,
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        mockery.registerAllowable('../app');
        mockery.resetCache();
        mockery.registerMock('fs', fsMock);
    });

    it("return unauthorized if client token is invalid", done => {
        var createApp = require('../app').createApp;
        var app = createApp();
        request(app)
            .get('/config/test')
            .expect(401)
            .end(done);
    });

    it("return config if token is valid and config file has no error", done => {
        var createApp = require('../app').createApp;
        var app = createApp();
        request(app)
            .get('/config/test')
            .set('X-CLIENT-TOKEN', process.env.CLIENT_TOKEN)
            .expect(200)
            .expect(res => {
                assert.deepStrictEqual(res.body, mergeConfig(fsMock.mockDefaultConfig, fsMock.mockTestConfig));
            })
            .end(done);
    });

    it("should return default config if params.env is application", done => {
        var createApp = require('../app').createApp;
        var app = createApp();
        request(app)
            .get('/config/application')
            .set('X-CLIENT-TOKEN', process.env.CLIENT_TOKEN)
            .expect(200)
            .expect(res => {
                assert.deepStrictEqual(res.body, fsMock.mockDefaultConfig);
            })
            .end(done);
    });

    it("return internal server error if config file not exists", done => {
        var createApp = require('../app').createApp;
        var app = createApp();
        request(app)
            .get('/config/foobar')
            .set('X-CLIENT-TOKEN', process.env.CLIENT_TOKEN)
            .expect(500)
            .expect(res => {
                assert.strictEqual(res.body.errorId, 'internal-server-error');
            })
            .end(done);
    });

    afterEach(() => {
        process.env.CLIENT_TOKEN = originToken;
        mockery.resetCache();
        mockery.disable();
    });
});
