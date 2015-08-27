function trimDots(ary: string[]): void {
  for (let i = 0; i < ary.length; ++i) {
    let part = ary[i];
    if (part === '.') {
      ary.splice(i, 1);
      i -= 1;
    } else if (part === '..') {
      // If at the start, or previous value is still ..,
      // keep them so that when converted to a path it may
      // still work when converted to a path, even though
      // as an ID it is less than ideal. In larger point
      // releases, may be better to just kick out an error.
      if (i === 0 || (i === 1 && ary[2] === '..') || ary[i - 1] === '..') {
        continue;
      } else if (i > 0) {
        ary.splice(i - 1, 2);
        i -= 2;
      }
    }
  }
}

export function relativeToFile(name: string, file: string): string {
  let fileParts = file && file.split('/');
  let nameParts = name.trim().split('/');

  if (nameParts[0].charAt(0) === '.' && fileParts) {
    //Convert file to array, and lop off the last part,
    //so that . matches that 'directory' and not name of the file's
    //module. For instance, file of 'one/two/three', maps to
    //'one/two/three.js', but we want the directory, 'one/two' for
    //this normalization.
    let normalizedBaseParts = fileParts.slice(0, fileParts.length - 1);
    nameParts.unshift(...normalizedBaseParts);
  }

  trimDots(nameParts);

  return nameParts.join('/');
}

export function join(path1: string, path2: string): string {
  if (!path1) {
    return path2;
  }

  if (!path2) {
    return path1;
  }

  let urlPrefix;
  if (path1.indexOf('//') === 0) {
    urlPrefix = '//';
  } else if (path1.indexOf('/') === 0) {
    urlPrefix = '/';
  } else {
    urlPrefix = '';
  }

  let trailingSlash = path2.slice(-1) === '/' ? '/' : '';

  let url1 = path1.split('/');
  let url2 = path2.split('/');
  let url3 = [];

  for (let i = 0, ii = url1.length; i < ii; ++i) {
    if (url1[i] === '..') {
      url3.pop();
    } else if (url1[i] === '.' || url1[i] === '') {
      continue;
    } else {
      url3.push(url1[i]);
    }
  }

  for (let i = 0, ii = url2.length; i < ii; ++i) {
    if (url2[i] === '..') {
      url3.pop();
    } else if (url2[i] === '.' || url2[i] === '') {
      continue;
    } else {
      url3.push(url2[i]);
    }
  }

  return urlPrefix + url3.join('/').replace(/\:\//g, '://') + trailingSlash;
}

export function buildQueryString(a: Object, traditional?: boolean): string {
  let s = [];

  function add(key: string, value: any) {
    // If value is a function, invoke it and return its value
    let v = value;
    if (typeof value === 'function') {
      v = value();
    } else if (value === null || value === undefined) {
      v = '';
    }

    s.push(encodeURIComponent(key) + '=' + encodeURIComponent(v));
  }

  for (let prefix in a) {
    _buildQueryString(prefix, a[prefix], traditional, add);
  }

  // Return the resulting serialization
  return s.join('&').replace(r20, '+');
}

function _buildQueryString(prefix: string, obj: any, traditional: boolean, add: (p: string, v: any) => void): void {
  if (Array.isArray(obj)) {
    // Serialize array item.
    obj.forEach((v, i) => {
      if (traditional || rbracket.test(prefix)) {
        // Treat each array item as a scalar.
        add(prefix, v);
      } else {
        // Item is non-scalar (array or object), encode its numeric index.
        let innerPrefix = prefix + '[' + (typeof v === 'object' ? i : '') + ']';
        _buildQueryString(innerPrefix, v, traditional, add);
      }
    });
  } else if (!traditional && type(obj) === 'object') {
    // Serialize object item.
    for (let name in obj) {
      _buildQueryString(prefix + '[' + name + ']', obj[name], traditional, add);
    }
  } else {
    // Serialize scalar item.
    add(prefix, obj);
  }
}

const r20 = /%20/g;
const rbracket = /\[\]$/;
const class2type = {};

'Boolean Number String Function Array Date RegExp Object Error'
  .split(' ')
  .forEach((name) => {
    class2type['[object ' + name + ']'] = name.toLowerCase();
  });

function type(obj: any) {
  if (obj === null || obj === undefined) {
    return obj + '';
  }

  // Support: Android<4.0 (functionish RegExp)
  return typeof obj === 'object' || typeof obj === 'function'
    ? class2type[toString.call(obj)] || 'object'
    : typeof obj;
}
