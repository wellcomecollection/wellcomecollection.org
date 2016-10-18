# Deploy

## Dependencies

- [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html#install-with-pip)
- [AWS credentials](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
- [Terraform](https://www.terraform.io/intro/getting-started/install.html)

## Setup

- You'll need to get some `tfvars` from a friendly developer near you.
  Save them in `terraform/terraform.tfvars`.

  They will look something like:

      aws_access_key               = "KEY"
      aws_secret_key               = "SECRETSHHH"
      wellcomecollection_key_path  = "/Users/hank/.ssh/key.pub"
      wellcomecollection_key_name  = "KEY_NAME"

- Acquire the public key file from a friendly Wellcome Collection developer near you.

  Once you've got that you'll need to save it locally and reference it to `wellcomecollection_key_path`
  in your `tfvars` file.

Be very careful of not checking these in, `tfvars` are excluded from git at the root level,
but probably worth mentioning.

Once that's done run:

    `./airbag.js`

You'll be asked to select the build bucket and build number.
You can ge the build number from [cirleci](https://circleci.com/gh/wellcometrust/wellcomecollection.org).
__Please only deploy master, as those are the only artifacts that exist__.

That should deploy your changes once all the LBs and instances are reporting healthy.
