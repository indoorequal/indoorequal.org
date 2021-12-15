import osm2geojson from 'osm2geojson-lite';
import { readFileAsText, transformGeoJSON } from './geojson';

export async function transformOSMFile(file) {
  const xmlText = await readFileAsText(file);
  const featureCollection = osm2geojson(xmlText, { completeFeature: true });
  return transformGeoJSON(featureCollection);
}
