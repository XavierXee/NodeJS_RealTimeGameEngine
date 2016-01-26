var Class = require('./Class.js');

/**
 * @class Loader
 *
 * Load files with simplified path.
 * Ex : loader.load("Core\Class"); will look to "src\Core\Class.js".
 *
 * @extends Class
 */
var Loader = Class.extend({
    initialize: function(basePath) {
        this.basePath = basePath;
    },
    load: function(className) {
        var exploded = className.split('/');
        var classPath = '';
        for(var part in exploded) {
            classPath += '/' + exploded[part];
        }
        
        return require(this.basePath + '/src' + classPath + '.js');
    }
});

module.exports = Loader;