# this tells Make to run 'make e2e' if the user runs 'make'
# without this, Make would use the first target as the default
#This is in case we want to add more commands to the make file
.DEFAULT_GOAL := e2e

e2e:
	@echo "Running catalogue tests"
	cd catalogue/webapp && NODE_ENV=test jest --no-cache
	@echo "Running content tests"
	cd content/webapp && NODE_ENV=test jest --no-cache
	@#echo "Running playwright tests" && cd playwright && PLAYWRIGHT_BASE_URL=https://www-stage.wellcomecollection.org yarn test
	@echo "Running playwright mobile tests" && cd playwright && PLAYWRIGHT_BASE_URL=https://www-stage.wellcomecollection.org NODE_ENV=test platform=mobile yarn test
