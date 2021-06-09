import { relativeToFile, join, parseQueryString, buildQueryString } from '../src/index';
import assert from 'assert';

const expect = (input: any) => {
  return {
    toBe: (output: any) => {
      assert.strictEqual(input, output);
    },
    toEqual: (output: any) => {
      assert.deepStrictEqual(input, output)
    }
  }
}

describe('relativeToFile', () => {
  it('can make a dot path relative to a simple file', () => {
    const file = 'some/file.html';
    const path = './other/module';

    expect(relativeToFile(path, file)).toBe('some/other/module');
  });

  it('can make a dot path relative to an absolute file', () => {
    const file = 'http://durandal.io/some/file.html';
    const path = './other/module';

    expect(relativeToFile(path, file)).toBe('http://durandal.io/some/other/module');
  });

  it('can make a double dot path relative to an absolute file', () => {
    const file = 'http://durandal.io/some/file.html';
    const path = '../other/module';

    expect(relativeToFile(path, file)).toBe('http://durandal.io/other/module');
  });

  it('returns path if null file provided', () => {
    const file = null;
    const path = 'module';

    expect(relativeToFile(path, file)).toBe('module');
  });

  it('returns path if empty file provided', () => {
    const file = '';
    const path = 'module';

    expect(relativeToFile(path, file)).toBe('module');
  });
});

describe('join', () => {
  it('can combine two simple paths', () => {
    const path1 = 'one';
    const path2 = 'two';

    expect(join(path1, path2)).toBe('one/two');
  });

  it('can combine an absolute path and a simple path', () => {
    const path1 = '/one';
    const path2 = 'two';

    expect(join(path1, path2)).toBe('/one/two');
  });

  it('can combine an absolute path and a simple path with slash', () => {
    const path1 = '/one';
    const path2 = '/two';

    expect(join(path1, path2)).toBe('/one/two');
  });

  it('can combine a single slash and a simple path', () => {
    const path1 = '/';
    const path2 = 'two';

    expect(join(path1, path2)).toBe('/two');
  });

  it('can combine a single slash and a simple path with slash', () => {
    const path1 = '/';
    const path2 = '/two';

    expect(join(path1, path2)).toBe('/two');
  });

  it('can combine an absolute path with protocol and a simple path', () => {
    const path1 = 'http://durandal.io';
    const path2 = 'two';

    expect(join(path1, path2)).toBe('http://durandal.io/two');
  });

  it('can combine an absolute path with protocol and a simple path with slash', () => {
    const path1 = 'http://durandal.io';
    const path2 = '/two';

    expect(join(path1, path2)).toBe('http://durandal.io/two');
  });

  it('can combine an absolute path and a simple path with a dot', () => {
    const path1 = 'http://durandal.io';
    const path2 = './two';

    expect(join(path1, path2)).toBe('http://durandal.io/two');
  });

  it('can combine a simple path and a relative path', () => {
    const path1 = 'one';
    const path2 = '../two';

    expect(join(path1, path2)).toBe('two');
  });

  it('can combine an absolute path and a relative path', () => {
    const path1 = 'http://durandal.io/somewhere';
    const path2 = '../two';

    expect(join(path1, path2)).toBe('http://durandal.io/two');
  });

  it('can combine a protocol independent path and a simple path', () => {
    const path1 = '//durandal.io';
    const path2 = 'two';

    expect(join(path1, path2)).toBe('//durandal.io/two');
  });

  it('can combine a protocol independent path and a simple path with slash', () => {
    const path1 = '//durandal.io';
    const path2 = '/two';

    expect(join(path1, path2)).toBe('//durandal.io/two');
  });

  it('can combine a protocol independent path and a simple path with a dot', () => {
    const path1 = '//durandal.io';
    const path2 = './two';

    expect(join(path1, path2)).toBe('//durandal.io/two');
  });

  it('can combine a protocol independent path and a relative path', () => {
    const path1 = '//durandal.io/somewhere';
    const path2 = '../two';

    expect(join(path1, path2)).toBe('//durandal.io/two');
  });

  it('can combine a complex path and a relative path', () => {
    const path1 = 'one/three';
    const path2 = '../two';

    expect(join(path1, path2)).toBe('one/two');
  });

  it('returns path2 if path1 null', () => {
    const path1 = null;
    const path2 = 'two';

    expect(join(path1, path2)).toBe('two');
  });

  it('returns path2 if path1 empty', () => {
    const path1 = '';
    const path2 = 'two';

    expect(join(path1, path2)).toBe('two');
  });

  it('returns path1 if path2 null', () => {
    const path1 = 'one';
    const path2 = null;

    expect(join(path1, path2)).toBe('one');
  });

  it('returns path1 if path2 empty', () => {
    const path1 = 'one';
    const path2 = '';

    expect(join(path1, path2)).toBe('one');
  });

  it('should retain leading .. in path1', () => {
    const path1 = '../one';
    const path2 = './two';

    expect(join(path1, path2)).toBe('../one/two');
  });

  it('should retain consecutive leading .. in path1', () => {
    const path1 = '../../one';
    const path2 = './two';

    expect(join(path1, path2)).toBe('../../one/two');
  });

  it('should handle .. in path1 and path2', () => {
    const path1 = '../../one';
    const path2 = '../two';

    expect(join(path1, path2)).toBe('../../two');
  });

  it('should merge .. in path1 and path2', () => {
    const path1 = '../../one';
    const path2 = '../../two';

    expect(join(path1, path2)).toBe('../../../two');
  });

  it('should retain consecutive leading .. but not other .. in path1', () => {
    const path1 = '../../one/../three';
    const path2 = './two';

    expect(join(path1, path2)).toBe('../../three/two');
  });

  it('should respect a trailing slash', () => {
    const path1 = 'one/';
    const path2 = 'two/';

    expect(join(path1, path2)).toBe('one/two/');
  });

  it('should respect file:/// protocol with three slashes (empty host)', () => {
    const path1 = 'file:///one';
    const path2 = '/two';

    expect(join(path1, path2)).toBe('file:///one/two');
  });

  it('should respect file:// protocol with two slashes (host given)', () => {
    const path1 = 'file://localhost:8080';
    const path2 = '/two';

    expect(join(path1, path2)).toBe('file://localhost:8080/two');
  });

  it('should allow scheme-relative URL that uses colons in the path', () => {
    const path1 = '//localhost/one:/';
    const path2 = '/two';

    expect(join(path1, path2)).toBe('//localhost/one:/two');
  });

  it('should not add more than two leading slashes to http:// protocol', () => {
    const path1 = 'http:///';
    const path2 = '/two';

    expect(join(path1, path2)).toBe('http://two');
  });
});

