module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    responsive_images: {
      dev: {
        options: {
          sizes: [{
            width: 320,
            height: 240
          }]
        },
        files: [{
          expand: true,
          src: ['*.{.gif,jpg,png}'],
          cwd: 'img/',
          dest: 'img/'
        }]
      }
    },

  });

  // Load the plugin
  grunt.loadNpmTasks('grunt-responsive-images');

  // Default task(s).
  grunt.registerTask('default', ['responsive_images']);

};
