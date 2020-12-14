"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");      // Pour prefixer les CSS
const browsersync = require("browser-sync").create();   // Pour actualiser automatiquement le navigateur. (Live reload)
const cleanCSS = require("gulp-clean-css");             // Pour minifier les CSS
const del = require("del");                             // Pour effacer les fichiers et dossiers
const gulp = require("gulp");
const header = require("gulp-header");
const concat = require('gulp-concat');
const merge = require("merge-stream");                  // Pour fusionner un groupe de flux.
const plumber = require("gulp-plumber");                // Pour empêcher la rupture des pipe causée par des erreurs de plugins Gulp
const pug = require('gulp-pug');                        // Pour utiliser PUG
const rename = require("gulp-rename");                  // Pour renommer fichiers et dossiers
const sass = require("gulp-sass");                      // Pour l'utilisation de SASS
const uglify = require("gulp-uglify");                  // Pour minifier Javascript
const htmlbeautify = require('gulp-html-beautify');

// Load package.json for banner
const pkg = require('./package.json');

// Set the banner content
const banner = ['/*!\n',
  ' * CRD - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2020-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' */\n',
  '\n'
].join('');

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
    },
    port: 3000
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean vendor
function clean() {
  return del(["./assets/vendor/"]);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  return gulp
    .src([
      './node_modules/gsap/dist/gsap.js',
      './node_modules/flickity/dist/flickity.pkgd.js',
      './node_modules/flickity-imagesloaded/flickity-imagesloaded.js',
      './node_modules/headroom.js/dist/headroom.js',
      './node_modules/rellax/rellax.js',
    ])
    
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    .pipe(browsersync.stream());

}

// HTML task
function html() {
  return gulp
    .src('assets/pug/pages/*.pug')
    .pipe(pug({
      pretty: true // désactive la minification
    }))
    .pipe(htmlbeautify({
      "indent_size": 2
    }))
    .pipe(gulp.dest('./'))
    .pipe(browsersync.stream());
} 

// CSS task
function css() {
  return gulp
    .src("./assets/scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest("./dist/css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./dist/css"))
    .pipe(browsersync.stream());
}

// JS task
function js() {
  return gulp
    .src('./assets/js/*.js')
    .pipe(concat('scripts.js'))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest('./dist/js'))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(uglify())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
  gulp.watch("./assets/pug/**/*", html);
  gulp.watch("./assets/scss/**/*", css);
  gulp.watch(["./assets/js/**/*", "!./assets/js/**/*.min.js"], js);
  gulp.watch("./**/*.html", browserSyncReload);
}

// Define complex tasks
const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor, gulp.parallel(html, css, js));
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.html = html;
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;
