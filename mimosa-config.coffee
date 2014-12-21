exports.config =

  # 0.14.12 is needed for optimization to work properly
  minMimosaVersion:'0.14.12'

  modules: [
    'copy'
    'lint'
    'server'
    'require'
    'minify'
    'live-reload'
    'combine'
    'bower'
    'web-package'
    'requirebuild-include'
    'requirebuild-textplugin-include'
  ]

  watch:
    javascriptDir: 'javascripts/app'

  requireBuildTextPluginInclude:
    pluginPath: 'text'
    extensions: ['html']

  requireBuildInclude:
    folder:"javascripts"
    patterns: ['app/**/*.js', 'vendor/durandal/**/*.js']

  bower:
    copy:
      mainOverrides:
        #"knockout.js":["knockout.js","knockout-2.3.0.debug.js"]
        # "bootstrap": [
        #   "docs/assets/js/bootstrap.js"
        #   "docs/assets/css/bootstrap.css"
        #   "docs/assets/css/bootstrap-responsive.css"
        # ]
        "font-awesome": [
          { font: "../../font" }
          "css/font-awesome.css"
          "css/font-awesome-ie7.css"
        ]
        "durandal": [
          {
            img: "../../images"
            js: "durandal"
            css: "durandal"
          }
        ]

  combine:
    folders: [
      {
        folder:'stylesheets'
        output:'stylesheets/styles.css'
        order: [
          'vendor/bootstrap/bootstrap.css'
          'vendor/bootstrap/bootstrap-responsive.css'
          'vendor/font-awesome/font-awesome.css'
          'vendor/durandal/durandal.css'
          'starterkit.css'
        ]
      }
    ]

  jshint:
    jshintrc: ".jshintrc"

  server:
    path: "server.js"
    views:
      compileWith: 'handlebars'
      extension: 'hbs'

  require:
    optimize:
      overrides:
        name: '../vendor/almond-custom'
        inlineText: true
        stubModules: ['text']
        pragmas:
          build: true

