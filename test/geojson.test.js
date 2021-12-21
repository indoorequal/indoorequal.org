import {
  filterIndoorFeatures,
  findAllLevels,
  transformGeoJSON,
  transformAreaFeatures,
  transformTransportationFeatures,
  transformPoiFeatures,
  poiClassAndSubclass,
  isPoi
} from '../js/preview/geojson';

describe('transformAreaFeatures', () => {
  it('returns area data', () => {
    const features =  [
      {
        type: 'Feature',
        properties: {
          indoor: 'room',
          level: '0',
          name: 'Test',
        },
        geometry: {
          type: 'Polygon',
          coordinates: []
        }
      },
      {
        type: 'Feature',
        properties: {
          indoor: 'nope',
          level: '0'
        },
        geometry: {
          type: 'Polygon',
          coordinates: []
        }
      },
    ];
    const featuresResult = [
      {
        type: 'Feature',
        properties: {
          class: 'room',
          level: '0',
          name: 'Test',
          is_poi: false,
        },
        geometry: {
          type: 'Polygon',
          coordinates: []
        }
      },
    ];
    const result = transformAreaFeatures(features);
    expect(result).toEqual(featuresResult);
  });

  it('transform linestring feature to polygon', () => {
    const features = [
      {
        type: 'Feature',
        properties: {
          indoor: 'room',
          level: '0',
          name: 'Test',
        },
        geometry: {
          type: 'LineString',
          coordinates: [[0, 0], [1, 1], [2, 2], [3, 3]]
        }
      },
    ];
    const featuresResult = [
      {
        type: 'Feature',
        properties: {
          class: 'room',
          level: '0',
          name: 'Test',
          is_poi: false,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[[0, 0], [1, 1], [2, 2], [3, 3], [0, 0]]]
        }
      },
    ];
    const result = transformAreaFeatures(features);
    expect(result).toEqual(featuresResult);
  });
});

describe('filterIndoorFeatures', () => {
  it('return indoor features ', () => {
    const features = [
      {
        type: 'Feature',
        properties: {
          indoor: 'room',
          name: 'Test',
          level: '1'
        },
        geometry: {
          type: 'Polygon',
          coordinates: []
        }
      },
    ];
    const result = filterIndoorFeatures(features);
    expect(result).toEqual(features);
  });

  it('ignore non indoor features', () => {
    const features = [
      {
        type: 'Feature',
        properties: {
          indoor: 'room',
          name: 'Test',
        },
        geometry: {
          type: 'Polygon',
          coordinates: []
        }
      },
    ];
    const result = filterIndoorFeatures(features);
    expect(result).toEqual([]);
  });

  it('ignore features without properties', () => {
    const features = [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: []
        }
      },
    ];
    const result = filterIndoorFeatures(features);
    expect(result).toEqual([]);
  });

  it('ignore invalid level features', () => {
    const features = [
      {
        type: 'Feature',
        properties: {
          indoor: 'room',
          level: 'badlevel',
          name: 'Test',
        },
        geometry: {
          type: 'Polygon',
          coordinates: []
        }
      },
    ];
    const result = filterIndoorFeatures(features);
    expect(result).toEqual([]);
  });
});

describe('transformTransporationFeatures', () => {
  it('returns higway=steps features', () => {
    const features = [
      {
        type: 'Feature',
        properties: {
          indoor: 'room',
          level: '1',
          name: 'Test',
          highway: 'steps'
        },
        geometry: {
          type: 'Linestring',
          coordinates: []
        }
      },
    ];
    const result = transformTransportationFeatures(features);
    expect(result).toEqual([
      {
        type: 'Feature',
        properties: {
          indoor: 'room',
          level: '1',
          name: 'Test',
          class: 'steps'
        },
        geometry: {
          type: 'Linestring',
          coordinates: []
        }
      }
    ]);
  });
});

