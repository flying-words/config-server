var fs = require('fs');
var path = require('path');
var express = require('express');
var cors = require('cors');
var generateConfig = require('./generateConfig');

function validateToken(req, res, next) {
    if (req.get('X-CLIENT-TOKEN') !== process.env.CLIENT_TOKEN) {
        return res.status(401).json({
            errorId: 'unauthorized',
            errorMsg: 'invalid api key'
        });
    }

    next();
}

module.exports.createApp = function() {
    var app = express();
    app.use(cors());

    app.get('/ping', (req, res) => {
        res.send('pong');
    });

    app.get('/config/:env',
        validateToken,
        (req, res) => {
            generateConfig('application', req.params.env).then(config => {
                res.json(config);
            }).catch(e => {
                console.error(e);
                var errorMsg = e.code === 'ENOENT' ? 'file not found' : 'internal server error';
                res.status(500).json({
                    errorId: 'internal-server-error',
                    errorMsg: errorMsg
                });
            });
        });
    return app;
}
