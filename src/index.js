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

// Joins path segments.  Preserves initial "/" and resolves ".." and "."
// Does not support using ".." to go above/outside the root.
// This means that join("foo", "../../bar") will not resolve to "../bar"
export function join(/* path segments */) {
  // Split the inputs into a list of path commands.
  var parts = [];
  for (var i = 0, l = arguments.length; i < l; i++) {
    parts = parts.concat(arguments[i].split("/"));
  }
  // Interpret the path commands to get the new resolved path.
  var newParts = [];
  for (i = 0, l = parts.length; i < l; i++) {
    var part = parts[i];
    // Remove leading and trailing slashes
    // Also remove "." segments
    if (!part || part === ".") continue;
    // Interpret ".." to pop the last segment
    if (part === "..") newParts.pop();
    // Push new path segments.
    else newParts.push(part);
  }
  // Preserve the initial slash if there was one.
  if (parts[0] === "") newParts.unshift("");
  // Turn back into a single string path.
  return newParts.join("/") || (newParts.length ? "/" : ".");
}