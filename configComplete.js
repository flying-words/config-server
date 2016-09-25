var traverse = require('traverse');
var delimeter = /\$\{(.+?)\}/g;
var pattern = /\$\{(.+?)\}/;

function isString(obj) {
    return (Object.prototype.toString.call(obj) === '[object String]');
}

module.exports = (config, variables) => {
    variables = variables || {};

    return traverse(config).map(value => {
        if (this.notLeaf) {
            return value;
        }

        if (!isString(value)) {
            return value;
        }

        if (!pattern.test(value)) {
            return value;
        }

        var groups = pattern.exec(value);
        if (groups[0] === value) {
            var variable = groups[1];
            return variables[variable] || null;
        }

        return value.replace(delimeter, function(match, p1) {
            return variables[p1] || "";
        });
    });
};
