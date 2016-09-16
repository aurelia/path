import { relativeToFile, join, parseQueryString, buildQueryString } from '../src/index';

describe('relativeToFile', () => {
  it('can make a dot path relative to a simple file', () => {
    var file = 'some/file.html';
    var path = './other/module';

    expect(relativeToFile(path, file)).toBe('some/other/module');
  });

  it('can make a dot path relative to an absolute file', () => {
    var file = 'http://durandal.io/some/file.html';
    var path = './other/module';

    expect(relativeToFile(path, file)).toBe('http://durandal.io/some/other/module');
  });

  it('can make a double dot path relative to an absolute file', () => {
    var file = 'http://durandal.io/some/file.html';
    var path = '../other/module';

    expect(relativeToFile(path, file)).toBe('http://durandal.io/other/module');
  });

  it('returns path if null file provided', () => {
    var file = null;
    var path = 'module';

    expect(relativeToFile(path, file)).toBe('module');
  });

  it('returns path if empty file provided', () => {
    var file = '';
    var path = 'module';

    expect(relativeToFile(path, file)).toBe('module');
  });
});

describe('join', () => {
  it('can combine two simple paths', () => {
    var path1 = 'one';
    var path2 = 'two';

    expect(join(path1, path2)).toBe('one/two');
  });

  it('can combine an absolute path and a simple path', () => {
    var path1 = '/one';
    var path2 = 'two';

    expect(join(path1, path2)).toBe('/one/two');
  });

  it('can combine an absolute path and a simple path with slash', () => {
    var path1 = '/one';
    var path2 = '/two';

    expect(join(path1, path2)).toBe('/one/two');
  });

  it('can combine a single slash and a simple path', () => {
    var path1 = '/';
    var path2 = 'two';

    expect(join(path1, path2)).toBe('/two');
  });

  it('can combine a single slash and a simple path with slash', () => {
    var path1 = '/';
    var path2 = '/two';

    expect(join(path1, path2)).toBe('/two');
  });

  it('can combine an absolute path with protocol and a simple path', () => {
    var path1 = 'http://durandal.io';
    var path2 = 'two';

    expect(join(path1, path2)).toBe('http://durandal.io/two');
  });

  it('can combine an absolute path with protocol and a simple path with slash', () => {
    var path1 = 'http://durandal.io';
    var path2 = '/two';

    expect(join(path1, path2)).toBe('http://durandal.io/two');
  });

  it('can combine an absolute path and a simple path with a dot', () => {
    var path1 = 'http://durandal.io';
    var path2 = './two';

    expect(join(path1, path2)).toBe('http://durandal.io/two');
  });

  it('can combine a simple path and a relative path', () => {
    var path1 = 'one';
    var path2 = '../two';

    expect(join(path1, path2)).toBe('two');
  });

  it('can combine an absolute path and a relative path', () => {
    var path1 = 'http://durandal.io/somewhere';
    var path2 = '../two';

    expect(join(path1, path2)).toBe('http://durandal.io/two');
  });

  it('can combine a protocol independent path and a simple path', () => {
    var path1 = '//durandal.io';
    var path2 = 'two';

    expect(join(path1, path2)).toBe('//durandal.io/two');
  });

  it('can combine a protocol independent path and a simple path with slash', () => {
    var path1 = '//durandal.io';
    var path2 = '/two';

    expect(join(path1, path2)).toBe('//durandal.io/two');
  });

  it('can combine a protocol independent path and a simple path with a dot', () => {
    var path1 = '//durandal.io';
    var path2 = './two';

    expect(join(path1, path2)).toBe('//durandal.io/two');
  });

  it('can combine a protocol independent path and a relative path', () => {
    var path1 = '//durandal.io/somewhere';
    var path2 = '../two';

    expect(join(path1, path2)).toBe('//durandal.io/two');
  });

  it('can combine a complex path and a relative path', () => {
    var path1 = 'one/three';
    var path2 = '../two';

    expect(join(path1, path2)).toBe('one/two');
  });

  it('returns path2 if path1 null', () => {
    var path1 = null;
    var path2 = 'two';

    expect(join(path1, path2)).toBe('two');
  });

  it('returns path2 if path1 empty', () => {
    var path1 = '';
    var path2 = 'two';

    expect(join(path1, path2)).toBe('two');
  });

  it('returns path1 if path2 null', () => {
    var path1 = 'one';
    var path2 = null;

    expect(join(path1, path2)).toBe('one');
  });

  it('returns path1 if path2 empty', () => {
    var path1 = 'one';
    var path2 = '';

    expect(join(path1, path2)).toBe('one');
  });

  it('should respect a trailing slash', () => {
    var path1 = 'one/';
    var path2 = 'two/';

    expect(join(path1, path2)).toBe('one/two/');
  });

  it('should respect file:/// protocol with three slashes (empty host)', () => {
    var path1 = 'file:///one';
    var path2 = '/two';

    expect(join(path1, path2)).toBe('file:///one/two');
  });

  it('should respect file:// protocol with two slashes (host given)', () => {
    var path1 = 'file://localhost:8080';
    var path2 = '/two';

    expect(join(path1, path2)).toBe('file://localhost:8080/two');
  });

  it('should allow scheme-relative URL that uses colons in the path', () => {
    var path1 = '//localhost/one:/';
    var path2 = '/two';

    expect(join(path1, path2)).toBe('//localhost/one:/two');
  });

  it('should not add more than two leading slashes to http:// protocol', () => {
    var path1 = 'http:///';
    var path2 = '/two';

    expect(join(path1, path2)).toBe('http://two');
  });
});

