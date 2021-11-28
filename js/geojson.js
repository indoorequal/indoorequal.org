import lineToPolygon from '@turf/line-to-polygon';

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

export function transformGeoJSON(featureCollection) {
  const indoorFeatures = featureCollection.features.filter((feature) => {
    return feature.properties.level && feature.properties.level.match(/^-?\d+\.?\d*(;-?\d+\.?\d*)*$/);
  });
  const areaFeatures = indoorFeatures.filter((feature) => {
    return ['room', 'area', 'corridor', 'platform', 'wall', 'column'].includes(feature.properties.indoor);
  }).map((feature) => {
    return {
      ...feature,
      properties: {
        ...feature.properties,
        class: feature.properties.indoor,
        indoor: undefined
      }
    }
  }).map((feature) => {
    if (feature.geometry.type !== 'Polygon' && feature.properties.class !== 'wall') {
      return lineToPolygon(feature);
    }
    return feature;
  }).flatMap(expandLevels);
  return {
    area: {
      type: 'FeatureCollection',
      features: areaFeatures,
    },
    area_name: {
      type: 'FeatureCollection',
      features: areaFeatures,
    }
  };
}
