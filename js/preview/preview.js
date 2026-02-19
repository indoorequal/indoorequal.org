import { transformGeoJSONFile } from './geojson';
import { transformIMDFFile } from './imdf';
import { transformOSMFile } from './osm';

const transformers = new Map([
  [
    transformOSMFile,
    {
      types: ['application/vnd.openstreetmap.data+xml', 'application/xml'],
      ext: '.osm'
    }
  ],
  [
    transformGeoJSONFile,
    {
      types: ['application/geo+json', 'application/json'],
      ext: '.geojson'
    }
  ],
  [
    transformIMDFFile,
    {
      types: ['application/zip'],
      ext: '.zip'
    }
  ]
]);

export const fileFormats = [...transformers.values()].map((t) => t.ext);

function getTransformer(file) {
  for (const [fun, info] of transformers) {
    if (file.type) {
      for (const type of info.types) {
        if (file.type.startsWith(type)) {
          return fun;
        }
      }
    } else {
      if (file.name.endsWith(info.ext)) {
        return fun;
      }
    }
  }
}

export function transform(file) {
  const transformer = getTransformer(file);
  return transformer(file);
}
