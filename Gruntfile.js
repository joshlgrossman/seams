const AutoPrefixer = require('less-plugin-autoprefix');
const CssCleaner = require('less-plugin-clean-css');
const DEBUG = process.env.DEBUG == 'true';

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

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
          'client/dist/seams.js': 'client/src/seams.js',
          'client/dist/seams.ui.js': 'client/src/seams.ui.js'
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
        browserifyOptions: {
          debug: DEBUG
        }
      }
    },

    less: {
      build: {
        files: {
          'client/dist/seams.css': 'client/src/seams.less',
          'client/dist/seams.ui.css': 'client/src/seams.ui.less'
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
          'client/dist/seams.html': 'client/src/seams.html'
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

  grunt.registerTask('test', [
    'eslint'
  ]);

  grunt.registerTask('default', [
    'eslint',
    'browserify', 
    'uglify', 
    'less', 
    'htmlmin'
  ]);

}