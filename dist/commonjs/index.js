"use strict";

exports.normalize = normalize;
exports.join = join;
function trimDots(ary) {
  var i, part;
  for (i = 0; i < ary.length; i++) {
    part = ary[i];
    if (part === ".") {
      ary.splice(i, 1);
      i -= 1;
    } else if (part === "..") {
      if (i === 0 || (i == 1 && ary[2] === "..") || ary[i - 1] === "..") {
        continue;
      } else if (i > 0) {
        ary.splice(i - 1, 2);
        i -= 2;
      }
    }
  }
}

function normalize(name, baseName) {
  var lastIndex, normalizedBaseParts, baseParts = (baseName && baseName.split("/"));

  name = name.trim();
  name = name.split("/");

  if (name[0].charAt(0) === "." && baseParts) {
    normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
    name = normalizedBaseParts.concat(name);
  }

  trimDots(name);

  return name.join("/");
}

function join() {
  var parts = [];
  for (var i = 0, l = arguments.length; i < l; i++) {
    parts = parts.concat(arguments[i].split("/"));
  }
  var newParts = [];
  for (i = 0, l = parts.length; i < l; i++) {
    var part = parts[i];
    if (!part || part === ".") continue;
    if (part === "..") newParts.pop();else newParts.push(part);
  }
  if (parts[0] === "") newParts.unshift("");
  return newParts.join("/") || (newParts.length ? "/" : ".");
}