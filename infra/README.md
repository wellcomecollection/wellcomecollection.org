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

Be very careful of not checking these in, `tfvars` are excluded from git at the root level,
but probably worth mentioning.

If you noticed there is a reference to a key file there, you will need to get that too. 
 
Once that's done run:

    ./airbag.js
    
You'll be asked to select the build bucket and build number.
You can ge the build number from [cirleci](https://circleci.com/gh/wellcometrust/wellcomecollection.org).
__Please only deploy master, as those are the only artifacts that exist__.

That should deploy your changes once all the LBs and instances are reporting healthy.
