var gulp = require('gulp');
var del = require('del');
var connect = require('gulp-connect');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var eslint = require('gulp-eslint');

var config = {
	// Port number under 1024 on linux requires root privileges
	port: 8080,
	url: 'http://localhost',
	paths: {
		src: {
			js: {
				libs: [
					'./sources/scripts/lib/jquery-2.2.0.min.js',
					'./sources/scripts/lib/jquery.onepage-scroll.min.js'
				],
				scripts: [
					'./sources/scripts/portfolio.js'
				]
			},
			media: {
				icons: [
					'./sources/media/icons/*.png',
					'./sources/media/icons/*.ico'
				],
				images: [
					'./sources/media/images/*.png',
					'./sources/media/images/*.jpg',
					'./sources/media/images/*.jpeg',
					'./sources/media/images/*.gif',
					'./sources/media/images/*.svg',
					'./sources/media/images/*.svgz'
				]
			},
			scss: [
				'./sources/styles/stylesheet.scss'
			]
		},
		dest: {
			js: {
				libs: './scripts/lib',
				scripts: './scripts'
			},
			media: {
				icons: './media/icons',
				images: './media/images'
			},
			scss: './styles'
		}
	}
}

// Clean the folders so we start fresh!
// Info: https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md
gulp.task('Cleanup', function() {
	return del([
		'./scripts/*',
		'./styles/*',
		'./media/*'
	]);
});

// Server task
gulp.task('Local web server', function() {
	connect.server({
		// root: ['./'],
		port: config.port,
		base: 'http://127.0.0.1',
		livereload: true
	});
});

// Process javascript libraries task
gulp.task('Process JS libraries', function() {
	config.paths.src.js.libs.map(function(lib) {
		gulp.src(lib).pipe(gulp.dest(config.paths.dest.js.libs)).pipe(connect.reload());
	});
});

// Transpile the main scripts via babel / ES2015
// Info: https://www.npmjs.com/package/gulp-babel
gulp.task('Transpile JS', function() {
	config.paths.src.js.scripts.map(function(script) {
		gulp.src(script)
			.pipe(babel({ presets: ['es2015'] }))
			.on('error', console.error.bind(console))
			.pipe(gulp.dest(config.paths.dest.js.scripts))
			.pipe(connect.reload());
	});
});

// Lint the JS files. Rules -> eslint-rules.json
gulp.task('Lint JS', function() {
	config.paths.src.js.scripts.map(function(script) {
		gulp.src(script)
			.pipe(eslint({ config: 'eslint-rules.json'}))
			.pipe(eslint.format())
			.pipe(connect.reload());
	});
});

// Process all the images, basically just move them, as for this project we are using
// already compressed svgz images, there is no need to do anything to them
gulp.task('Process Media', function() {
	config.paths.src.media.icons.map(function(icon) {
		gulp.src(icon).pipe(gulp.dest(config.paths.dest.media.icons)).pipe(connect.reload());
	});
	config.paths.src.media.images.map(function(image) {
		gulp.src(image).pipe(gulp.dest(config.paths.dest.media.images)).pipe(connect.reload());
	});
});

// Preprocess the SCSS stylesheets
// Info: https://www.npmjs.com/package/gulp-sass
gulp.task('Preprocess SCSS', function() {
	config.paths.src.scss.map(function(style) {
		gulp.src(style)
			.pipe(sass())
			.on('error', sass.logError)
			.pipe(gulp.dest(config.paths.dest.scss))
			.pipe(connect.reload());
	});
});

// Watch for changes
gulp.task('File watcher', function() {
	config.paths.src.js.libs.map(function(lib) {
		gulp.watch(lib, ['Process JS libraries']);
	});
	config.paths.src.js.scripts.map(function(script) {
		gulp.watch(script, ['Transpile JS', 'Lint JS']);
	});
	config.paths.src.media.icons.map(function(icon) {
		gulp.watch(icon, ['Process Media']);
	});
	config.paths.src.media.images.map(function(image) {
		gulp.watch(image, ['Process Media']);
	});
	config.paths.src.scss.map(function(style) {
		gulp.watch(style, ['Preprocess SCSS']);
	});
});

// Default task
gulp.task(
	'default',
	[
		'Process JS libraries',
		'Transpile JS',
		'Lint JS',
		'Process Media',
		'Preprocess SCSS',
		'Local web server',
		'File watcher'
	]
);
