const AutoPrefixer = require('less-plugin-autoprefix');
const CssCleaner = require('less-plugin-clean-css');
const debug = process.env.DEBUG === 'true';

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
        },
        src: ['./tests/**/*.test.js']
      }
    },

    eslint: {
      options: {
        configFile: 'eslint.json',
        reset: true
      },

      build: [
        'server/*.js',
        'client/src/*.js'
      ]
    },

    browserify: {
      build: {
        files: {
          'client/dist/seams.js': 'client/src/js/seams.js',
          'client/dist/seams.ui.js': 'client/src/js/seams.ui.js'
        },
        options: {
          transform: [[
            'babelify', {
              presets: ['es2015', 'es2016']
            }
          ]]
        }
      },
      options: {
        browserifyOptions: { debug }
      }
    },

    less: {
      build: {
        files: {
          'client/dist/seams.css': 'client/src/less/seams.less',
          'client/dist/seams.ui.css': 'client/src/less/seams.ui.less'
        },
        options: {
          plugins: [
            new AutoPrefixer({
              browsers: ['last 2 versions']
            }),
            new CssCleaner()
          ]
        }
      }
    },

    htmlmin: {
      build: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'client/dist/seams.html': 'client/src/html/seams.html'
        }
      }
    },

    uglify: {
      build: {
        files: {
          'client/dist/seams.min.js': ['client/dist/seams.js'],
          'client/dist/seams.ui.min.js': ['client/dist/seams.ui.js']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', [
    'eslint',
    'mochaTest'
  ]);

  grunt.registerTask('default', [
    'eslint',
    'browserify', 
    'uglify', 
    'less', 
    'htmlmin'
  ]);

};