import {
  unitCategoryToClass,
  unitFeatureToAccess,
  unitFeatureIsPoi,
  transformAreaFeatures,
  transformOccupantFeatures,
  transformOpeningFeatures,
  transformAmenityFeatures,
} from '../js/preview/imdf';

describe('unitCategoryToClass', () => {
  const categories = {
    'auditorium': 'room',
    'brick': 'column',
    'classroom': 'room',
    'column': 'column',
    'concrete': 'column',
    'conferenceroom': 'room',
    'drywall': 'room',
    'elevator': 'room',
    'escalator': 'room',
    'fieldofplay': 'room',
    'firstaid': 'room',
    'fitnessroom': 'room',
    'foodservice': 'room',
    'footbridge': 'room',
    'glass': 'room',
    'huddleroom': 'room',
    'kitchen': 'room',
    'laboratory': 'room',
    'library': 'room',
    'lobby': 'room',
    'lounge': 'room',
    'mailroom': 'room',
    'mothersroom': 'room',
    'movietheater': 'room',
    'movingwalkway': 'room',
    'nonpublic': 'room',
    'office': 'room',
    'opentobelow': 'room',
    'parking': 'room',
    'phoneroom': 'room',
    'platform': 'room',
    'privatelounge': 'room',
    'ramp': 'room',
    'recreation': 'room',
    'restroom': 'room',
    'restroom.family': 'room',
    'restroom.female': 'room',
    'restroom.female.wheelchair': 'room',
    'restroom.male': 'room',
    'restroom.male.wheelchair': 'room',
    'restroom.transgender': 'room',
    'restroom.transgender.wheelchair': 'room',
    'restroom.unisex': 'room',
    'restroom.unisex.wheelchair': 'room',
    'restroom.wheelchair': 'room',
    'road': 'room',
    'room': 'room',
    'serverroom': 'room',
    'shower': 'room',
    'smokingarea': 'room',
    'stairs': 'room',
    'steps': 'room',
    'storage': 'room',
    'structure': 'column',
    'terrace': 'room',
    'theater': 'room',
    'unenclosedarea': 'area',
    'unspecified': 'room',
    'vegetation': 'room',
    'waitingroom': 'room',
    'walkway': 'corridor',
    'walkway.island': 'room',
    'wood': 'room',
  };

  Object.entries(categories).forEach(([category, className]) => {
    it(`returns class ${className} from IMDF category ${category}`, () => {
      expect(unitCategoryToClass(category)).toEqual(className);
    });
  });
});

describe('unitFeatureToAccess', () => {
  ['employeesonly', 'restricted'].forEach((restriction) => {
    it(`returns no for ${restriction} restriction`, () => {
      const unitFeature = {
        type: 'Feature',
        properties: {
          category: 'room',
          restriction,
        },
      };
      expect(unitFeatureToAccess(unitFeature)).toEqual('no');
    });
  });

  it(`returns no when category is nonpublic`, () => {
    const unitFeature = {
      type: 'Feature',
      properties: {
        category: 'nonpublic',
        restriction: null,
      },
    };
    expect(unitFeatureToAccess(unitFeature)).toEqual('no');
  });

  it(`returns yes when category is room`, () => {
    const unitFeature = {
      type: 'Feature',
      properties: {
        category: 'room',
        restriction: null,
      },
    };
    expect(unitFeatureToAccess(unitFeature)).toEqual('yes');
  });
});

describe('unitFeatureIsPoi', () => {
  it('returns true when feature is a restroom', () => {
    const unitFeature = {
      type: 'Feature',
      properties: {
        category: 'restroom.unisex',
      },
    };
    expect(unitFeatureIsPoi(unitFeature)).toBe(true);
  });

  it('returns true when feature is a rool', () => {
    const unitFeature = {
      type: 'Feature',
      properties: {
        category: 'room',
      },
    };
    expect(unitFeatureIsPoi(unitFeature)).toBe(false);
  });
});

describe('transformAreaFeatures', () => {
  it('return area features from unit.geojson', () => {
    const unitFeatures = [{
      type: 'Feature',
      properties: {
        category: 'walkway',
        level_id: 'L1',
      },
    }];
    const levels = {
      L1: '1'
    };
    const result = transformAreaFeatures(unitFeatures, levels);
    expect(result).toEqual([{
      type: 'Feature',
      properties: {
        category: 'walkway',
        level_id: 'L1',
        class: 'corridor',
        is_poi: false,
        access: 'yes',
        level: '1'
      },
    }]);
  });
});

describe('transformOccupantFeatures', () => {
  it('transform occupants to POI', () => {
    const unitFeatures = [{
      type: 'Feature',
      id: 'unitId',
      properties: {
        category: 'walkway',
        level_id: 'L1',
      },
    }];
    const anchorFeatures = [{
      type: 'Feature',
      id: 'anchorId',
      geometry: {
        type: 'Point'
      },
      properties: {
        unit_id: 'unitId',
      },
    }];
    const occupantFeatures = [{
      type: 'Feature',
      properties: {
        anchor_id: 'anchorId',
        category: 'coffee',
        name: {
          en: 'Test'
        },
        hours: 'Mo-Fr 08:00-18:00',
        website: 'http://example.net',
        phone: '123456',
      }
    }];
    const levelsById = {
      L1: '1'
    };
    const result = transformOccupantFeatures(unitFeatures, anchorFeatures, occupantFeatures, levelsById);
    expect(result).toEqual([{
      geometry: {
        type: 'Point',
      },
      properties: {
        id: 'poi_0',
        class: 'shop',
        subclass: 'coffee',
        shop: 'coffee',
        name: 'Test',
        'name:latin': 'Test',
        level: '1',
        opening_hours: 'Mo-Fr 08:00-18:00',
        website: 'http://example.net',
        phone: '123456',
      }
    }])
  });
});

describe('transformOpeningFeatures', () => {
  it('transform opening to POI', () => {
    const openingFeatures = [{
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [-123.4304155, 48.6405846],
          [-123.4304278, 48.6405859]
        ]
      },
      properties: {
        category: 'service',
        level_id: 'L1'
      }
    }];
    const levelsById = {
      L1: '1'
    };
    const result = transformOpeningFeatures(openingFeatures, levelsById);
    expect(result).toEqual([{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-123.43042165, 48.64058525],
      },
      properties: {
        id: 'poi_door_0',
        door: 'yes',
        class: 'entrance',
        subclass: 'door',
        level: '1',
      }
    }])
  });
});

describe('transformAmenityFeatures', () => {
  it('transform amenity to POI', () => {
    const unitFeatures = [{
      type: 'Feature',
      id: 'unitId',
      properties: {
        category: 'walkway',
        level_id: 'L1',
      },
    }];
    const amenityFeatures = [{
      type: 'Feature',
      geometry: {
        type: 'Point'
      },
      properties: {
        unit_ids: ['unitId'],
        category: 'atm',
        hours: 'Mo-Fr 08:00-18:00',
        website: 'http://example.net',
        phone: '123456',
      }
    }];
    const levelsById = {
      L1: '1'
    };
    const result = transformAmenityFeatures(unitFeatures, amenityFeatures, levelsById);
    expect(result).toEqual([{
      type: 'Feature',
      geometry: {
        type: 'Point',
      },
      properties: {
        id: 'poi_amenity_0',
        class: 'bank',
        subclass: 'atm',
        amenity: 'atm',
        level: '1',
        opening_hours: 'Mo-Fr 08:00-18:00',
        website: 'http://example.net',
        phone: '123456',
      }
    }])
  });
});
