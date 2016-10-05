# Wellcome patterns (node app)
This repo contains some sensible defaults for Sass/JS architecture, as well as a barebones starter for layouts and grids.

## Prerequisites
You will need the following things properly installed on your computer.
* [Git](http://git-scm.com/)
* [Gulp](http://gulpjs.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Homebrew](http://brew.sh/_)

## Installation
* `git clone https://github.com/wellcometrust/wellcome-patterns-node`
* `cd wellcome-patterns-node`
* `npm install`
* `brew install selenium-server-standalone`

## Compile assets
* `gulp`

## Start an Express server
* `npm start`
* The site should then be running at [http://localhost:3000](http://localhost:3000)

## Testing
* `selenium-server -port 4444`
* `npm test` to run all tests
* `npm test:unit` to run unit tests
* `npm test:integration` to run integration tests
