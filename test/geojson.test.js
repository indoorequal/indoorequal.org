import { findAllLevels, transformGeoJSON } from '../js/geojson';

describe('Transform the geojson', () => {
  it('returns area data', () => {
    const featureCollection = {
      type: 'FeatureCollection',
      features: [
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
            name: 'Test',
          },
          geometry: {
            type: 'Polygon',
            coordinates: []
          }
        },
      ]
    };
    const featureResult = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            class: 'room',
            level: '0',
            name: 'Test',
          },
          geometry: {
            type: 'Polygon',
            coordinates: []
          }
        },
      ]
    };
    const result = transformGeoJSON(featureCollection);
    expect(result).toEqual({
      area: featureResult,
      area_name: featureResult,
    });
  });

  it('transform linestring feature to polygon', () => {
    const featureCollection = {
      type: 'FeatureCollection',
      features: [
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
      ]
    };
    const featureResult = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            class: 'room',
            level: '0',
            name: 'Test',
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[[0, 0], [1, 1], [2, 2], [3, 3], [0, 0]]]
          }
        },
      ]
    };
    const result = transformGeoJSON(featureCollection);
    expect(result).toEqual({
      area: featureResult,
      area_name: featureResult,
    });
  });

  it('expand indoor data by level', () => {
    const featureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            indoor: 'room',
            level: '0;1',
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
            name: 'Test',
          },
          geometry: {
            type: 'Polygon',
            coordinates: []
          }
        },
      ]
    };
    const featureResult = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            class: 'room',
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
            class: 'room',
            level: '1',
            name: 'Test',
          },
          geometry: {
            type: 'Polygon',
            coordinates: []
          }
        },
      ]
    };
    const result = transformGeoJSON(featureCollection);
    expect(result).toEqual({
      area: featureResult,
      area_name: featureResult,
    });
  });

  it('ignore non indoor features', () => {
    const featureCollection = {
      type: 'FeatureCollection',
      features: [
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
      ]
    };
    const result = transformGeoJSON(featureCollection);
    expect(result).toEqual({
      area: {
        type: 'FeatureCollection',
        features: []
      },
      area_name: {
        type: 'FeatureCollection',
        features: []
      },
    });
  });

  it('ignore invalid level features', () => {
    const featureCollection = {
      type: 'FeatureCollection',
      features: [
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
      ]
    };
    const result = transformGeoJSON(featureCollection);
    expect(result).toEqual({
      area: {
        type: 'FeatureCollection',
        features: []
      },
      area_name: {
        type: 'FeatureCollection',
        features: []
      },
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
