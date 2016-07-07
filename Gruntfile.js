module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options : {
        seperator: ':'
      },
      dist: {
        src: [
          'public/client/**/*.js,',
        ],
        dest: 'public/dist/scripts.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },
    uglify: {
      options: {
        manage: false
      },
      dist: {
        files: {
          'public/dist/scripts.min.js': ['public/dist/scripts.js']
        }
      }
    },
    jshint: {
      files: [
        // Add filespec list here
        'public/client/**/*.js',
        'app/**/*.js',
        'lib/**/*.js',
        'server.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      dist: {
        files:[{
          expand: true,
          cwd: 'public/dist/',
          src: ['public/*.css', 'public/!*.min.css'],
          dest: ['public/dist/'],
          ext: '.min.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push heroku master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'nodemon',
    'jshint',
    'node','mochaTest',
    'concat:dist',
    'uglify:dist',
    'cssmin:dist'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
      // everything plus produc shelll
      [
        'concat',
        'uglify',
        'jshint',
        'cssmin',
        'concat:dist',
        'uglify:dist',
        'cssmin:dist'
      ]
      grunt.task.run(['shell:prodServer']);
    } else {
         [
        'concat',
        'uglify',
        'jshint',
        'cssmin',
        'concat:dist',
        'uglify:dist',
        'cssmin:dist',
        'build',
        'test'
      ]
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // push everything - shell
        'concat',
        'uglify',
        'jshint',
        'cssmin',
        'concat:dist',
        'uglify:dist',
        'cssmin:dist',
        'shell:prodServer'
  ]
  );
};