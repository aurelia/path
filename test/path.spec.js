import { normalize } from '../lib/index';

describe('normalize', () => {
  it('can normalize a path with a baseUrl', () => {
    var baseUrl = 'http://durandal.io/';
    var path = './my/module';

    expect(normalize(path, baseUrl)).toBe('http://durandal.io/my/module');
  });
});