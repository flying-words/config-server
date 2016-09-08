var deepmerge = require('deepmerge');

module.exports = (app, env) => {
    return deepmerge(app, env); 
}