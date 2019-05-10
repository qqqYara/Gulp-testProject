var gulp = require('gulp');
// подключаем gulp-sass
var sass = require('gulp-sass');
var browserSync = require('browser-sync');

var useref = require('gulp-useref');
// minify JS
var uglify = require('gulp-uglify');
// minify CSS
var minifyCSS = require('gulp-minify-css');
// другие подключения...
var gulpIf = require('gulp-if');
// optimize Images
var imagemin = require('gulp-imagemin');

var del = require('del');


gulp.task('task-name', function() {
  // код
});

gulp.task('hello', function() {
  console.log('Hello Zell');
});

// ------------------------
// gulp.task('sass', function(){
//   return gulp.src('source-files')
//  .pipe(sass()) // используем gulp-sass
//  .pipe(gulp.dest('destination'))
// });
// ------------------------
// gulp.task('sass', function(){
//   return gulp.src('app/scss/styles.scss')
//  .pipe(sass()) // Конвертируем Sass в CSS с помощью gulp-sass
//  .pipe(gulp.dest('app/css'))
// });
// ------------------------
// *.scss: Символ * совпадает с любым шаблоном в текущей директории.
// В нашем случае мы ищем все файлы с окончанием .scss в корневой папке project.

// **/*.scss: Это более продвинутый шаблон, который ищет файлы 
// с окончанием .scss в корне и всех дочерних папках.

// !not-me.scss: Символ ! указывает, что Gulp исключит из результата совпадений определенный файл.
// В нашем случае исключен будет not-me.scss.

// *.+(scss|sass): Знак + и круглые скобки () помогают создавать множественные шаблоны, шаблоны разделяются символом |.
// В нашем случае Gulp найдет все файлы с окончанием .scss или .sass в корневой папке.
// gulp.task('sass', function() {
//   return gulp.src('app/scss/**/*.scss') // Получаем все файлы с окончанием .scss в папке app/scss и дочерних директориях
//  .pipe(sass())
//  .pipe(gulp.dest('app/css'))
// })
// ------------------------
gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
 .pipe(sass())
 .pipe(gulp.dest('app/css'))
 .pipe(browserSync.reload({
 stream: true
 }))
});
// ------------------------
// ------------------------

// Gulp watch

// gulp.task('watch', function(){
//   gulp.watch('app/scss/**/*.scss', gulp.series('sass')); 
//   // другие ресурсы
// })

gulp.task('browserSync', function() {
  browserSync({
 server: {
 baseDir: 'app'
 },
  })
})

gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/scss/**/*.scss', gulp.series('sass')); 
  // другие ресурсы
})

gulp.task('useref', function(){
  var assets = useref.assets();

  return gulp.src('app/*.html')
 .pipe(assets)
 // Минифицируем только CSS файлы
 .pipe(gulpIf('*.css', minifyCSS()))
 // Uglifies only if it's a Javascript file
 .pipe(gulpIf('*.js', uglify()))
 .pipe(assets.restore())
 .pipe(useref())
 .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(cashe(imagemin({
 
 interlaced: true
 })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

// Clean
gulp.task('clean:dist', function(callback){
  del(['dist/**/*', '!dist/images', '!dist/images/**/*'], callback)
});

gulp.task('clean', function(callback) {
  del('dist');
  return cache.clearAll(callback);
})

var runSequence = require('run-sequence');

// gulp.task('task-name', function(callback) {
//   runSequence('task-one', ['tasks','two','run','in','parallel'], 'task-three', callback);
// });

gulp.task('build', function (callback) {
  runSequence('clean:dist', 
 ['sass', 'useref', 'images', 'fonts'],
 callback
  )
})

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
 callback
  )
})