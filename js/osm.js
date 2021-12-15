import osmtogeojson from '@map-gl-indoor/osmtogeojson';
import { readFileAsText, transformGeoJSON } from './geojson';

export async function transformOSMFile(file) {
  const xmlText = await readFileAsText(file);
  const xml = new DOMParser().parseFromString(xmlText, 'text/xml');
  const featureCollection = osmtogeojson(xml);
  return transformGeoJSON(featureCollection);
}
