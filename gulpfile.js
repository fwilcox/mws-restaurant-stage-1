/*eslint-env node */
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine-phantom');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('imagemin');
var imageminPngquant = require('imagemin-pngquant');
var cssnano = require('gulp-cssnano');

gulp.task('default', ['copy-html', 'copy-images', 'copy-sw', 'styles', 'lint'], function() {
	gulp.watch('css/**/*.css', ['styles']);
	gulp.watch('js/**/*.js', ['lint']);
	gulp.watch('/index.html', ['copy-html']);
	gulp.watch('/restaurant.html', ['copy-html']);
	gulp.watch('./dist/index.html').on('change', browserSync.reload);

	browserSync.init({
		server: './dist'
	});
	gulp.watch('./dist/restaurant.html').on('change', browserSync.reload);

	browserSync.init({
		server: './dist'
	});
});

gulp.task('dist', [
	'copy-html',
	'copy-images',
	'styles',
	'lint',
	'scripts'
]);

gulp.task('scripts', function() {
	gulp.src('js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('copy-html', function() {
	gulp.src('./*.html')
		.pipe(gulp.dest('./dist'));
});

gulp.task('copy-sw', function() {
	gulp.src('./sw.js')
		.pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function() {
	gulp.src('img/*')
		.pipe(gulp.dest('dist/img'));
});

gulp.task('styles', function() {
	gulp.src('css/**/*.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(sourcemaps.init())
		.pipe(cssnano())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('image-optimize', function() {
	imagemin(['img/*'],
		'dist/img',
		{
			use: [imageminPngquant()]
		});
});

gulp.task('lint', function() {
	return gulp.src(['js/**/*.js'])
	// eslint() attaches the lint output to the "eslint" property
	// of the file object so it can be used by other modules.
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failAfterError last.
		.pipe(eslint.failAfterError());
});

gulp.task('tests', function() {
	gulp.src('tests/spec/extraSpec.js')
		.pipe(jasmine({
			integration: true,
			vendor: 'js/**/*.js'
		}));
});






