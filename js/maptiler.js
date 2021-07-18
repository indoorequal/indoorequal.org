import { mapTilerApiKey } from '../config.json';

export async function fetchGeocoding(search) {
  const geocodingRequest = await fetch(`https://api.maptiler.com/geocoding/${search}.json?key=${mapTilerApiKey}`);
  return geocodingRequest.json();
}

export function mapStyle() {
  return `https://api.maptiler.com/maps/bright/style.json?key=${mapTilerApiKey}`;
}
