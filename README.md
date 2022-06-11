# indoorequal.org

A web based indoor viewer.

- display vector tiles from the [indoor= backend](https://github.com/indoorequal/indoorequal)
- render local or remote GeoJSON, OSM or [Indoor Mapping Data Format (IMDF)](https://register.apple.com/resources/imdf/) files
- provide an API to [control the viewer from another web page](#remote-command-api)

Discover:

- the backend: https://github.com/indoorequal/indoorequal
- the library to integrate indoor=: https://github.com/indoorequal/mapbox-gl-indoorequal

## Development

Using docker:

    ./script/server

And visit http://localhost:1234

## Configuration

A few configuration options are available by editing the `config.json` file:

- `mapTilerApiKey`: the [MapTiler](https://www.maptiler.com/) API Key
- `tilesUrl`: The URL of the indoor= tileJSON
- `indoorEqualApiKey`: the [indoor=](https://indoorequal.com/) API Key (optional if you don't use the official indoor= tileJSON
- `indoorMinZoom`: The minimum level of zoom when the indoor features are displayed

## Remote Command API

The remote command API allows you to interact with the viewer via the `window.postMessage()` method.
**Test page**: https://indoorequal.org/remote.html

**Example**

```javascript
const indoorEqualWindow = window.open("https://indoorequal.org/");
window.addEventListener('message', (e) => {
  if (e.data.event === 'ready') {
    const file = new File([JSON.stringify({type: 'FeatureCollection', features: []})], 'test.geojson');
    indoorEqualWindow.postMessage({ command: 'preview', file }, '*');
  }
});
```

**Open a preview**

With a file

Message: `{ command: 'preview', file: new File([], 'filename.geojson') }`

With an URL

Message: `{ command: 'preview', url: 'https://exemple.net/file.osm' }`

**Set level**

Message: `{ command: 'level', level: '0' }`

**Set coordinates**

Via the [bounding box](https://wiki.openstreetmap.org/wiki/Bounding_Box)

Message: `{ command: 'coordinates', bbox: [1.971874, 48.921259, 2.299404, 49.029990] }`

Via the center and the zoom

Message: `{ command: 'coordinates', center: { lng: 1.971874, lat: 48.921259 }, zoom: 1 }`

**Get levels**

Message: `{ command: 'levels' }`

Response: `{ event: 'levels', levels: ['0', '1', '2']}`

## Translation

Translations are managed via Transifex, [go here to translate it in your language](https://www.transifex.com/indoorequal/indoorequalorg/languages/).

## Deploy

Using docker:

    docker build -t indoor .
    docker run -p 8080:80 indoor

## License

GNU AGPL v3
