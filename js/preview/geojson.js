import lineToPolygon from '@turf/line-to-polygon';
import centerOfMass from '@turf/center-of-mass';
import poiMapping from './poimapping.json';

function extractLevelsFromRepeatOn(repeatOn) {
  return repeatOn.split(';').flatMap((level) => {
    const withInterval = level.match(/^(-?\d+)-(-?\d+)$/);
    const withNumeric = level.match(/^(-?\d+\.?\d?)$/);
    if (withInterval) {
      const start = parseInt(withInterval[1], 10);
      const end = parseInt(withInterval[2], 10);
      return Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString());
    } else if (withNumeric) {
      return level;
    }
  }).filter(l => l);
}

export function findAllLevels(feature) {
  const repeatOnLevels = feature.properties.repeat_on ? extractLevelsFromRepeatOn(feature.properties.repeat_on) : [];
  const levels = feature.properties.level.split(';');
  return levels.concat(repeatOnLevels);
}

export function poiClassAndSubclass(feature) {
  const result = Object.entries(feature.properties).find(([key, value]) => {
    return poiMapping[key] && poiMapping[key].includes(value);
  });
  if (result) {
    const [mappingKey, mappingValue] = result;
    return [poiClass(mappingValue, mappingKey), poiSubclass(feature, mappingValue)];
  }
  return null;
}

function poiSubclass(feature, subclass) {
  const mapping = {
    information: 'information',
    place_of_worship: 'religion',
    pitch: 'sport',
    vending_machine: 'vending'
  };
  if (mapping[subclass]) {
    return feature.properties[mapping[subclass]];
  }
  return subclass;
}

function poiClass(subclass, mappingKey) {
  if (['accessories','antiques','beauty','bed','boutique','camera','carpet','charity','chemist','coffee','computer','convenience','copyshop','cosmetics','garden_centre','doityourself','erotic','electronics','fabric','florist','frozen_food','furniture','video_games','video','general','gift','hardware','hearing_aids','hifi','ice_cream','interior_decoration','jewelry','kiosk','lamps','mall','massage','motorcycle','mobile_phone','newsagent','optician','outdoor','perfumery','perfume','pet','photo','second_hand','shoes','sports','stationery','tailor','tattoo','ticket','tobacco','toys','travel_agency','watches','weapons','wholesale', 'locksmith', 'tea', 'frame', 'ticket', 'kitchen', 'houseware', 'fashion_accessories', 'variety_store'].includes(subclass)) {
    return 'shop';
  }
  if (['townhall','public_building','courthouse','community_centre'].includes(subclass)) {
    return 'town_hall';
  }
  if (['golf','golf_course','miniature_golf'].includes(subclass)) {
    return  'golf';
  }
  if (['fast_food','food_court'].includes(subclass)) {
    return 'fast_food';
  }
  if (['park','bbq'].includes(subclass)) {
    return subclass;
  }
  if (['bus_stop','bus_station'].includes(subclass)) {
    return 'bus';
  }
  if ((subclass === 'station' && mapping_key === 'railway') || ['halt', 'tram_stop', 'subway'].includes(subclass)) {
    return 'railway';
  }
  if (['subway_entrance','train_station_entrance'].includes(subclass)) {
    return 'entrance';
  }
  if (['camp_site','caravan_site'].includes(subclass)) {
    return 'campsite';
  }
  if (['laundry','dry_cleaning'].includes(subclass)) {
    return 'laundry';
  }
  if (['greengrocer'].includes(subclass)) {
    return 'greengrocer';
  }
  if (['supermarket','deli','delicatessen','department_store','marketplace', 'seafood', 'cheese'].includes(subclass)) {
    return 'grocery';
  }
  if (['books','library'].includes(subclass)) {
    return 'library';
  }
  if (['university','college'].includes(subclass)) {
    return 'college';
  }
  if (['hotel','motel','bed_and_breakfast','guest_house','hostel','chalet','alpine_hut','dormitory'].includes(subclass)) {
    return 'lodging';
  }
  if (['chocolate','confectionery'].includes(subclass)) {
    return 'pastry';
  }
  if (['post_box','post_office'].includes(subclass)) {
    return 'post';
  }
  if (['cafe'].includes(subclass)) {
    return 'cafe';
  }
  if (['school','kindergarten'].includes(subclass)) {
    return 'school';
  }
  if (['alcohol','beverages','wine'].includes(subclass)) {
    return 'alcohol_shop';
  }
  if (['bar','nightclub'].includes(subclass)) {
    return 'bar';
  }
  if (['marina','dock'].includes(subclass)) {
    return 'harbor';
  }
  if (['car','car_repair','taxi'].includes(subclass)) {
    return 'car';
  }
  if (['hospital','nursing_home', 'clinic'].includes(subclass)) {
    return 'hospital';
  }
  if (['grave_yard','cemetery'].includes(subclass)) {
    return 'cemetery';
  }
  if (['attraction','viewpoint'].includes(subclass)) {
    return 'attraction';
  }
  if (['biergarten','pub'].includes(subclass)) {
    return 'beer';
  }
  if (['music','musical_instrument'].includes(subclass)) {
    return 'music';
  }
  if (['american_football','stadium','soccer'].includes(subclass)) {
    return 'stadium';
  }
  if (['art','artwork','gallery','arts_centre'].includes(subclass)) {
    return 'art_gallery';
  }
  if (['bag','clothes', 'leather'].includes(subclass)) {
    return 'clothing_store';
  }
  if (['swimming_area','swimming'].includes(subclass)) {
    return 'swimming';
  }
  if (['castle','ruins'].includes(subclass)) {
    return 'castle';
  }
  if (['bank', 'bureau_de_change', 'atm'].includes(subclass)) {
    return 'bank';
  }
  if (['door', 'entrance'].includes(mappingKey)) {
    return 'entrance';
  }
  if (['exhibit'].includes(mappingKey)) {
    return 'exhibit';
  }
  if (['craft'].includes(mappingKey)) {
    return 'craft';
  }
  return subclass;
}

