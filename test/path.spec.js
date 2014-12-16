import { normalize, join } from '../src/index';

describe('normalize', () => {
  it('can make a path relative to a file', () => {
    var baseUrl = 'some/file.html';
    var path = './other/module';

    expect(normalize(path, baseUrl)).toBe('some/other/module');
  });
});

describe('join', () => {
  it('can join two paths', () => {
    var path1 = 'one';
    var path2 = 'two';

    expect(join(path1, path2)).toBe('one/two');
  });
});