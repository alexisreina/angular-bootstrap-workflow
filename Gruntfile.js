module.exports = function (grunt) {

  'use strict';

  // Load multiple grunt tasks using globbing patterns.
  require('load-grunt-tasks')(grunt);

  // Display the elapsed execution time of grunt tasks.
  require('time-grunt')(grunt);

  // Project Configuration.
  grunt.initConfig({

    // Dev and Build related tasks
    pkg: grunt.file.readJSON('package.json'),

    // Clear files and folders
    clean: {
      tmp: ['.tmp'],
      dist: ['.tmp', 'dist']
    },

    // Copy files and folders
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: 'app',
            dest: 'dist',
            src: [ '*.{ico,png,txt,xml}', 'img/{,*/}*.webp', '{,*/}*.html', 'fonts/{,*/}*.*', 'api/{,*/}*.json' ]
          }
        ]
      }
    },

    // Dev environment related tasks:
    // Inject Bower packages into your source code with Grunt.
    wiredep: {
      dev: {
        src: [
          'app/index.html',
          'app/css/styles.scss'
        ],
        options: {
          exclude: [
            '/jquery/',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
            'bower_components/bootstrap-sass/assets/stylesheets/_bootstrap.scss'
          ]
        }
      }
    },

    // Compile Sass to CSS.
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          '.tmp/css/styles.css': 'app/css/styles.scss',
        }
      }
    },

    // Parse CSS and add vendor-prefixed CSS properties using the Can I Use database.
    autoprefixer: {
      dist: {
        options: {
          browsers: ['last 2 versions', 'ie 9', 'Android 4']
        },
        src: '.tmp/css/styles.css'
      }
    },

    watch: {
      wiredep: {
        files: 'bower.json',
        tasks: 'wiredep:dev'
      },
      gruntfile: {
        files: 'Gruntfile.js',
        options: {
          reload: true
        }
      },
      css: {
        files: 'app/css/*.scss',
        tasks: ['sass:dist', 'autoprefixer:dist']
      }
    },

    // Live CSS reload & Browser Syncing
    browserSync: {
      dev: {
        bsFiles: {
          src: [
            'app/*.html',
            'app/partials/*.html',
            '.tmp/css/*.css',
            'app/js/*.js',
            'app/img/*.{png,jpg,svg}',
            'app/api/**/*.json'
          ]
        },
        options: {
          watchTask: true,
          server: {
            baseDir: 'app',
            routes: {
              '/bower_components': 'bower_components',
              '/css': '.tmp/css'
            }
          }
        }
      },
      dist: {
        options: {
          server: {
            baseDir: 'dist'
          }
        }
      }
    },

    // Build production related tasks:
    // TODO: Automatize this
    // Concatenate files. 'Update Manually.'
    concat: {
      dist: {
        files: {
          '.tmp/concat/styles.css' : [
            'bower_components/bootstrap/dist/css/bootstrap.css',
            '.tmp/css/styles.css'
          ],

          '.tmp/concat/scripts.js' : [
            'bower_components/angular/angular.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'app/js/app.js'
          ]
        }
      }
    },

    // Minify files with UglifyJS.
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd, h:MM:ss TT") %> */\n',
        compress: {
          drop_console: true // <- remove console.log()
        }
      },
      dist: {
        files: {
          'dist/js/scripts.js': '.tmp/concat/scripts.js'
        }
      }
    },

    // Compress CSS files.
    csso: {
      dist: {
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                  '<%= grunt.template.today("yyyy-mm-dd, h:MM:ss TT") %> */\n',
        },
        files: {
          'dist/css/styles.css': '.tmp/concat/styles.css'
        }
      }
    },

    // Process html files at build time to modify them depending on the release environment.
    processhtml: {
      dist: {
        files: {
          'dist/index.html': 'dist/index.html'
        }
      }
    },

    // Asset revisioning by using file content hashing.
    filerev: {
      options: {
        algorithm: 'md5',
        length: 8
      },
      images: {
        src: 'dist/img/{,/*}*.{jpg,jpeg,gif,png,webp,svg}'
      },
      css: {
        src: 'dist/css/*.css'
      },
      js: {
        src: 'dist/js/*.js'
      }
    },

    // Replace references to grunt-filerev files.
    filerev_replace: {
      options: {
        assets_root: 'dist/{img/,js/,css/,fonts/}'
      },
      css: {
        src: 'dist/css/*.css'
      },
      js: {
        src: 'dist/js/*.js'
      },
      html: {
        options: {
          views_root: 'dist'
        },
        src: 'dist/{,/*}*.html'
      }
    },

    // Minify images
    imagemin: {
      dist: {
        files: [{
          expand: true,                     // Enable dynamic expansion
          cwd: 'app/img',                   // Src matches are relative to this path
          src: ['{,*/}*.{png,jpg,gif}'],    // Actual patterns to match
          dest: 'dist/img'                  // Destination path prefix
        }]
      }
    },

    // Optimize svg
    svgmin: {
      dist: {
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: 'app/img',                // Src matches are relative to this path
          src: ['{,*/}*.svg'],           // Actual patterns to match
          dest: 'dist/img'               // Destination path prefix
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          minifyJS: true,
          minifyCSS: true,
          ignoreCustomComents: [] // Array of regex'es that allow to ignore certain comments, when matched
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: '**/*.html',
          dest: 'dist/'
        }]
      }
    }

    // Test related tasks.


  });


  // Development task(s).
  grunt.registerTask('dev', [
    'clean:dist',
    'wiredep:dev',
    'sass:dist',
    'autoprefixer:dist',
    'browserSync:dev',
    'watch'
  ]);


  // Build task(s).
  grunt.registerTask('build', [
    'clean:dist',
    'wiredep:dev',
    'copy:dist',
    'imagemin:dist',
    'svgmin:dist',
    'sass:dist',
    'autoprefixer:dist',
    'concat:dist',
    'uglify:dist',
    'csso:dist',
    'processhtml:dist',
    'filerev',
    'filerev_replace',
    'htmlmin:dist',
    'browserSync:dist'
  ]);

  // Default task.
  grunt.registerTask('default', ['dev']);
};