describe('query strings', () => {
  interface IBuildTestCase {
    input: any;
    traditional?: boolean;
    output: string;
  }
  const testCases: IBuildTestCase[] = [
    { input: undefined, output: '' },
    { input: null, output: '' },
    { input: {}, output: '' },
    { input: { a: null }, output: '' },
    { input: { '': 'a' }, output: '=a' },
    { input: { a: 'b' }, output: 'a=b' },
    { input: { a: 'b', c: 'd' }, output: 'a=b&c=d' },
    { input: { a: 'b', c: 'd' }, traditional: true, output: 'a=b&c=d' },
    { input: { a: 'b', c: null }, output: 'a=b' },
    { input: { a: 'b', c: null }, traditional: true, output: 'a=b' },
    { input: { a: ['b', 'c'] }, output: 'a%5B%5D=b&a%5B%5D=c' },
    { input: { a: ['b', 'c'] }, traditional: true, output: 'a=b&a=c' },
    { input: { '&': ['b', 'c'] }, output: '%26%5B%5D=b&%26%5B%5D=c' },
    { input: { '&': ['b', 'c'] }, traditional: true, output: '%26=b&%26=c' },

    { input: { a: '&' }, output: 'a=%26' },
    { input: { '&': 'a' }, output: '%26=a' },
    { input: { a: true }, output: 'a=true' },
    { input: { '$test': true }, output: '$test=true' },

    { input: { obj: { a: 5, b: "str", c: false } }, output: 'obj%5Ba%5D=5&obj%5Bb%5D=str&obj%5Bc%5D=false' },
    { input: { obj: { a: 5, b: "str", c: false } }, traditional: true, output: 'obj=%5Bobject%20Object%5D' },
    { input: { obj: { a: 5, b: undefined } }, output: 'obj%5Ba%5D=5' },

    { input: { a: { b: ['c', 'd', ['f', 'g']] } }, output: 'a%5Bb%5D%5B%5D=c&a%5Bb%5D%5B%5D=d&a%5Bb%5D%5B2%5D%5B%5D=f&a%5Bb%5D%5B2%5D%5B%5D=g' },
    { input: { a: { b: ['c', 'd', ['f', 'g']] } }, traditional: true, output: 'a=%5Bobject%20Object%5D' },
    { input: { a: ['c', 'd', ['f', 'g']] }, traditional: true, output: 'a=c&a=d&a=f%2Cg' },
    { input: { a: ['c', 'd', { f: 'g' }] }, traditional: true, output: 'a=c&a=d&a=%5Bobject%20Object%5D' },
  ];

  testCases.forEach(({ input, output, traditional }) => {
    it(`builds ${input instanceof Object ? JSON.stringify(input) : input} to "${output}"`, () => {
      expect(buildQueryString(input, traditional)).toBe(output);
    });
  });

  interface IParseTestCase {
    input: string;
    output: any;
  }

  const parseTestCases: IParseTestCase[] = [
    { input: '', output: {} },
    { input: '=', output: {} },
    { input: '&', output: {} },
    { input: '?', output: {} },

    { input: 'a', output: { a: true } },
    { input: 'a&b', output: { a: true, b: true } },
    { input: 'a=', output: { a: '' } },
    { input: 'a=&b=', output: { a: '', b: '' } },

    { input: 'a=b', output: { a: 'b' } },
    { input: 'a=b&c=d', output: { a: 'b', c: 'd' } },
    { input: 'a=b&&c=d', output: { a: 'b', c: 'd' } },
    { input: 'a=b&a=c', output: { a: ['b', 'c'] } },

    { input: 'a=b&c=d=', output: { a: 'b', c: 'd' } },
    { input: 'a=b&c=d==', output: { a: 'b', c: 'd' } },

    { input: 'a=%26', output: { a: '&' } },
    { input: '%26=a', output: { '&': 'a' } },
    { input: '%26[]=b&%26[]=c', output: { '&': ['b', 'c'] } },

    { input: 'a[b]=c&a[d]=e', output: { a: { b: 'c', d: 'e' } } },
    { input: 'a[b][c][d]=e', output: { a: { b: { c: { d: 'e' } } } } },
    { input: 'a[b][]=c&a[b][]=d&a[b][2][]=f&a[b][2][]=g', output: { a: { b: ['c', 'd', ['f', 'g']] } } },
    { input: 'a[0]=b', output: { a: ['b'] } },
  ];

  parseTestCases.forEach(({ input, output }) => {
    it(`parses ${input} to "${JSON.stringify(output)}"`, () => {
      expect(parseQueryString(input)).toEqual(output);
    });
  });

  it('does not pollute prototype', () => {
    const path1 = '__proto__[asdf]=asdf';
    assert.throws(() => parseQueryString(path1), 'Prototype pollution detected');
  });
});
