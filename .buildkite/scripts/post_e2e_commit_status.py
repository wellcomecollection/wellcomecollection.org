"""
Posts a commit status with context e2e/<environment> for the deployed sha.

Authenticates as the wellcome-collection GitHub App using the same secrets
the github-deployments Buildkite plugin reads. The App needs statuses: write.
"""

import os
import sys
import time
from functools import cache

import boto3
import jwt
import requests

REPO = "wellcomecollection/wellcomecollection.org"
API = "https://api.github.com"


@cache
def secrets_client():
    return boto3.client("secretsmanager", region_name="eu-west-1")


@cache
def secret(name: str) -> str:
    return secrets_client().get_secret_value(SecretId=name)["SecretString"]


def installation_token() -> str:
    now = int(time.time())
    app_jwt = jwt.encode(
        {"iat": now - 60, "exp": now + 540, "iss": secret("github/weco_app/id")},
        secret("github/weco_app/private_key"),
        algorithm="RS256",
    )
    headers = {
        "Authorization": f"Bearer {app_jwt}",
        "Accept": "application/vnd.github+json",
    }
    installation = requests.get(
        f"{API}/repos/{REPO}/installation", headers=headers, timeout=10
    )
    installation.raise_for_status()
    token = requests.post(
        installation.json()["access_tokens_url"], headers=headers, timeout=10
    )
    token.raise_for_status()
    return token.json()["token"]


def main() -> None:
    state, description = sys.argv[1], sys.argv[2]
    sha = os.environ["BUILDKITE_COMMIT"]
    environment = os.environ["DEPLOYMENT_ENVIRONMENT"]

    response = requests.post(
        f"{API}/repos/{REPO}/statuses/{sha}",
        headers={
            "Authorization": f"Bearer {installation_token()}",
            "Accept": "application/vnd.github+json",
        },
        json={
            "state": state,
            "context": f"e2e/{environment}",
            "description": description[:140],
            "target_url": os.environ["BUILDKITE_BUILD_URL"],
        },
        timeout=10,
    )
    response.raise_for_status()
    print(f"Posted e2e/{environment} = {state} for {sha}")


if __name__ == "__main__":
    main()
