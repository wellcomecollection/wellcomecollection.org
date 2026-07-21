# Developer NGINX configuration scripts

The scripts in this folder assist with the configuration of a local nginx installation for development purposes.

These scripts have been shamelessly adapted (mostly copied) from https://github.com/guardian/dev-nginx. Credit to
the developers of that project!

## Usage

Run the `configure-local-apis.sh` script in the parent directory, or `yarn config-local-apis` from the root of the repository.

You can view the nginx configuration files in [weco-local.conf](./weco-local.conf).
It depends on the local APIs being started successfully and using the specified ports.

- Catalogue Search, Works & Images API: http://localhost:8080
- Catalogue Items API: http://localhost:8081
- Concept API: http://localhost:3001
- Content API: http://localhost:3002

Configuration for Identity, Accounts and Requests is not included in this script.