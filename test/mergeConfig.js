var assert = require("assert");
var mergeConfig = require('../mergeConfig');

describe('mergeConfig', () => {
    it("should merge config recursively", () => {
        var app = {
            "editor": {
                "static": {
                    "root": "/var/data",
                    "prefix": "/data"
                }
            },
            "viewer": {
                "host": "localhost:8080"
            }
        }

        var env = {
            "editor": {
                "host": "localhost:8080",
                "static": {
                    "root": "/opt",
                    "prefix": "/data"
                }
            }
        };

        var result = mergeConfig(app, env);
        assert.deepStrictEqual(result, {
            "editor": {
                "host": "localhost:8080",
                "static": {
                    "root": "/opt",
                    "prefix": "/data"
                }
            },
            "viewer": {
                "host": "localhost:8080"
            }
        });
    });
});