const AutoPrefixer = require('less-plugin-autoprefix');
const CssCleaner = require('less-plugin-clean-css');
const DEBUG = process.env.DEBUG == 'true';

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      build: {
        src: 'client/src/admin.js',
        dest: 'client/dist/admin.js',
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
          'client/dist/admin.css': 'client/src/admin.less'
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

    uglify: {
      build: {
        files: {
          'client/dist/admin.min.js': ['client/dist/admin.js']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', ['browserify', 'uglify', 'less']);

}