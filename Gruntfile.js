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
    // Concatenate files. IMPORTANT -> Update Files Manually.
    concat: {
      dist: {
        files: {
          '.tmp/concat/css/styles.css' : [
            'bower_components/bootstrap/dist/css/bootstrap.css',
            '.tmp/css/styles.css'
          ],

          '.tmp/concat/js/scripts.js' : [
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
        // banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        //         '<%= grunt.template.today("yyyy-mm-dd, h:MM:ss TT") %> */\n',
        compress: {
          drop_console: true //∫ <- remove console.log()
        }
      },
      dist: {
        files: {
          'dist/js/scripts.js': '.tmp/concat/js/scripts.js'
        }
      }
    },

    // Compress CSS files.
    csso: {
      dist: {
        // options: {
          // banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          //        '<%= grunt.template.today("yyyy-mm-dd, h:MM:ss TT") %> */\n',
        // },
        files: {
          'dist/css/styles.css': '.tmp/concat/css/styles.css'
        }
      }
    },

    // Asset revisioning by using file content hashing.
    filerev: {
      options: {
        algorithm: 'md5',
        length: 8
      },
      assets: {
        files: [{
          src: [
            'dist/img/{,/*}*.{jpg,jpeg,gif,png,webp,svg}',
            'dist/css/*.css',
            'dist/js/*.js',
            //'dist/fonts/{}*.{eot,ttf,svg,woff,woff2}'
          ]
        }],
      }
    },

    // Replaces references to non-optimized scripts
    // or stylesheets into a set of HTML files (or any templates/views)
    // No funciona con srcset!, hay que crear patterns a mano.
    // Tampoco lo he probado con las tipos en el css! <- TODO
    usemin: {
      html: 'dist/{,*/}*.html',
      css: 'dist/css/{,*/}*.css',
      js: 'dist/js/*.js',
      options: {
        assetsDirs: ['dist', 'dist/img'],
        patterns: {
          // FIXME While usemin won't have full support for revved files we have to put all references manually here
          js: [
              [/(img\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
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

    // Minify SVG.
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

    // Minify HTML.
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
    'filerev',
    'usemin',
    'htmlmin:dist',
    'browserSync:dist'
  ]);

  // Default task.
  grunt.registerTask('default', ['dev']);
};
