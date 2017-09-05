var gulp = require('gulp');

// 公用util
var browserSync = require('browser-sync'); // 自动刷新
var plumber = require('gulp-plumber'); // gulp 错误处理
var rename = require('gulp-rename'); // 文件重命名

// CSS相关
var postcss = require('gulp-postcss');
var htmlmin = require('gulp-htmlmin');      //  压缩html
var minifycss = require('gulp-minify-css'); //  压缩CSS
var uglify = require('gulp-uglify');        //  压缩js
var imagemin = require('gulp-imagemin');    //  压缩图片
var babel = require('gulp-babel');          //  ES6 转 ES5
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var extend = require('postcss-simple-extend');
var mixins = require('postcss-sassy-mixins');
var comment = require('postcss-inline-comment');
var scss = require('postcss-scss');
var stripInlineComments = require('postcss-strip-inline-comments');

// build 使用
var runSequence = require('run-sequence'); // 另一个任务同步处理工具
var del = require('del'); // 删除文件专用
var zip = require('gulp-zip');

function buildCss() {
    var postCssPlugins = [
        precss,
        autoprefixer({
            browsers: ['> 1%', 'IE > 8', 'Android >= 1.6', 'iOS >= 1.0']
        }),
        stripInlineComments
    ];

    gulp.src('./scss/style.scss')
        .pipe(plumber())
        .pipe(postcss(postCssPlugins, {syntax: scss}))
        .pipe(rename(function (path) {
            path.extname = '.css';
        }))
        .pipe(gulp.dest('./css'));
}

gulp.task('browserSync', function () {
    browserSync.init({
        port: 8080,
        server: {
            baseDir: './',
            index: 'link.html'
        }
    });

    browserSync.watch('./css/*.css').on('change', browserSync.reload);
    browserSync.watch('./js/*.js').on('change', browserSync.reload);
    browserSync.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('scss', function () {
    buildCss();
    gulp.watch('scss/*/*.scss', function () {
        buildCss();
    });
});

gulp.task('default', ['browserSync', 'scss']);

// ---------- 下面是编译所有的 gulp处理工具 --------- 下面的先不看还没有完成

// 清空build目录
gulp.task('clean', function (cb) {
    return del([
        './dist/**/*'
    ], cb);

});

// 只编译css 不监听
gulp.task('css:build', function () {
    buildCss();
});

// 移动img html js css
gulp.task('file:copy', function () {
    // 复制 html
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('./*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./dist'));

    // 复制 js
    gulp.src( './js/**/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));

    // 复制 img
    gulp.src('./img/**/*.{png,jpg,gif,ico,svg}')
        .pipe(imagemin({
            optimizationLevel: 5,   //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true,      //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true,       //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true         //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('./dist/img'));

    // 复制 css
    gulp.src('./css/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('zip', function () {
    gulp.src(['./dist/*', './dist/**/*'])
        .pipe(zip('sae.zip'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', function () {
    // 复制 html
    runSequence('clean', ['css:build'], 'file:copy', function () {
        console.log('build down!');
    });
});
