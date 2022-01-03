import JSZip from 'jszip';

const categories = {
  brick: 'column',
  column: 'column',
  concrete: 'column',
  structure: 'column',
  unenclosedarea: 'area',
  walkway: 'corridor',
};

export function unitCategoryToClass(category) {
  return categories[category] ? categories[category] : 'room';
}

export function unitFeatureToAccess(feature) {
  if (['employeesonly', 'restricted'].includes(feature.properties.restriction)
     || feature.properties.category === 'nonpublic') {
    return 'no';
  }
  return 'yes';
};

export function unitFeatureIsPoi(feature) {
  return feature.properties.category.startsWith('restroom');
}

export function transformAreaFeatures(units, levelsById) {
  return units.map((feature) => {
    return {
      ...feature,
      properties: {
        ...feature.properties,
        class: unitCategoryToClass(feature.properties.category),
        is_poi: unitFeatureIsPoi(feature),
        access: unitFeatureToAccess(feature),
        level: levelsById[feature.properties.level_id]
      }
    };
  });
}

async function readFileJSONFromZip(zip, filename) {
  return JSON.parse(await zip.file(filename).async('string'));
}

export async function transformIMDFFile(file) {
  const zip = await JSZip.loadAsync(file);
  const levels = await readFileJSONFromZip(zip, 'level.geojson');
  const units = await readFileJSONFromZip(zip, 'unit.geojson');
  const levelsById = levels.features.reduce((memo, level) => {
    memo[level.id] = level.properties.short_name.en;
    return memo;
  }, {});
  return {
    area: {
      type: 'FeatureCollection',
      features: transformAreaFeatures(units.features, levelsById)
    }
  };
}
