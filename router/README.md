# Wellcome Collection Router

An nginx proxy to route traffic for wellcomecollection.org

This application is split into a seperate stack.

## Deploying

Run:

```sh
./docker-build.sh my-tag
./docker-push.sh my-tag
```

Update `./terraform/variables.tf`:

```
variable "nginx_uri" {
  default = "wellcome/wellcomecollection-router:my-tag"
}
```

Terraform:

```
# If it's your first run
terraform init
terraform get

# If not, you might get away with just
terraform plan -out terraform.plan

# Inspect the output and be sure

terraform apply terraform.plan
