var mockTestConfig = {
    mongodb: {
        port: 27017,
        host: "127.0.0.1"
    }
};

var mockDefaultConfig = {
    hello: "world"
};

module.exports = {
    readFile: function (file, options, callback) {
        if (/application/.test(file)) {
            process.nextTick(() => {
                var content = JSON.stringify(mockDefaultConfig);
                return callback(null, content);
            });
        } else if (/test/.test(file)) {
            process.nextTick(() => {
                var content = JSON.stringify(mockTestConfig);
                callback(null, content);
            });
        } else {
            process.nextTick(() => {
                callback(new Error('file not found'));
            });
        }
    },

    readFileSync: function (file, options) {
        if (/version/.test(file)) {
            return 'hello'
        } else {
            return '';
        }
    },

    mockDefaultConfig,
    mockTestConfig
}
