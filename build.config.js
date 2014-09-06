module.exports = {

    build_dir: 'build',
    compile_dir: 'bin',

    meta: {
        title: 'No likes yet.',
        description: 'Discover all the photos on Instagram with no likes yet.',
        viewport: 'width=device-width, initial-scale=1, user-scalable=no, minimal-ui'
    },

    app_files: {
        js: ['src/js/**/*.js'],
        atpl: [ 'src/templates/*.tpl.html' ],
        html: ['src/*.html'],
    },

    vendor_files: {
        common: [
            'modernizr/modernizr.js',
            'modernizr/detectizr.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-cookie/angular-cookie.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-touch/angular-touch.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
            'bower_components/fastclick/lib/fastclick.js',
            'bower_components/moment/moment.js'
        ]
    }
};
