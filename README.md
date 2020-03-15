# indoorequal.org

An indoor viewer based on OSM Data. This repository is the frontend part. The backend is available here: https://github.com/indoorequal/indoorequal

## Development

Using docker:

    ./script/server

And visit http://localhost:1234

## Translation

You can add or edit translation files in the `locales` dir.

## Deploy

Using docker:

    docker build -t indoor .
    docker run -p 8080:80 indoor

## License

GNU AGPL v3
