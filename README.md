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

## Translation

Translations are managed via Transifex, [go here to translate it in your language](https://www.transifex.com/indoorequal/indoorequalorg/languages/).

## Deploy

Using docker:

    docker build -t indoor .
    docker run -p 8080:80 indoor

## License

GNU AGPL v3
