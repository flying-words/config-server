var assert = require("assert");
var complete = require('../configComplete');

describe("configComplete", () => {
    it("should replace value of the env property", () => {
        var origin = {
            "privateApiKey": "${PRIVATE_API_KEY}"
        };

        var result = complete(origin, {
            PRIVATE_API_KEY: "hello"
        });
        assert.deepEqual(result, {
            "privateApiKey": "hello"
        });
    });

    it("should be able to replace env variable in array", () => {
        var origin = {
            redis: {
                hosts: ["${R1}", "${R2}"]
            }
        };

        var result = complete(origin, {
            R1: "r1",
            R2: "r2"
        });
        assert.deepEqual(result, {
            redis: {
                hosts: ["r1", "r2"]
            }
        });
    });

    it("should interpolate variable in string", () => {
        var origin = {
            "test": "${test} is hero"
        };

        var result = complete(origin, {
            test: "Iron Man"
        });
        assert.deepStrictEqual(result, {
            "test": "Iron Man is hero"
        });
    });

    it("should interpolate empty string for variable in string if the variable is not defined", () => {
        var origin = {
            "test": "${test} is hero"
        };

        var result = complete(origin, {});
        assert.deepStrictEqual(result, {
            "test": " is hero"
        });
    });

    it("should return null if environment variable not found for a single env value", () => {
        var origin = {
            "test": "${test}"
        };

        var result = complete(origin);
        assert.deepStrictEqual(result, {
            "test": null
        });
    });
});
