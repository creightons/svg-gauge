var gulp = require('gulp'),
	gutil = require('gulp-util'),
	sourcemaps = require('gulp-sourcemaps'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	watchify = require('watchify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer')
;

var rootFile = 'js/index.js';

gulp.task('buildjs', function() {
	return browserify({
		entries: rootFile,
		debug: true
	})
		.transform('babelify', {
			presets: ['es2015']
		})
		.bundle()
		.pipe(source('build.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public'));
});

gulp.task('watchjs', function() {
	var bundler = watchify(
		browserify(
			{
				entries: rootFile,
				debug: true,
			},
			watchify.args
		)
	);
	
	bundler.transform('babelify', {
		presets: ['es2015']
	});
	bundler.on('update', rebundle);
	
	function rebundle() {
		var start = Date.now();
		return bundler.bundle()
			.on('error', function(err) {
				gutil.log(
					gutil.colors.red(err.toString())
				);
			})
			.on('end', function() {
				gutil.log(
					gutil.colors.green(
						'Finished rebundling in ', (Date.now() - start) + 'ms'
					)
				);
			})
			.pipe(source('build.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({ loadMaps: true }))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('public'));
	}
	
	return rebundle();
});

gulp.task('default', ['watchjs']);