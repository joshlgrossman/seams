module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      build: {
        src: 'client/src/admin.new.js',
        dest: 'client/dist/admin.new.js',
        options: {
          transform: [[
            'babelify', {
              presets: ['es2015', 'es2016']
            }
          ]]
        }
      }
    },

    uglify: {
      build: {
        files: {
          'client/dist/admin.new.js': ['client/dist/admin.new.js']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['browserify', 'uglify']);

}