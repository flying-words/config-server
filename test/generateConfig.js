var mockery = require('mockery');
var assert = require("assert");
var mergeConfig = require('../mergeConfig');
var fsMock = require('./fsMock');

describe('generateConfig', () => {
    beforeEach(() => {
        mockery.enable({
            cleanCache: true
        });
        mockery.registerAllowable('../generateConfig');
        mockery.resetCache();
        mockery.registerMock('fs', fsMock);
    });

    it("should generate config if config exists", (done) => {
        var generateConfig = require('../generateConfig');
        generateConfig('application', 'test').then(config => {
            try {
                var expect = mergeConfig(fsMock.mockDefaultConfig, fsMock.mockTestConfig)
                assert.deepStrictEqual(config, expect);
                done();
            } catch (e) {
                done(e);
            }
        }).catch(done);
    });

    afterEach(() => {
        mockery.resetCache();
        mockery.disable();
    });
});
