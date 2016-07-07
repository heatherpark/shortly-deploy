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
      target: {
        files:[{
          expand: true,
          // cwd is current working directory
          cwd: 'public',
          src: ['style.css'],
          dest: ['public/dist'],
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
        options: {
          // display the messages log
          // standard error boolean values\
          callback:log,
          stderr: false
        },
        command: 'git push heroku master'
      }
    },
  });

//   grunt.log.writeln([msg])


  function log(err, stdout, stderr, cb) {
    if (err) {
        cb(err);
        return;
    }

    console.log(stdout);
    cb();
}

// grunt.initConfig({
//     shell: {
//         dirListing: {
//             command: 'ls',
//             options: {
//                 callback: log
//             }
//         }
//     }
// });

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
    'mochaTest',
    'jshint'
  ]);

  grunt.registerTask('build', [
    'concat',
    'uglify',
    'cssmin'
  ]);
  // dont need to specify dist
// grunt upload --env=production

  grunt.registerTask('upload', function(n) {
    // grunt upload --prod=true
    // in order for 143 to activate it needs a truthy statement -- > boolean values
    if(grunt.option('prod')) {
      // add your production server task here
      // everything plus produc shelll
      ['test', 'build'];
      grunt.task.run(['shell:prodServer']);
      // pushing to heroku
    } else {
      ['test', 'build'];
      grunt.task.run([ 'server-dev' ]);
      //
    }
  });
  // grunt.registerTask('deploy',['build','upload']);
  // deploy goes into upload
};
// test -- > build --- > upload - prod goes to production server, just deploy will run server --> deploy / gr