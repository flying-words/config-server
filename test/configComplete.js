var assert = require("assert");
var complete = require('../configComplete');

describe("configComplete", () => {
    it("should replace value of the env property", () => {
        var origin = {
            "privateApiKey": "ENV:PRIVATE_API_KEY"
        };

        process.env.PRIVATE_API_KEY = "hello";
        var result = complete(origin);
        assert.deepEqual(result, {
            "privateApiKey": "hello"
        });
    });

    it("should replace env variable in array", () => {
        var origin = {
            redis: {
                hosts: ["ENV:R1", "ENV:R2"]
            }
        };

        process.env.R1 = "r1";
        process.env.R2 = "r2";
        var result = complete(origin);
        assert.deepEqual(result, {
            redis: {
                hosts: ["r1", "r2"]
            }
        });
    });

    it("should return null if environment variable not found", () => {
        var origin = {
            "test": "ENV:test"
        };

        var result = complete(origin);
        assert.deepStrictEqual(result, {
            "test": null
        });
    });
});
