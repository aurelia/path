import { relativeToFile, join } from '../src/index';

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
});