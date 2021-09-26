define(['exports'], function (exports) { 'use strict';

    function trimDots(ary) {
        for (var i = 0; i < ary.length; ++i) {
            var part = ary[i];
            if (part === '.') {
                ary.splice(i, 1);
                i -= 1;
            }
            else if (part === '..') {
                if (i === 0 || (i === 1 && ary[2] === '..') || ary[i - 1] === '..') {
                    continue;
                }
                else if (i > 0) {
                    ary.splice(i - 1, 2);
                    i -= 2;
                }
            }
        }
    }
    function relativeToFile(name, file) {
        var fileParts = file && file.split('/');
        var nameParts = name.trim().split('/');
        if (nameParts[0].charAt(0) === '.' && fileParts) {
            var normalizedBaseParts = fileParts.slice(0, fileParts.length - 1);
            nameParts.unshift.apply(nameParts, normalizedBaseParts);
        }
        trimDots(nameParts);
        return nameParts.join('/');
    }
    function join(path1, path2) {
        if (!path1) {
            return path2;
        }
        if (!path2) {
            return path1;
        }
        var schemeMatch = path1.match(/^([^/]*?:)\//);
        var scheme = (schemeMatch && schemeMatch.length > 0) ? schemeMatch[1] : '';
        path1 = path1.substr(scheme.length);
        var urlPrefix;
        if (path1.indexOf('///') === 0 && scheme === 'file:') {
            urlPrefix = '///';
        }
        else if (path1.indexOf('//') === 0) {
            urlPrefix = '//';
        }
        else if (path1.indexOf('/') === 0) {
            urlPrefix = '/';
        }
        else {
            urlPrefix = '';
        }
        var trailingSlash = path2.slice(-1) === '/' ? '/' : '';
        var url1 = path1.split('/');
        var url2 = path2.split('/');
        var url3 = [];
        for (var i = 0, ii = url1.length; i < ii; ++i) {
            if (url1[i] === '..') {
                if (url3.length && url3[url3.length - 1] !== '..') {
                    url3.pop();
                }
                else {
                    url3.push(url1[i]);
                }
            }
            else if (url1[i] === '.' || url1[i] === '') {
                continue;
            }
            else {
                url3.push(url1[i]);
            }
        }
        for (var i = 0, ii = url2.length; i < ii; ++i) {
            if (url2[i] === '..') {
                if (url3.length && url3[url3.length - 1] !== '..') {
                    url3.pop();
                }
                else {
                    url3.push(url2[i]);
                }
            }
            else if (url2[i] === '.' || url2[i] === '') {
                continue;
            }
            else {
                url3.push(url2[i]);
            }
        }
        return scheme + urlPrefix + url3.join('/') + trailingSlash;
    }
    var encode = encodeURIComponent;
    var encodeKey = function (k) { return encode(k).replace('%24', '$'); };
    function buildParam(key, value, traditional) {
        var result = [];
        if (value === null || value === undefined) {
            return result;
        }
        if (Array.isArray(value)) {
            for (var i = 0, l = value.length; i < l; i++) {
                if (traditional) {
                    result.push(encodeKey(key) + "=" + encode(value[i]));
                }
                else {
                    var arrayKey = key + '[' + (typeof value[i] === 'object' && value[i] !== null ? i : '') + ']';
                    result = result.concat(buildParam(arrayKey, value[i]));
                }
            }
        }
        else if (typeof (value) === 'object' && !traditional) {
            for (var propertyName in value) {
                result = result.concat(buildParam(key + '[' + propertyName + ']', value[propertyName]));
            }
        }
        else {
            result.push(encodeKey(key) + "=" + encode(value));
        }
        return result;
    }
    function buildQueryString(params, traditional) {
        var pairs = [];
        var keys = Object.keys(params || {}).sort();
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
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
        var currentParams = queryParams;
        var keysLastIndex = keys.length - 1;
        for (var j = 0; j <= keysLastIndex; j++) {
            var key = keys[j] === '' ? currentParams.length : keys[j];
            preventPollution(key);
            if (j < keysLastIndex) {
                var prevValue = !currentParams[key] || typeof currentParams[key] === 'object' ? currentParams[key] : [currentParams[key]];
                currentParams = currentParams[key] = prevValue || (isNaN(keys[j + 1]) ? {} : []);
            }
            else {
                currentParams = currentParams[key] = value;
            }
        }
    }
    function parseQueryString(queryString) {
        var queryParams = {};
        if (!queryString || typeof queryString !== 'string') {
            return queryParams;
        }
        var query = queryString;
        if (query.charAt(0) === '?') {
            query = query.substr(1);
        }
        var pairs = query.replace(/\+/g, ' ').split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            var key = decodeURIComponent(pair[0]);
            if (!key) {
                continue;
            }
            var keys = key.split('][');
            var keysLastIndex = keys.length - 1;
            if (/\[/.test(keys[0]) && /\]$/.test(keys[keysLastIndex])) {
                keys[keysLastIndex] = keys[keysLastIndex].replace(/\]$/, '');
                keys = keys.shift().split('[').concat(keys);
                keysLastIndex = keys.length - 1;
            }
            else {
                keysLastIndex = 0;
            }
            if (pair.length >= 2) {
                var value = pair[1] ? decodeURIComponent(pair[1]) : '';
                if (keysLastIndex) {
                    parseComplexParam(queryParams, keys, value);
                }
                else {
                    preventPollution(key);
                    queryParams[key] = processScalarParam(queryParams[key], value);
                }
            }
            else {
                queryParams[key] = true;
            }
        }
        return queryParams;
    }
    function preventPollution(key) {
        if (key === '__proto__') {
            throw new Error('Prototype pollution detected.');
        }
    }

    exports.buildQueryString = buildQueryString;
    exports.join = join;
    exports.parseQueryString = parseQueryString;
    exports.relativeToFile = relativeToFile;

    Object.defineProperty(exports, '__esModule', { value: true });

});
//# sourceMappingURL=aurelia-path.js.map
