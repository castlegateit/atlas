// jshint node: true, esversion: 6

// Strict mode
'use strict';

// Configuration
const config = {
    paths: {
        src: {
            css: './src/scss/atlas.scss',
            cssBundle: './src/scss/atlas-bundle.scss',
            cssAll: './src/scss/**/*.scss',
            js: [
                './src/js/atlas.js',
                './src/js/**/*.js'
            ],
            jsBundle: [
                './node_modules/jquery/dist/jquery.js',
                './node_modules/bootstrap/dist/js/bootstrap.js',
                './src/js/atlas.js',
                './src/js/**/*.js'
            ],
            jsAll: './src/js/**/*.js'
        },
        dest: {
            css: './dist/css',
            js: './dist/js'
        }
    },
    plugins: {
        autoprefixer: {
            remove: false
        },
        rename: {
            suffix: '.min'
        },
        sass: {
            includePaths: [
                '.'
            ],
            outputStyle: 'nested'
        }
    }
};

// Modules
const del = require('del');
const gulp = require('gulp');

// Plugins
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const csso = require('gulp-csso');
const filter = require('gulp-filter');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// Tasks
function cssCleanTask()
{
    return del(config.paths.dest.css);
}

function jsCleanTask() {
    return del(config.paths.dest.js);
}

function cssBundleCompileTask() {
    return gulp.src(config.paths.src.cssBundle)
        .pipe(plumber())

        // Create map(s) and write uncompressed development version
        .pipe(sourcemaps.init())
        .pipe(sass(config.plugins.sass).on('error', sass.logError))
        .pipe(autoprefixer(config.plugins.autoprefixer))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.paths.dest.css))

        // Remove map(s) and write compressed production version
        .pipe(filter('**/*.css'))
        .pipe(rename(config.plugins.rename))
        .pipe(csso())
        .pipe(gulp.dest(config.paths.dest.css));
}

function jsCompileTask() {
    return gulp.src(config.paths.src.js)
        .pipe(plumber())

        // Create map(s) and write uncompressed development version
        .pipe(sourcemaps.init())
        .pipe(concat('atlas.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.paths.dest.js))

        // Remove map(s) and write compressed production version
        .pipe(filter('**/*.js'))
        .pipe(rename(config.plugins.rename))
        .pipe(uglify())
        .pipe(gulp.dest(config.paths.dest.js));
}

function jsBundleCompileTask() {
    return gulp.src(config.paths.src.jsBundle)
        .pipe(plumber())

        // Create map(s) and write uncompressed development version
        .pipe(sourcemaps.init())
        .pipe(concat('atlas-bundle.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.paths.dest.js))

        // Remove map(s) and write compressed production version
        .pipe(filter('**/*.js'))
        .pipe(rename(config.plugins.rename))
        .pipe(uglify())
        .pipe(gulp.dest(config.paths.dest.js));
}

function watchTask() {
    gulp.watch(config.paths.src.cssAll, cssTask);
    gulp.watch(config.paths.src.jsAll, jsTask);
}

const cssTask = gulp.series(cssCleanTask, cssBundleCompileTask);
const jsTask = gulp.series(jsCleanTask, gulp.parallel(jsCompileTask, jsBundleCompileTask));

const build = gulp.parallel(cssTask, jsTask);
const watch = gulp.parallel(build, watchTask);

// Public tasks
exports.default = build;
exports.watch = watch;
