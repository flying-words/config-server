var morgan = require('morgan');
var createApp = require('./app').createApp;

var app = createApp();
app.use(morgan('combined'));

var port = 9000;
app.listen(port, () => {
    console.log('listening on port', port);
});
