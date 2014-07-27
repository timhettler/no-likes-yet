module.exports = function ( grunt ) {
  require('load-grunt-tasks')(grunt);

  var userConfig = require( './build.config.js' );

  var taskConfig = {

    pkg: grunt.file.readJSON("package.json"),

    htmlbuild: {
      build: {
        src: '<%= app_files.html %>',
        dest: '<%= build_dir %>',
        options: {
          parseTag: 'build',
          beautify: true,
          relative: true,
          scripts: {
            modernizr: ['<%= build_dir %>/vendor/common/modernizr.js', '<%= build_dir %>/vendor/common/detectizr.js'],
            vendor: [
                '<%= build_dir %>/vendor/common/jquery.js',
                '<%= build_dir %>/vendor/common/angular.js',
                '<%= build_dir %>/vendor/*/*.js'
            ],
            app: [
              '<%= build_dir %>/js/**/*.js',
              '<%= html2js.app.dest %>'
            ]
          },
          styles: {
            app: ['<%= build_dir %>/vendor/*/*.css', '<%= build_dir %>/css/*.css']
          },
          data: {
              version: "<%= pkg.version %>",
              title: "<%= meta.title %>",
              description: "<%= meta.description %>",
              viewport: "<%= meta.viewport %>"
          },
        }
      },
      compile: {
        src: '<%= build_dir %>/index.html',
        dest: '<%= compile_dir %>',
        options: {
          parseTag: 'compile',
          beautify: true,
          relative: true,
          scripts: {
            modernizr: '<%= compile_dir %>/js/modernizr.js',
            app: '<%= compile_dir %>/js/<%= pkg.name %>.js'
          },
          styles: {
            app: '<%= compile_dir %>/css/app.css'
          }
        }
      }
    },

    clean: [
      '<%= build_dir %>',
      '<%= compile_dir %>'
    ],

    ngmin: {
      compile: {
        files: [
          {
            src: [ 'js/app/**/*.js' ],
            cwd: '<%= build_dir %>',
            dest: '<%= build_dir %>',
            expand: true
          }
        ]
      }
    },

    html2js: {
      app: {
        src: [ '<%= app_files.atpl %>' ],
        dest: '<%= build_dir %>/js/templates-app.js'
      }
    },

    jshint: {
      src: '<%= app_files.js %>',
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        eqnull: true,
        browser: true,
        debug: true,
        globals: {
            angular: true
        }
      },
    },

    concat: {
      compile_js: {
        src: [
          '<%= build_dir %>/vendor/**/*.js',
          '!**/modernizr.js',
          '<%= build_dir %>/js/**/*.js'
        ],
        dest: '<%= compile_dir %>/js/<%= pkg.name %>.js'
      },
      compile_css: {
        src: [
            '<%= build_dir %>/vendor/**/*.css',
            '<%= build_dir %>/css/app.css'
        ],
        dest: '<%= compile_dir %>/css/<%= pkg.name %>.js'
      }
    },

    delta: {

      gruntfile: {
        files: 'Gruntfile.js',
        tasks: [ 'jshint:gruntfile' ],
        options: {
          livereload: false
        }
      },

      jssrc: {
        files: [
          '<%= app_files.js %>'
        ],
        tasks: [ 'jshint:src', 'copy:build_appjs' ]
      },

      assets: {
        files: [
          'src/assets/**/*'
        ],
        tasks: [ 'copy:build_assets' ]
      },

      data: {
        files: [
            'src/data/**/*'
        ],
        tasks: [ 'copy:build_data' ]
      },

      html: {
        files: [ '<%= app_files.html %>' ],
        tasks: [ 'htmlbuild:build' ]
      },

      partials: {
        files: ['src/partials/*.html'],
        tasks: [ 'copy:build_partials' ]
      },

      tpls: {
        files: [
          '<%= app_files.atpl %>'
        ],
        tasks: [ 'html2js' ]
      },

      compass: {
        files: [ 'src/sass/**/*.scss' ],
        tasks: [ 'compass:dev', 'autoprefixer:build' ]
      },

      express: {
        files:  [ 'server/*.js' ],
        tasks:  [ 'express:dev' ],
        options: {
          spawn: false
        }
      }

      // sass: {
      //   files: [ 'src/sass/**/*.scss' ],
      //   tasks: [ 'sass:dev' ]
      // }
    },

    uglify: {
        compile: {
            files: {
                '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
            }
        }
    },

    compass: {
      dev: {
        options: {
          force: true,
          sassDir: 'src/sass',
          cssDir: '<%= build_dir %>/css',
          imagesDir: '<%= build_dir %>/assets',
          fontsDir: '<%= build_dir %>/assets/fonts',
          extensionsDir: 'compass_extensions',
          environment: 'development',
          relativeAssets: true
        }
      },
      prod: {
        options: {
          force: true,
          cssDir: '<%= compile_dir %>/css',
          imagesDir: '<%= compile_dir %>/assets',
          fontsDir: '<%= compile_dir %>/assets/fonts',
          environment: 'production'
        }
      }
    },

    // Grunt Autoprefixer
    // Parses CSS and adds vendor-prefixed CSS properties using the Can I Use database.
    // https://github.com/nDmitry/grunt-autoprefixer
    autoprefixer: {
        build: {
            src: '<%= build_dir %>/css/**/*.css',
        },
        dist: {
            src: '<%= compile_dir %>/css/**/*.css',
        }
    },

    // sass: {
    //     dev: {
    //         options: {
    //             'sourcemap': true,
    //             'style': 'expanded',
    //             'compass': true,
    //             'lineNumbers': true,
    //         },
    //         files: {
    //             '<%= build_dir %>/css/app.css': 'src/sass/app.scss'
    //         }
    //     },
    //     prod: {
    //         options: {
    //             'style': 'compressed',
    //             'compass': true
    //         },
    //         files: {
    //             '<%= compile_dir %>/css/app.css': 'src/sass/app.scss'
    //         }
    //     }
    // },

    copy: {
        build_vendor: {
            files: [
                {
                    src: '<%= vendor_files.common %>',
                    dest: '<%= build_dir %>/vendor/common',
                    expand: true,
                    flatten: true
                },
            ]
        },
      build_assets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= build_dir %>/assets/',
            cwd: 'src/assets',
            expand: true
          }
       ]
      },
      build_partials: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= build_dir %>/partials/',
            cwd: 'src/partials',
            expand: true
          }
       ]
      },
      build_data: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= build_dir %>/data/',
            cwd: 'src/data',
            expand: true
          }
       ]
      },
      build_appjs: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= build_dir %>/js',
            cwd: 'src/js',
            expand: true
          }
        ]
      },
      compile_assets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= compile_dir %>/assets',
            cwd: '<%= build_dir %>/assets',
            expand: true
          }
        ]
      },
      compile_data: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= compile_dir %>/data',
            cwd: '<%= build_dir %>/data',
            expand: true
          }
        ]
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: 'bin/assets',                   // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
          dest: 'bin/assets'                  // Destination path prefix
        }]
      }
    },



    // Grunt Modernizr
    // Sifts through your project files, gathers up your references to Modernizr tests and outputs a lean, mean Modernizr machine.
    // https://github.com/Modernizr/grunt-modernizr
    modernizr: {
        dist: {
            devFile: 'modernizr/modernizr.js',
            outputFile: '<%= compile_dir %>/js/modernizr.js',
            extra : {
                // Only need shiv if we've supporting IE < 9
                "shiv" : false,
            },
            extensibility : {
                "addtest" : false,
                "prefixed" : true,
                "teststyles" : false,
                "testprops" : true,
                "testallprops" : true,
                "hasevents" : false,
                "prefixes" : false,
                "domprefixes" : false
            },
            parseFiles: true,
            files: {
                src: ['<%= build_dir %>/js/**/*.js', '<%= build_dir %>/css/**/*.css']
            }
        }
    }

  };

    grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

    grunt.renameTask( 'watch', 'delta' );
    grunt.registerTask( 'watch', [ 'build', 'delta' ] );
    grunt.registerTask( 'default', [ 'build', 'compile' ] );

    grunt.registerTask('build', [
        'jshint', 'clean', 'html2js',
        'copy:build_assets', 'copy:build_data', 'copy:build_appjs', 'copy:build_vendor',
        'copy:build_partials',
        'compass:dev', 'autoprefixer:build', 'htmlbuild:build'
    ]);

    grunt.registerTask('compile', [
        'copy:compile_assets', 'copy:compile_data',
        'ngmin', 'concat', 'imagemin:dist',
        'compass:prod', 'modernizr', 'htmlbuild:compile'
    ]);
};
