var path = require('path');
var yaml = require('js-yaml');
var fs = require('fs');
var co = require('co');

var denodeify = require('denodeify');
var readFile = denodeify(fs.readFile);

var mergeConfig = require('./mergeConfig');
var configComplete = require('./configComplete');

module.exports = (base, env) => {
    return co(function*() {
        var baseFilePath = path.resolve(__dirname, 'config', `${base}.yml`);
        var filePath = path.resolve(__dirname, 'config', `${env}.yml`);

        var baseContent = yield readFile(baseFilePath, { encoding: 'utf-8' });
        var envContent = yield readFile(filePath, { encoding: 'utf-8' });

        var baseConfig = yaml.safeLoad(baseContent);
        var envConfig = yaml.safeLoad(envContent);

        var result = mergeConfig(baseConfig, envConfig);
        return configComplete(result, Object.assign({}, process.env));
    });
}
