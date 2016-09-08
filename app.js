var fs = require('fs');
var path = require('path');
var express = require('express');
var cors = require('cors');
var denodeify = require('denodeify');
var readFile = denodeify(fs.readFile);

var configComplete = require('./configComplete');
var mergeConfig = require('./mergeConfig');

var app = express();
app.use(cors());

function validateApiKey(req, res, next) {
    if (req.get('X-CLIENT-TOKEN') !== process.env.CLIENT_TOKEN) {
        return res.status(401).json({
            errorId: 'unauthorized',
            errorMsg: 'invalid api key'
        });
    }

    next();
}

app.get('/config/:env', 
    validateApiKey,
    (req, res) => {
    var env = req.params.env;
    var base = path.resolve(__dirname, 'config', `application.json`);
    var filename = path.resolve(__dirname, 'config', `${env}.json`);
    Promise.all([
        readFile(base, {encoding: 'utf-8'}),
        readFile(filename, {encoding: 'utf-8'})
    ]).then(files => {
        var [base, envConfig] = files.map(content => JSON.parse(content));
        var result = mergeConfig(base, envConfig);
        res.json(configComplete(result));
    }).catch(e => {
        console.error(e);
        res.status(500).json({
            errorId: 'internal-server-error',
            errorMsg: e.message
        });
    });
});

var port = 9000;
app.listen(port, () => {
    console.log('listening on port', port);
});

