module.exports = {

    build_dir: 'build',
    compile_dir: 'bin',

    meta: {
        title: '',
        description: '',
        viewport: 'width=device-width, initial-scale=1, user-scalable=no'
    },

    app_files: {
        js: ['src/js/**/*.js'],
        atpl: [ 'src/templates/*.tpl.html' ],
        html: ['src/*.html'],
    },
};
