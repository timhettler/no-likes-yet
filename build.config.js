module.exports = {

    build_dir: 'build',
    compile_dir: 'bin',

    meta: {
        title: 'No Likes Yet',
        description: 'Discover all the photos on Instagram with no likes yet.',
        viewport: 'width=device-width, initial-scale=1, user-scalable=no',
        url: '',
        image: ''
    },

    app_files: {
        js: ['src/js/**/*.js'],
        atpl: [ 'src/templates/*.tpl.html' ],
        html: ['src/*.html'],
    },
};
