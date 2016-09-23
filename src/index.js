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

/**
* Calculates a path relative to a file.
*
* @param name The relative path.
* @param file The file path.
* @return The calculated path.
*/
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

/**
* Joins two paths.
*
* @param path1 The first path.
* @param path2 The second path.
* @return The joined path.
*/
export function join(path1: string, path2: string): string {
  if (!path1) {
    return path2;
  }

  if (!path2) {
    return path1;
  }

  let schemeMatch = path1.match(/^([^/]*?:)\//);
  let scheme = (schemeMatch && schemeMatch.length > 0) ? schemeMatch[1] : '';
  path1 = path1.substr(scheme.length);

  let urlPrefix;
  if (path1.indexOf('///') === 0 && scheme === 'file:') {
    urlPrefix = '///';
  } else if (path1.indexOf('//') === 0) {
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

  return scheme + urlPrefix + url3.join('/') + trailingSlash;
}

let encode = encodeURIComponent;
let encodeKey = k => encode(k).replace('%24', '$');
/**
* Recursively builds part of query string for parameter.
*
* @param key Parameter name for query string.
* @param value Parameter value to deserialize.
* @param traditional Boolean Use the old URI template standard (RFC6570)
* @return Array with serialized parameter(s)
*/
function buildParam(key: string, value: any, traditional?: boolean): Array<string> {
  let result = [];
  if (value === null || value === undefined) {
    return result;
  }
  if (Array.isArray(value)) {
    for (let i = 0, l = value.length; i < l; i++) {
      if (traditional) {
        result.push(`${encodeKey(key)}=${encode(value[i])}`);
      } else {
        let arrayKey = key + '[' + (typeof value[i] === 'object' && value[i] !== null ? i : '') + ']';
        result = result.concat(buildParam(arrayKey, value[i]));
      }
    }
  } else if (typeof (value) === 'object' && !traditional) {
    for (let propertyName in value) {
      result = result.concat(buildParam(key + '[' + propertyName + ']', value[propertyName]));
    }
  } else {
    result.push(`${encodeKey(key) }=${encode(value) }`);
  }
  return result;
}

/**
* Generate a query string from an object.
*
* @param params Object containing the keys and values to be used.
* @param traditional Boolean Use the old URI template standard (RFC6570)
* @returns The generated query string, excluding leading '?'.
*/
export function buildQueryString(params: Object, traditional?: Boolean): string {
  let pairs = [];
  let keys = Object.keys(params || {}).sort();
  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i];
    pairs = pairs.concat(buildParam(key, params[key], traditional));
  }

  if (pairs.length === 0) {
    return '';
  }

  return pairs.join('&');
}

/**
* Process parameter that was recognized as scalar param (primitive value or shallow array).
*
* @param existedParam Object with previously parsed values for specified key.
* @param value Parameter value to append.
* @returns Initial primitive value or transformed existedParam if parameter was recognized as an array.
*/
function processScalarParam(existedParam: Object, value: Object): Object {
  if (Array.isArray(existedParam)) {
    // value is already an array, so push on the next value.
    existedParam.push(value);
    return existedParam;
  }
  if (existedParam !== undefined) {
    // value isn't an array, but since a second value has been specified,
    // convert value into an array.
    return [existedParam, value];
  }
  // value is a scalar.
  return value;
}
/**
* Sequentially process parameter that was recognized as complex value (object or array).
* For each keys part, if the current level is undefined create an
*   object or array based on the type of the next keys part.
*
* @param queryParams root-level result object.
* @param keys Collection of keys related to this parameter.
* @param value Parameter value to append.
*/
function parseComplexParam(queryParams: Object, keys: Object, value: any): void {
  let currentParams = queryParams;
  let keysLastIndex = keys.length - 1;
  for (let j = 0; j <= keysLastIndex; j++) {
    let key = keys[j] === '' ? currentParams.length : keys[j];
    if (j < keysLastIndex) {
      // The value has to be an array or a false value
      // It can happen that the value is no array if the key was repeated with traditional style like `list=1&list[]=2`
      let prevValue = !currentParams[key] || typeof currentParams[key] === 'object' ? currentParams[key] : [currentParams[key]];
      currentParams = currentParams[key] = prevValue || (isNaN(keys[j + 1]) ? {} : []);
    } else {
      currentParams = currentParams[key] = value;
    }
  }
}


/**
* Parse a query string.
*
* @param queryString The query string to parse.
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

  let pairs = query.replace(/\+/g, ' ').split('&');
  for (let i = 0; i < pairs.length; i++) {
    let pair = pairs[i].split('=');
    let key = decodeURIComponent(pair[0]);
    if (!key) {
      continue;
    }
    //split object key into its parts
    let keys = key.split('][');
    let keysLastIndex = keys.length - 1;

    // If the first keys part contains [ and the last ends with ], then []
    // are correctly balanced, split key to parts
    //Else it's basic key
    if (/\[/.test(keys[0]) && /\]$/.test(keys[keysLastIndex])) {
      keys[keysLastIndex] = keys[keysLastIndex].replace(/\]$/, '');
      keys = keys.shift().split('[').concat(keys);
      keysLastIndex = keys.length - 1;
    } else {
      keysLastIndex = 0;
    }

    if (pair.length >= 2) {
      let value = pair[1] ? decodeURIComponent(pair[1]) : '';
      if (keysLastIndex) {
        parseComplexParam(queryParams, keys, value);
      } else {
        queryParams[key] = processScalarParam(queryParams[key], value);
      }
    } else {
      queryParams[key] = true;
    }
  }
  return queryParams;
}
