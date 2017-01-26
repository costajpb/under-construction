#! /usr/bin/env node
var path = require('path');
var resolve = require('resolve').sync;
var shelljs = require('shelljs');

var shout = function (code, output) {
  console.log(output);
};

var signalize = function (pkg, cwd) {
  try {
    try {
      var link = pkg.config.underconstruction.link;

      try {
        var globals = shelljs.exec('npm list -json --depth=0 -g', { silent: true }).output;
        globals = JSON.parse(globals.match(/(.|\n)*\}$/m)[0]).dependencies;

        link.forEach(function (m) {
          try {
            if (!globals[m] || globals[m].missing) {
              throw 'under-construction >>> Could not link ' + m + '. Are you sure it is around?\n';
            }
            var cmd = 'npm link ' + m;
            if (cwd) {
              cmd = 'cd ' + cwd + ' && ' + cmd;
            }
            var code = shelljs.exec(cmd, { silent: true }).code;
            if (!code) {
              console.log('under-construction >>> ' + m + ' has been linked.');
              var dpath = resolve(m, { basedir: process.cwd() });
              var dir = path.dirname(dpath);
              var dpkg = require(path.join(dir, 'package.json'));
              signalize(dpkg, dir);
            }
          } catch (err) {
            console.error(err);
          }
        });
      } catch (err) {
        console.error('under-construction >>> Could not retrieve globals. Aborting linking.');
      }
    } catch (err) {
      console.log('under-construction >>> ' + pkg.name + ' has no linked modules.');
    }
  } catch (err) {
    console.log('under-construction >>> ' + pkg.name + ' does not demand any signalization.');
    process.exit();
  } finally {
    var work = 'npm run underconstruction';
    if (cwd) {
      var currentPkg = require(path.join(cwd, 'package.json'));
      if (currentPkg.scripts && currentPkg.scripts.underconstruction) {
        shelljs.exec('cd ' + cwd + ' && ' + work, shout);
      }
    } else {
      shelljs.exec(work, shout);
    }

    console.log('under-construction >>> ' + pkg.name + ' is under maintenance.\n');
  }
};

signalize(require(process.cwd() + '/package.json'));
