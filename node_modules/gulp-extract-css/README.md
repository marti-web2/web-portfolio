# gulp-extract-css

Forked from [gulp-merge-media-queries](https://github.com/aivenreach/gulp-merge-media-queries).

> Move given css scopes to separate files using gulp.

**This plugin has NOT been tested thoroughly.**

## Install
```
npm install gulp-extract-css --save-dev
```

## Usage
```javascript
var ecss = require('gulp-extract-css');

gulp.task('ecss', function () {
  gulp.src('src/**/*.css')
    .pipe(ecss({
      log: true,
      takeout: [
        {
            styleprefix: '.somesubtheme',
            filename: 'somesubtheme.css'
        },
        {
            styleprefix: '.ie9',
            filename: 'outdated.css'
        },
      ]
    }))
    .pipe(gulp.dest('dist'));
});
```

## Options

### log

Type: `boolean` Default: `false`

Get an overview over what's actually happening

### takeout

Type: `array` Default: `[]`

Define the scope of rules to be extracted, and in which file to put the output

## License

(MIT License)

Copyright (c) 2016 [b44rd](https://twitter.com/b44rd)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
