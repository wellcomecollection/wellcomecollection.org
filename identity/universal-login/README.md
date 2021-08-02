# Auth0 Universal Login customization

We use the Auth0 universal-login to customize aspects of our login page.

## Deploying

```
# Install dependencies
yarn

# Deploy to stage
yarn deploy-stage

# Deploy to prod
yarn deploy-prod
```

### Permissions

You will need to ensure the correct credentials are available to assume a role with the correct permissions in the identity account.

Ensure `./aws/credentials` contains:

```
[identity]
region=eu-west-1
role_arn=arn:aws:iam::770700576653:role/identity-developer
source_profile=default
```

Then run:

```
AWS_REGION=eu-west-1 AWS_PROFILE=identity yarn deploy-stage
```

## What does this deploy?

Auth0 is configured via terraform and deploy scripts in the [identity repo](https://github.com/wellcomecollection/identity).

The "universal-login" allows for text-customisation & login page template that cannot (yet) be terraformed or provisioned using the `a0deploy` CLI tool.

This package deploys the "Prompts" and templates that cannot be provisioned by other means.

### Prompts

https://auth0.com/docs/universal-login/new-experience/text-customization-new-universal-login

`Prompts` can be found in the `/prompt` folder.

### Templates

https://auth0.com/docs/universal-login/new-experience/universal-login-page-templates

At the moment there is only one template in `templates/universal-login.html`.

These templates are in the [liquid](https://shopify.github.io/liquid/) template language.
