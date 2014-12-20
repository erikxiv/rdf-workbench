var path = require('path');
var config = {
  "watch": {
    "sourceDir": [
      "assets"
    ],
    "compiledDir": [
      "public"
    ],
    "javascriptDir": [
      "javascripts",
      "app"
    ],
    "exclude": [],
    "throttle": 0,
    "interval": 100,
    "binaryInterval": 300,
    "usePolling": true,
    "delay": 0,
    "excludeRegex": {},
    "compiledJavascriptDir": [
      "public",
      "javascripts",
      "app"
    ]
  },
  "liveReload": {
    "enabled": false
  },
  "isOptimize": true,
  "server": {
    "defaultServer": {
      "enabled": false,
      "onePager": false
    },
    "path": [
      "server.js"
    ],
    "port": 3000,
    "base": "",
    "packageJSONDir": null,
    "views": {
      "compileWith": "handlebars",
      "extension": "hbs",
      "path": [
        "views"
      ],
      "options": {}
    }
  }
}

var resolvePath = function (pathPieces) {
  var returnPath = __dirname;
  pathPieces.forEach(function(piece) {
    returnPath = path.join(returnPath, piece);
  })
  return returnPath;
}

if (config.watch) {
  config.watch.compiledDir = resolvePath(config.watch.compiledDir);
  config.watch.sourceDir = resolvePath(config.watch.sourceDir);
  config.watch.javascriptDir = resolvePath(config.watch.javascriptDir)
  config.watch.compiledJavascriptDir = resolvePath(config.watch.compiledJavascriptDir);
}

if (config.server) {
  if (config.server.path) {
    config.server.path = resolvePath(config.server.path);
  }

  if (config.server.views && config.server.views.path) {
    config.server.views.path = resolvePath(config.server.views.path);
  }
}

module.exports = config;