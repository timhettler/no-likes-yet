# Angular Project Boilerplate

## Dependencies

* [Node.js](http://nodejs.org/)
* [NPM](https://npmjs.org/) (Node Package Manager)
* [Grunt](http://gruntjs.com/) (JavaScript Task Runner)
* [Bower](http://bower.io/) (Web Package manager)
* [Sass](http://sass-lang.com/) (CSS Preprocessor)
* [Compass](http://compass-style.org/) (CSS Authoring Framework)

## Nice to Have

* [EditorConfig](http://editorconfig.org/) - EditorConfig helps developers define and maintain consistent coding styles between different editors and IDEs.

## Getting started

### Update Project Info

Edit the **meta.title** & **meta.description** fields in `build.config.js`. These values are used for the TITLE & META DESCRIPTION in your project's HTML file.

### Install Dependencies

Run the follow from the root of this project:

    $ npm install
    $ bower install

## Get to Work

Start the Grunt watch command:

    $ grunt watch

This will automatically rebuild the project in the `build` directory when changes are detected in the `src` directory.

## Adding Dependencies

When installing a new dependency via NPM or Bower, make sure to use the `--save` or `--save-dev` flag so that `package.json` or `bower.json` is updated.

When adding a new JavaScript dependency, you must update the `vendor_files.js` object in `build.config.js` to include the main file of the new dependency.

## Packages Not Included But May Prove Useful in Certain Circumstances

* [ng-touch](https://github.com/angular/bower-angular-touch) - The ngTouch module provides touch events and other helpers for touch-enabled devices.
