var fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    through = require('through2'),
    defaults = require('lodash.defaults'),
    parseCss = require('css-parse');

var PLUGIN_NAME = 'gulp-extract-css';

module.exports = function (options) {
  'use strict';

  // Default options
  var options = defaults(options || {}, {
    log: false,
    takeout: []
  });

  // Log info only when 'options.log' is set to true
  var log = function (message) {
    if (options.log) {
      gutil.log(message);
    }
  };

  // Define a counter that counts the rules that are iterated over
  var rulecount = 0;

  // Distribute content to the cssfiles object
  function distribute(filename, content){
    content = content;
    fs.appendFile(filename, content + "\n");
    log(rulecount + ': Append to ' + filename + ' -> ' + content);
  }

  // Check if a rule has selectors
  function hasSelectors(rule){
    return rule.selectors.length > 0;
  }

  // Wrap output inside media query
  function wrapMedia(mq, output){
    return '@media ' + mq + ' { ' + output + ' }';
  }

  // Detect weather a selector should be extracted or not
  function detectTakeout(selectors){
    var properties = {
      takeout: false
    };

    options.takeout.forEach(function (takeout) {
      selectors.forEach(function (selector) {
        if (selector.indexOf(takeout.ruleprefix) === 0) {
          properties.takeout = true;
          properties.filename = takeout.filename;
        }
      });
    });

    return properties;
  }

  function transform(file, enc, cb) {

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    // Check if configured to extract styles
    if (options.takeout && options.takeout.length > 0) {

      var filename = path.relative(file.cwd, file.path);
      var source = file.contents.toString('utf8');
      var cssJson = parseCss(source);
      var outputDir = path.relative(file.cwd, path.dirname(file.path));

      // Prepare files
      fs.writeFile(filename, '');
      options.takeout.forEach(function (takeout) {
        fs.writeFile(outputDir + '/' + takeout.filename, '');
      });

      cssJson.stylesheet.rules.forEach(function(rule){

        if (rule.type === "media"){

          rule.rules.forEach(function(subrule) {
            if (typeof subrule.selectors !== 'undefined' && typeof subrule.declarations !== 'undefined'){
              var declarations = '';

              subrule.declarations.forEach(function(declaration){
                if (declaration.type === 'declaration'){
                  declarations += declaration.property + ': ' + declaration.value + ';';
                }
              });

              var styles = subrule.selectors + ' { ' + declarations + ' } ';
              var check = detectTakeout(subrule.selectors);

              if (check.takeout){
                distribute(outputDir + '/' + check.filename, wrapMedia(rule.media, styles));
              } else {
                distribute(filename, wrapMedia(rule.media, styles));
              }

            }
          });

        } else {

          if (typeof rule.selectors !== 'undefined' && typeof rule.declarations !== 'undefined') {

            var declarations = '';

            rule.declarations.forEach(function(declaration){
              if (declaration.type === 'declaration'){
                declarations += declaration.property + ': ' + declaration.value + ';';
              }
            });

            var styles = rule.selectors + ' { ' + declarations + ' } ';
            var check = detectTakeout(rule.selectors);

            if (check.takeout){
              distribute(outputDir + '/' + check.filename, styles);
            } else {
              distribute(filename, styles);
            }

          }

        }

        rulecount++;

      });

    } else {
      log(PLUGIN_NAME + ' is not configured to extract anything');
    }

    cb();
  }

  return through.obj(transform);
};
