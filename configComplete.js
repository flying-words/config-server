var traverse = require('traverse');

function isString(obj) {
    return (Object.prototype.toString.call(obj) === '[object String]');
}


module.exports = (config) => {
    return traverse(config).map(value => {
        if (this.notLeaf) {
            return value;
        }

        if (!isString(value)) {
            return value;
        }

        if (!/^ENV:.+$/.test(value)) {
            return value;
        }

        var variable = value.slice('ENV:'.length);
        return process.env[variable] || null;
    });
};
