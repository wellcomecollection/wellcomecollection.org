# Deploy

To deploy you will have to have the [AWS CLI installed](http://docs.aws.amazon.com/cli/latest/userguide/installing.html#install-with-pip)
and your [AWS credentials setup](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html). 

To get deploying, you'll need to get some `tfvars` from a friendly developer near you.
Save them in `terraform/terraform.tfvars`.

They well look something like:
 
    aws_access_key               = "KEY"
    aws_secret_key               = "SECRETSHHH"
    wellcomecollection_key_path  = "/Users/hank/.ssh/key.pub"
    wellcomecollection_key_name  = "KEY_NAME"
    build_bucket                 = "BUCKET"

Be very careful of not checking these in, `tfvars` are excluded from git at the root level,
but probably worth mentioning.

If you noticed there is a reference to a key file there, you will need to get that too. 
 
Once that's done run:

    ./airbag.sh <BUILD_STATE_BUCKET>
    
You'll be asked for a build number - get that from [cirleci](https://circleci.com/gh/wellcometrust/wellcomecollection.org).

That should deploy your changes once all the LBs and instances are reporting healthy.