describe('query strings', () => {
  it('should build query strings', () => {
    let gen = buildQueryString;

    expect(gen()).toBe('');
    expect(gen(null)).toBe('');
    expect(gen({})).toBe('');
    expect(gen({ a: null })).toBe('');

    expect(gen({ '': 'a' })).toBe('=a');
    expect(gen({ a: 'b' })).toBe('a=b');
    expect(gen({ a: 'b', c: 'd' })).toBe('a=b&c=d');
    expect(gen({ a: 'b', c: 'd' }, true)).toBe('a=b&c=d');
    expect(gen({ a: 'b', c: null })).toBe('a=b');
    expect(gen({ a: 'b', c: null }, true)).toBe('a=b');

    expect(gen({ a: ['b', 'c'] })).toBe('a%5B%5D=b&a%5B%5D=c');
    expect(gen({ a: ['b', 'c'] }, true)).toBe('a=b&a=c');
    expect(gen({ '&': ['b', 'c'] })).toBe('%26%5B%5D=b&%26%5B%5D=c');
    expect(gen({ '&': ['b', 'c'] }, true)).toBe('%26=b&%26=c');

    expect(gen({ a: '&' })).toBe('a=%26');
    expect(gen({ '&': 'a' })).toBe('%26=a');
    expect(gen({ a: true })).toBe('a=true');
    expect(gen({ '$test': true })).toBe('$test=true');

    expect(gen({ obj: { a: 5, b: "str", c: false } })).toBe('obj%5Ba%5D=5&obj%5Bb%5D=str&obj%5Bc%5D=false');
    expect(gen({ obj: { a: 5, b: "str", c: false } }, true)).toBe('obj=%5Bobject%20Object%5D');
    expect(gen({ obj:{ a: 5, b: undefined}})).toBe('obj%5Ba%5D=5');
        
    expect(gen({a: {b: ['c','d', ['f', 'g']]}})).toBe('a%5Bb%5D%5B%5D=c&a%5Bb%5D%5B%5D=d&a%5Bb%5D%5B2%5D%5B%5D=f&a%5Bb%5D%5B2%5D%5B%5D=g');
    expect(gen({a: {b: ['c','d', ['f', 'g']]}}, true)).toBe('a=%5Bobject%20Object%5D');
    expect(gen({a: ['c','d', ['f', 'g']]}, true)).toBe('a=c&a=d&a=f%2Cg');
    expect(gen({a: ['c','d', {f: 'g'}]}, true)).toBe('a=c&a=d&a=%5Bobject%20Object%5D');
  });

  it('should parse query strings', () => {
    let parse = parseQueryString;

    expect(parse('')).toEqual({});
    expect(parse('=')).toEqual({});
    expect(parse('&')).toEqual({});
    expect(parse('?')).toEqual({});

    expect(parse('a')).toEqual({ a: true });
    expect(parse('a&b')).toEqual({ a: true, b: true });
    expect(parse('a=')).toEqual({ a: '' });
    expect(parse('a=&b=')).toEqual({ a: '', b: '' });

    expect(parse('a=b')).toEqual({ a: 'b' });
    expect(parse('a=b&c=d')).toEqual({ a: 'b', c: 'd' });
    expect(parse('a=b&&c=d')).toEqual({ a: 'b', c: 'd' });
    expect(parse('a=b&a=c')).toEqual({ a: ['b', 'c'] });
    
    expect(parse('a=b&c=d=')).toEqual({ a: 'b', c: 'd' });
    expect(parse('a=b&c=d==')).toEqual({ a: 'b', c: 'd' });

    expect(parse('a=%26')).toEqual({ a: '&' });
    expect(parse('%26=a')).toEqual({ '&': 'a' });
    expect(parse('%26[]=b&%26[]=c')).toEqual({ '&': ['b', 'c'] });
        
    expect(parse('a[b]=c&a[d]=e')).toEqual({a: {b: 'c', d: 'e'}});
    expect(parse('a[b][c][d]=e')).toEqual({a: {b: {c: {d: 'e'}}}});
    expect(parse('a[b][]=c&a[b][]=d&a[b][2][]=f&a[b][2][]=g')).toEqual({a: {b: ['c','d', ['f', 'g']]}});
    expect(parse('a[0]=b')).toEqual({a: ['b']});
  });
});