describe('transformPoiFeatures', () => {
  it('returns poi features', () => {
    const features = [
      {
        type: 'Feature',
        properties: {
          indoor: 'room',
          level: '0',
          shop: 'seafood',
          name: 'Test',
        },
        geometry: {
          type: 'Point',
          coordinates: []
        }
      },
      {
        type: 'Feature',
        properties: {
          level: '0'
        },
        geometry: {
          type: 'Point',
          coordinates: []
        }
      },
    ];
    const featuresResult = [
      {
        type: 'Feature',
        properties: {
          indoor: 'room',
          level: '0',
          name: 'Test',
          class: 'grocery',
          subclass: 'seafood',
          shop: 'seafood',
          'name:latin': 'Test'
        },
        geometry: {
          type: 'Point',
          coordinates: []
        }
      },
    ];
    const result = transformPoiFeatures(features);
    expect(result).toEqual(featuresResult);
  });

  it('transform geometry to a point ', () => {
    const features = [
      {
        type: 'Feature',
        properties: {
          indoor: 'room',
          level: '0',
          shop: 'seafood',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[[0, 0], [1, 1], [2, 2], [3, 3], [0, 0]]]
        }
      },
    ];
    const featuresResult = [
      {
        type: 'Feature',
        properties: {
          indoor: 'room',
          level: '0',
          class: 'grocery',
          subclass: 'seafood',
          shop: 'seafood',
        },
        geometry: {
          type: 'Point',
          coordinates: [1.5, 1.5]
        }
      },
    ];
    const result = transformPoiFeatures(features);
    expect(result).toEqual(featuresResult);
  });

  const specialSubclass = [
    { tags: { tourism: 'information', information: 'test' }, subclass: 'test' },
    { tags: { amenity: 'place_of_worship', religion: 're' }, subclass: 're' },
    { tags: { leisure: 'pitch', sport: 'tennis' }, subclass: 'tennis' },
    { tags: { amenity: 'vending_machine', vending: 'can' }, subclass: 'can' }
  ];

  it('returns special subclass', () => {
    specialSubclass.forEach(({ tags, subclass }) => {
      const features = [
        {
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
        },
      ];
      const result = transformPoiFeatures(features);
      expect(result[0].properties.subclass).toEqual(subclass);
    });
  });
});

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

describe('find all levels', () => {
  it('find levels with ;', () => {
    expect(findAllLevels({
      properties: {
        level: '1;2'
      }
    })).toEqual(['1', '2']);
  });

  it('find levels with repeat_on', () => {
    expect(findAllLevels({
      properties: {
        level: '1',
        repeat_on: '2'
      }
    })).toEqual(['1', '2']);
  });

  it('find levels with repeat_on with ;', () => {
    expect(findAllLevels({
      properties: {
        level: '1',
        repeat_on: '2;3'
      }
    })).toEqual(['1', '2', '3']);
  });

  it('find levels with repeat_on with -', () => {
    expect(findAllLevels({
      properties: {
        level: '1',
        repeat_on: '2-4'
      }
    })).toEqual(['1', '2', '3', '4']);
  });

  it('find levels with repeat_on with - and ;', () => {
    expect(findAllLevels({
      properties: {
        level: '-3',
        repeat_on: '-2-4;8'
      }
    })).toEqual(['-3', '-2', '-1', '0', '1', '2', '3', '4', '8']);
  });

  it('handle invalid values in repeat_on', () => {
    expect(findAllLevels({
      properties: {
        level: '0',
        repeat_on: '-2,8'
      }
    })).toEqual(['0']);
  });
});

describe('is poi', () => {
  [['amenity', 'cafe'], ['shop', 'leather' ], ['craft', 'caterer' ], ['leisure', 'dog_park' ], ['office', 'government' ], ['sport', 'archery' ], ['tourism', 'hotel' ], ['exhibit', 'artwork' ], ['door', 'yes' ]].forEach(([tag, value]) => {
    test(`returns true if feature has tag ${tag}`, () => {
      const feature = {
        type: 'Feature',
        properties: {
          indoor: 'room',
          level: '0',
          name: 'Test',
          [tag]: value
        },
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      };
      expect(isPoi(feature)).toBe(true);
    });
  });

  test(`returns false if feature has no tag`, () => {
    const feature = {
      type: 'Feature',
      properties: {
        indoor: 'room',
        level: '0',
        name: 'Test',
      },
      geometry: {
        type: 'LineString',
        coordinates: []
      }
    };
    expect(isPoi(feature)).toBe(false);
  });
});
