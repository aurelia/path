
function trimDots(ary) {
  for (let i = 0; i < ary.length; ++i) {
    let part = ary[i];
    if (part === '.') {
      ary.splice(i, 1);
      i -= 1;
    } else if (part === '..') {
      if (i === 0 || i === 1 && ary[2] === '..' || ary[i - 1] === '..') {
        continue;
      } else if (i > 0) {
        ary.splice(i - 1, 2);
        i -= 2;
      }
    }
  }
}

export function relativeToFile(name, file) {
  let fileParts = file && file.split('/');
  let nameParts = name.trim().split('/');

  if (nameParts[0].charAt(0) === '.' && fileParts) {
    let normalizedBaseParts = fileParts.slice(0, fileParts.length - 1);
    nameParts.unshift(...normalizedBaseParts);
  }

  trimDots(nameParts);

  return nameParts.join('/');
}

export function join(path1, path2) {
  if (!path1) {
    return path2;
  }

  if (!path2) {
    return path1;
  }

  let schemeMatch = path1.match(/^([^/]*?:)\//);
  let scheme = schemeMatch && schemeMatch.length > 0 ? schemeMatch[1] : '';
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

function buildParam(key, value, traditional) {
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
  } else if (typeof value === 'object' && !traditional) {
    for (let propertyName in value) {
      result = result.concat(buildParam(key + '[' + propertyName + ']', value[propertyName]));
    }
  } else {
    result.push(`${encodeKey(key)}=${encode(value)}`);
  }
  return result;
}

export function buildQueryString(params, traditional) {
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

function processScalarParam(existedParam, value) {
  if (Array.isArray(existedParam)) {
    existedParam.push(value);
    return existedParam;
  }
  if (existedParam !== undefined) {
    return [existedParam, value];
  }

  return value;
}

function parseComplexParam(queryParams, keys, value) {
  let currentParams = queryParams;
  let keysLastIndex = keys.length - 1;
  for (let j = 0; j <= keysLastIndex; j++) {
    let key = keys[j] === '' ? currentParams.length : keys[j];
    if (j < keysLastIndex) {
      let prevValue = !currentParams[key] || typeof currentParams[key] === 'object' ? currentParams[key] : [currentParams[key]];
      currentParams = currentParams[key] = prevValue || (isNaN(keys[j + 1]) ? {} : []);
    } else {
      currentParams = currentParams[key] = value;
    }
  }
}

export function parseQueryString(queryString) {
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

    let keys = key.split('][');
    let keysLastIndex = keys.length - 1;

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