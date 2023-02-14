import gulp from "gulp";
import uglify from "gulp-uglify";
import concat from "gulp-concat";
import stripImportExport from "gulp-strip-import-export";

const WORKING_DIR = "./src/js/bifrost/mapping";

function findOptions(optionName) {
  const index = process.argv.indexOf(`--${optionName}`);
  if (index == -1) {
    return;
  }

  return process.argv[index + 1];
}

gulp.task("minify", function () {
  const mappingName = findOptions("mappingName");
  const method = findOptions("method");
  const MINIFIED_NAME = `${method}.min.js`;
  if (mappingName && method) {
    return gulp
      .src([
        `!${WORKING_DIR}/${mappingName}/${method}.min.js`,
        `${WORKING_DIR}/${mappingName}/${method}.js`,
        `${WORKING_DIR}/*.js`,
      ])
      .pipe(stripImportExport())
      .pipe(concat(MINIFIED_NAME))
      .pipe(uglify())
      .pipe(gulp.dest(`${WORKING_DIR}/${mappingName}/`));
  } else {
    console.error(">> Please insert file to be bundled");
    return gulp.src(".", { allowEmpty: true });
  }
});
