const AutoPrefixer = require('less-plugin-autoprefix');
const CssCleaner = require('less-plugin-clean-css');
const DEBUG = process.env.DEBUG == 'true';

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      build: {
        files: {
          'client/dist/admin.js': 'client/src/admin.js',
          'client/dist/admin.ui.js': 'client/src/admin.ui.js'
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
          'client/dist/admin.css': 'client/src/admin.less',
          'client/dist/admin.ui.css': 'client/src/admin.ui.less'
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
          'client/dist/admin.html': 'client/src/admin.html'
        }
      }
    },

    uglify: {
      build: {
        files: {
          'client/dist/admin.min.js': ['client/dist/admin.js'],
          'client/dist/admin.ui.min.js': ['client/dist/admin.ui.js']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  grunt.registerTask('default', ['browserify', 'uglify', 'less', 'htmlmin']);

}