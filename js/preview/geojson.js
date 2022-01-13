import lineToPolygon from '@turf/line-to-polygon';
import centerOfMass from '@turf/center-of-mass';
import { poiClassAndSubclass } from './poi';

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