export function isPoi(feature) {
  return !!poiClassAndSubclass(feature);
}

function expandLevels(feature) {
  return findAllLevels(feature).map((level) => {
    return {
      ...feature,
      properties: {
        ...feature.properties,
        level
      }
    }
  });
}

export function transformTransportationFeatures(indoorFeatures) {
  return indoorFeatures.filter((feature) => {
    return feature.properties.highway === 'steps';
  }).map((feature) => {
    return {
      ...feature,
      properties: {
        ...feature.properties,
        class: feature.properties.highway,
        highway: undefined
      }
    };
  });
}

export function transformAreaFeatures(indoorFeatures) {
  return indoorFeatures.filter((feature) => {
    return ['room', 'area', 'corridor', 'platform', 'wall', 'column'].includes(feature.properties.indoor);
  }).map((feature) => {
    return {
      ...feature,
      properties: {
        ...feature.properties,
        class: feature.properties.indoor,
        indoor: undefined,
        is_poi: isPoi(feature)
      }
    };
  }).map((feature) => {
    if (['LineString', 'MultiLineString'].includes(feature.geometry.type) && feature.properties.class !== 'wall') {
      return lineToPolygon(feature);
    }
    return feature;
  });
}

export function transformPoiFeatures(indoorFeatures) {
  return indoorFeatures.filter((feature) => {
    return isPoi(feature);
  }).map((feature, index) => {
    const [classe, subclass] = poiClassAndSubclass(feature)
    return {
      ...feature,
      properties: {
        id: `poi_${index}`,
        ...feature.properties,
        class: classe,
        subclass,
        'name:latin': feature.properties.name
      }
    };
  }).map((feature) => {
    if (feature.geometry.type !== 'Point') {
      const featureCenter = centerOfMass(feature);
      return {
        ...featureCenter,
        properties: feature.properties,
      };
    }
    return feature;
  });
}

export function filterIndoorFeatures(features) {
  return features.filter((feature) => {
    return feature.properties && feature.properties.level && feature.properties.level.match(/^-?\d+\.?\d*(;-?\d+\.?\d*)*$/);
  });
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      resolve(reader.result);
    });
    reader.readAsText(file);
  });
}

export async function transformGeoJSONFile(file) {
  const featureCollection = JSON.parse(await readFileAsText(file));
  return transformGeoJSON(featureCollection);
}

export function transformGeoJSON(featureCollection) {
  const indoorFeatures = filterIndoorFeatures(featureCollection.features);
  const areaFeatures = transformAreaFeatures(indoorFeatures).flatMap(expandLevels);
  const transportationFeatures = transformTransportationFeatures(indoorFeatures).flatMap(expandLevels);
  const poiFeatures = transformPoiFeatures(indoorFeatures).flatMap(expandLevels);
  return {
    area: {
      type: 'FeatureCollection',
      features: areaFeatures,
    },
    area_name: {
      type: 'FeatureCollection',
      features: areaFeatures.filter(feature => !isPoi(feature)),
    },
    transportation: {
      type: 'FeatureCollection',
      features: transportationFeatures,
    },
    poi: {
      type: 'FeatureCollection',
      features: poiFeatures,
    },
  };
}
