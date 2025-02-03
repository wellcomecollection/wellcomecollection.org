# Developer NGINX configuration scripts

The scripts in this folder assist with the configuration of a local nginx installation for development purposes.

These scripts have been shamelessly adapted (mostly copied) from https://github.com/guardian/dev-nginx. Credit to
the developers of that project!

## Usage

Run the `configure-local-apis.sh` script in the parent directory.

You can view the nginx configuration files in [weco-local.conf](./weco-local.conf), 
it depends on thelocal APIs to be started successfully, and use the specified ports.

- Catalogue Search, Works & Images API: http://localhost:8080
- Catalogue Items API: http://localhost:8081
- Concept API: http://localhost:3001
- Content API: http://localhost:3002

Configuration for Identity, Accounts and Requests is not included in this script.