let gulp = require('gulp');

let server = require('gulp-webserver');

let scss = require('gulp-sass');

let fs = require('fs');

let path = require('path');

let url = require('url');

let data = require('./mock/data.json');

gulp.task('server', function () {
    return gulp.src('src')
        .pipe(server({
            port: 8080,
            middleware: function (req, res, next) { 
                var pathname = url.parse(req.url).pathname;

                if (pathname === '/favicon.ico'){
                    res.end();
                    return false;
                }

                if(pathname === '/api/list'){
                    var items = url.parse(req.url).query.val;
                    var map = [];
                    // data.forEach(data.list.match(function (ele) {
                    //     if(data.list === ele){
                    //         map.push(ele);
                    //     }
                    // }))
                    console.log(items);
                    res.end(JSON.stringify({code: 0, msg: "成功", data: data}));
                } else {
                    pathname = pathname === '/'? '/index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }
        }));
});

gulp.task('devCss', function () {
    return gulp.src('./src/scss/*.scss')
        .pipe(scss())
        .pipe(gulp.dest('./src/css'));
});

gulp.task('watch', function () {
    gulp.watch('./src/scss/*.scss', gulp.series('devCss'));
});

gulp.task('dev', gulp.series('server', 'devCss', 'watch'));
