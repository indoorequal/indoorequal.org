# Indoor viewer on OSM data

An experimental indoor viewer based on OSM Data.

## Development

Using docker:

    ./script/server

And visit http://localhost:1234

## Deploy

Using docker:

    docker build -t indoor .
    docker run -p 8080:80 indoor

## License

GNU AGPL v3
