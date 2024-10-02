import gulp from "gulp";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import fileInclude from "gulp-file-include";
import htmlmin from "gulp-htmlmin";
import concat from "gulp-concat";

import autoprefixer from "gulp-autoprefixer";
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
//import sass from 'gulp-sass')(require('sass'));

import cleancss from 'gulp-clean-css';
import imagemin from 'gulp-imagemin';
import newer from 'gulp-newer';

import size from "gulp-size";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import del from "del";
//const mediaqueries = require("gulp-group-css-media-queries"); // устарел!

import babel from "gulp-babel";
import uglify from "gulp-uglify";

//browserSync = require("browser-sync").create();
import browserSync from "browser-sync";


const srcPath = "./src/";
const distPath = "./public/";

const path = {
    build: {
        //html: distPath +"html/",
        html: distPath,
        css: distPath + "css/",
        js: distPath + "js/",
        img: distPath + "img/",
        fonts: distPath + "fonts/"
    },
    src: {
        //html: srcPath + "*.html",
        html: srcPath + "html/*.html",
        css: srcPath + "scss/*.scss",
        //css: [{ "./src/scss/style.scss" }, { "./src/scss/style2.scss" }],
        js: srcPath + "js/*.js",
        img: srcPath + "img/**/*.{jpeg,png,svg,webp,jpg,gif,ico,xml,json}",
        fonts: srcPath + "fonts/**/*.{otf,eot,woff,woff2,ttf,svg}"
    },
    watch: {
        html: srcPath + "html/**/*.html",
        css: srcPath + "scss/**/*.scss",
        js: srcPath + "js/**/*.js",
        img: srcPath + "img/**/*.{jpeg,png,svg,webp,jpg,gif,ico,xml,json}",
        fonts: srcPath + "fonts/**/*.{otf,eot,woff,woff2,ttf,svg}"
    },
    //clean: "./" + distPath
    clean: distPath

}



// Обработка html
export const html = () => {
    return gulp.src(path.src.html)

    .pipe(plumber({
        errorHandler: function(err) {
            notify.onError({
                title: "Ошибка в html",
                message: "<%= error.message %>"
            })(err);
        }
    }))

    .pipe(fileInclude())
        .pipe(size())
        .pipe(gulp.dest("./public"))

    //min
    .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(size())

    .pipe(rename({
        suffix: ".min",
        extname: ".html"
    }))

    .pipe(gulp.dest("./public"))
        .pipe(browserSync.stream());
}



// Обработка css

export const css = () => {
    //return gulp.src(path.src.css)
    return gulp.src(["./src/scss/style.scss", "./src/scss/style2.scss"])
        .pipe(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title: "Ошибка в css",
                    message: "<%= error.message %>"
                })(err);
            }
        }))

    .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat("style.css"))
        .pipe(autoprefixer())

    .pipe(size())
        .pipe(gulp.dest(path.build.css))
        //min
        .pipe(cleancss({ level: { 2: { specialComments: 0 } } /* , format: 'beautify' */ }))
        //.pipe(cleancss({ level: 2 /* , format: 'beautify' */ })) // если нужен объёмный код - раскомментируй: /* , format: 'beautify' */

    .pipe(size())
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(sourcemaps.write()) // настройка в самом gulp
        // .pipe(gulp.dest("./public/css"))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream());
}

// Обработка JavaScript
export const js = () => {
    return gulp.src(["./src/js/components/popup.js", "./src/js/components/slider.js", "./src/js/index.js", "./src/js/2.js"])

    .pipe(plumber({
        errorHandler: function(err) {
            notify.onError({
                title: "Ошибка в js",
                message: "<%= error.message %>"
            })(err);
        }
    }))

    .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(size())
        //.pipe(rigger()) // сборка нескольких файлов в один
        .pipe(concat('all.js'))
        //.pipe(gulp.dest("./public/css"))
        .pipe(gulp.dest(path.build.js))

    //min
    .pipe(uglify())
        .pipe(size())
        .pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(sourcemaps.write()) // настройка в самом gulp
        // .pipe(gulp.dest("./public/js"))
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
}

// Обработка изображений
export const img = () => {
    return gulp.src(path.src.img, {
        encoding: false
    })

    .pipe(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title: "Ошибка в img",
                    message: "<%= error.message %>"
                })(err);
            }
        }))
        .pipe(newer(path.build.img))

    .pipe(gulp.dest(path.build.img))

    .pipe(gulp.src(path.src.img, {
        encoding: false
    }))

    .pipe(newer(path.build.img))

    .pipe(imagemin([
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),

        ], {
            verbose: true
        }

    ))

    // .pipe(gulp.dest("./public/js"))
    .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream());
}


// Обработка шрифтов
export const fonts = () => {
    return gulp.src(path.src.fonts)

    .pipe(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title: "Ошибка в fonts",
                    message: "<%= error.message %>"
                })(err);
            }
        }))
        .pipe(newer(path.build.fonts))

    .pipe(gulp.dest(path.build.fonts))

    .pipe(browserSync.stream());
}

// очистка
export const clear = () => {
    return del(path.clean)
}

// live server
export const server = () => {
    browserSync.init({
        server: {
            baseDir: distPath
        },
        port: 3000,
        notify: false
    })
}

// отслеживание

export const watcher = () => {
    gulp.watch(path.watch.html, html);
    gulp.watch(path.src.css, css);
    gulp.watch(path.src.js, js);
    gulp.watch(path.src.img, img);
    gulp.watch(path.src.fonts, fonts);
}


/* const dev = gulp.series(clear, html, img, fonts, css, js, gulp.parallel(watcher, server)); */

/* exports.html = html; */

/* exports.css = css;
exports.js = js;
exports.img = img;
exports.fonts = fonts; */



/* exports.watcher = watcher;
exports.clear = clear;
exports.server = server; */



// exports.dev = dev;




/* exports.default =
    gulp.series(clear, html, img, fonts, css, js, gulp.parallel(watcher, server)); 
*/


//export default gulp.series(clear, html, gulp.parallel(watcher, server));
export default gulp.series(clear, html, img, fonts, css, js, gulp.parallel(watcher, server));


/* exports.default = dev; */