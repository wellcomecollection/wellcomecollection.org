#!/usr/bin/env bash
<<EOF
Trigger a deployment of an ECS service.

This script is mirrored from our Scala repos.

== How we manage ECS services ==

Our ECS services use task definitions that point to floating ECR tags,
e.g. 'env.stage'.  By changing where this tag points, we can run new images
in a service without going through a whole Terraform plan/apply.

(See update_ecr_image_tag.sh for more detail on our image tags.)

Once we've updated the value of the tag, we need ECS to redeploy the services
and pick up the new images.  This script does that redeployment, and waits
for services to be stable.

== Usage examples ==

    CLUSTER="catalogue-api-2021-04-26" redeploy_ecs_services.sh stage-concepts-api

        This will redeploy the 'stage-concepts-api' service in the
        'catalogue-api-2021-04-26' cluster.

    CLUSTER="catalogue-api-2021-04-26" redeploy_ecs_services.sh stage-concepts-api stage-items-api stage-search-api

        This will update redeploy three services in the cluster.

        More generally you can supply an arbitrary number of ECS services as
        additional arguments, and they will all be redeployed.

EOF

set -o errexit
set -o nounset

for serviceName in "$@"
do
  echo "Forcing a new deployment of $serviceName in $CLUSTER"
  aws ecs update-service \
    --cluster "$CLUSTER" \
    --service "$serviceName" \
    --force-new-deployment >/dev/null
done

for serviceName in "$@"
do
  echo "Waiting for $serviceName to be stable"
  aws ecs wait services-stable \
    --cluster "$CLUSTER" \
    --service "$serviceName"
  echo "Done! $serviceName is stable"
done
