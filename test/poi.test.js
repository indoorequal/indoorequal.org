import { poiClassAndSubclass } from '../js/preview/poi';

describe('poi class and subclass', () => {
  const tests = [
    { tags: { amenity: 'cafe' }, expected: ['cafe', 'cafe'] },
    { tags: { shop: 'books' }, expected: ['library', 'books'] },
    { tags: { amenity: 'courthouse' }, expected: ['town_hall', 'courthouse'] },
    { tags: { door: 'hinged' }, expected: ['entrance', 'hinged'] },
    { tags: { amenity: 'test' }, expected: null },
  ];

  it('returns the class and the subclass of the poi', () => {
    tests.forEach(({ tags, expected }) => {
      expect(poiClassAndSubclass({
        type: 'Feature',
        properties: {
          indoor: 'room',
          level: '0',
          ...tags
        },
        geometry: {
          type: 'Point',
          coordinates: []
        }
      })).toEqual(expected);
    });
  });
});
