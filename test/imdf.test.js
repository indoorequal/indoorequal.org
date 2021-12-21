import {
  unitCategoryToClass,
  unitFeatureToAccess,
  unitFeatureIsPoi,
  transformAreaFeatures,
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
