var createApp = require('./app').createApp;

var app = createApp();

var port = 9000;
app.listen(port, () => {
    console.log('listening on port', port);
});
