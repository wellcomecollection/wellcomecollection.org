# Dashboard
Dashboard at <https://dash.wellcomecollection.org>.


## Deployments
1. Make sure you have packages installed (`yarn install`) and that `yarn build` has been run recently.
2. You will need to be logged into AWS with the correct role (`AWS_PROFILE=experience-developer`).
3. `yarn build` will have created an output folder (`out`). This is what will get deployed to S3.
4. Run `yarn deploy`.