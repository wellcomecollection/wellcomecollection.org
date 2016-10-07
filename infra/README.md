# Deploy

To get deploying, you'll need to get some `tfvars` from a friendly developer near you.
Once that's done run:

    ./airbag.sh <BUILD_STATE_BUCKET>
    
You'll be asked for a build number - get that from [cirleci](https://circleci.com/gh/wellcometrust/wellcomecollection.org).

That should deploy your changes once all the LBs and instances are reporting healthy.
