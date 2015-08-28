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


/**
* Generate a query string from an object.
*
* @param params Object containing the keys and values to be used.
* @returns The generated query string, excluding leading '?'.
*/
export function buildQueryString(params: Object): string {
  let pairs = [];
  let keys = Object.keys(params || {}).sort();
  let encode = encodeURIComponent;
  let encodeKey = k => encode(k).replace('%24', '$');

  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i];
    let value = params[key];
    if (value === null || value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      let arrayKey = `${encodeKey(key)}[]`;
      for (let j = 0, l = value.length; j < l; j++) {
        pairs.push(`${arrayKey}=${encode(value[j])}`);
      }
    } else {
      pairs.push(`${encodeKey(key)}=${encode(value)}`);
    }
  }

  if (pairs.length === 0) {
    return '';
  }

  return pairs.join('&');
}

/**
* Parse a query string.
*
* @param The query string to parse.
* @returns Object with keys and values mapped from the query string.
*/
export function parseQueryString(queryString: string): Object {
  let queryParams = {};
  if (!queryString || typeof queryString !== 'string') {
    return queryParams;
  }

  let query = queryString;
  if (query.charAt(0) === '?') {
    query = query.substr(1);
  }

  let pairs = query.split('&');
  for (let i = 0; i < pairs.length; i++) {
    let pair = pairs[i].split('=');
    let key = decodeURIComponent(pair[0]);
    let keyLength = key.length;
    let isArray = false;
    let value;

    if (!key) {
      continue;
    } else if (pair.length === 1) {
      value = true;
    } else {
      //Handle arrays
      if (keyLength > 2 && key.slice(keyLength - 2) === '[]') {
        isArray = true;
        key = key.slice(0, keyLength - 2);
        if (!queryParams[key]) {
          queryParams[key] = [];
        }
      }

      value = pair[1] ? decodeURIComponent(pair[1]) : '';
    }

    if (isArray) {
      queryParams[key].push(value);
    } else {
      queryParams[key] = value;
    }
  }

  return queryParams;
}
