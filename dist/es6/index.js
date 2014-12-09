export function normalize(name, baseName){
  var lastIndex,
      normalizedBaseParts,
      baseParts = (baseName && baseName.split('/'));

  name = name.trim();
  name = name.split('/');

  if (name[0].charAt(0) === '.' && baseParts) {
      //Convert baseName to array, and lop off the last part,
      //so that . matches that 'directory' and not name of the baseName's
      //module. For instance, baseName of 'one/two/three', maps to
      //'one/two/three.js', but we want the directory, 'one/two' for
      //this normalization.
      normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
      name = normalizedBaseParts.concat(name);
  }

  trimDots(name);

  return name.join('/');
}

function trimDots(ary) {
  var i, part;
  for (i = 0; i < ary.length; i++) {
      part = ary[i];
      if (part === '.') {
          ary.splice(i, 1);
          i -= 1;
      } else if (part === '..') {
          // If at the start, or previous value is still ..,
          // keep them so that when converted to a path it may
          // still work when converted to a path, even though
          // as an ID it is less than ideal. In larger point
          // releases, may be better to just kick out an error.
          if (i === 0 || (i == 1 && ary[2] === '..') || ary[i - 1] === '..') {
              continue;
          } else if (i > 0) {
              ary.splice(i - 1, 2);
              i -= 2;
          }
      }
  }
}