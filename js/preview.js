import { transformGeoJSONFile } from './geojson';
import { transformIMDFFile } from './imdf';
import { transformOSMFile } from './osm';

const transformers = {
  '.geojson': transformGeoJSONFile,
  '.zip': transformIMDFFile,
  '.osm': transformOSMFile,
};

export const fileFormats = Object.keys(transformers);

export function transform(file) {
  const extension = fileFormats.find((ext) => {
    return file.name.endsWith(ext);
  });
  const transformer = transformers[extension];
  return transformer(file);
}
