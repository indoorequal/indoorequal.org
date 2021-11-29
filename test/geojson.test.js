import {
  filterIndoorFeatures,
  findAllLevels,
  transformGeoJSON,
  transformAreaFeatures,
  transformTransportationFeatures,
  isPoi
} from '../js/geojson';

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
  ['amenity', 'shop', 'craft', 'leisure', 'office', 'sport', 'tourism', 'exhibit', 'door'].forEach((tag) => {
    test(`returns true if feature has tag ${tag}`, () => {
      const feature = {
        type: 'Feature',
        properties: {
          indoor: 'room',
          level: '0',
          name: 'Test',
          [tag]: 'restaurant'
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
