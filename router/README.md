# Wellcome Collection Router

An nginx proxy to route traffic for wellcomecollection.org

This application is split into a seperate stack.


## To run a dev version

You can run a dev version by installing Nginx, and starting it with
the router's conf file:

```sh
nginx -c /path/to/project/wellcomecollection.org/router/nginx.conf
```

If you need to test changes on the app too,
you can then set the v2 upstream to `localhost:3000`. 


_TODO:_ Improve dev experience.


## Deploying

Run:

```sh
./docker-build.sh my-tag
./docker-push.sh my-tag
```

Update `./terraform/variables.tf`:

```
variable "key_name" {
  default = "KEY_NAME"
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
