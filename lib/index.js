var Path = require('path');

var Callsite = require('callsite');
var Glob = require('glob');
var Hoek = require('hoek');


var Actin = function (options) {

    this.settings = Hoek.applyToDefaults(Actin.defaults, options || {});
    return this;
};

Actin.defaults = {
    'controllers': {
        'capitalize': true,
        'cwd': null,
        'extension': '.js',
        'folderName': 'controllers',
        'ignoreFiles': [],
        'onLoad': null,
        'onLoadSync': null,
        'pattern': '*'
    }
};

// Actin.prototype.Controllers = 
Actin.prototype.controllers = function (options, callback) {

    if (typeof options === 'function') {
        callback = options;
        options = {};
    }
    var settings = Hoek.applyToDefaults(this.settings.controllers, options);
    var controllers = {};
    
    // TODO: i don't like this code smell
    var calleeDirName = Path.dirname(Callsite()[1].getFileName());
    var cwd = [calleeDirName, settings.folderName].join('/');
    if (settings.cwd) {
        cwd = settings.cwd;
    }
    
    Glob(settings.pattern + settings.extension, {cwd: cwd}, function (err, files) {

        for(var i in files) {
            var file = Path.basename(files[i]);
            var filename = Path.basename(files[i], settings.extension);
            
            // TODO: make this fuzzy/glob search
            // if (settings.ignoreFiles.indexOf(filename) >= 0) {
            //     continue;
            // }
            
            var key = filename;
            if (settings.capitalize) {
                key = filename.charAt(0).toUpperCase() + filename.slice(1);
            }
            controllers[key] = require([cwd, files[i]].join('/'));
        }
        
        if (typeof settings.onLoad === 'function') {
            return settings.onLoad(controllers, callback);
        }
        
        return callback(null, controllers);
    });
};

// Actin.prototype.Controllers.sync = 
Actin.prototype.controllersSync = function (options) {

    var settings = Hoek.applyToDefaults(this.settings.controllers, options || {});
    var controllers = {};
    
    // TODO: i don't like this code smell
    var calleeDirName = Path.dirname(Callsite()[1].getFileName());
    var cwd = [calleeDirName, settings.folderName].join('/');
    if (settings.cwd) {
        cwd = settings.cwd;
    }
    
    var files = Glob.sync(settings.pattern + settings.extension, {cwd: cwd});
    for(var i in files) {
        var file = Path.basename(files[i]);
        var filename = Path.basename(files[i], settings.extension);
        
        // TODO: make this fuzzy/glob search
        // if (settings.ignoreFiles.indexOf(filename) >= 0) {
        //     continue;
        // }
        
        var key = filename;
        if (settings.capitalize) {
            key = filename.charAt(0).toUpperCase() + filename.slice(1);
        }
        controllers[key] = require([cwd, files[i]].join('/'));
    }
    
    if (typeof settings.onLoadSync === 'function') {
        return settings.onLoadSync(controllers);
    }
    
    return controllers;
};

module.exports = Actin;