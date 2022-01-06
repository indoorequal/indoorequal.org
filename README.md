# indoorequal.org

An indoor viewer based on OSM Data. This repository is the frontend part.

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

`{ command: 'preview', file: new File([], 'filename.geojson') }`

With an URL

`{ command: 'preview', url: '' }`

**Set level**

`{ command: 'level', level: '0' }`

**Set coordinates**

Via the [bounding box](https://wiki.openstreetmap.org/wiki/Bounding_Box)

`{ command: 'coordinates', bbox: [1.971874, 48.921259, 2.299404, 49.029990] }`

Via the center and the zoom

`{ command: 'coordinates', center: { lng: 1.971874, lat: 48.921259 }, zoom: 1 }`

## Translation

Translations are managed via Transifex, [go here to translate it in your language](https://www.transifex.com/indoorequal/indoorequalorg/languages/).

## Deploy

Using docker:

    docker build -t indoor .
    docker run -p 8080:80 indoor

## License

GNU AGPL v3
