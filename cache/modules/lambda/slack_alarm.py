#!/usr/bin/env python

import gzip
import json
from pprint import pprint
import urllib.request
import urllib.parse

import boto3


def get_cloudfront_logs(sess, *, bucket, key):
    """
    Generates the CloudFront log entries for a given log file in S3.
    """
    s3_client = sess.client('s3')

    s3_object = s3_client.get_object(Bucket=bucket, Key=key)
    unzipped_object = gzip.open(s3_object["Body"])

    assert next(unzipped_object) == b'#Version: 1.0\n'

    fields = next(unzipped_object).replace(b'#Fields:', b'').strip().split()

    for line in unzipped_object:
        values = line.strip().split()

        result = dict(zip(fields, values))
        result[b'sc-status'] = int(result[b'sc-status'])

        yield result


def main(event, *args, **kwargs):
    sess = boto3.Session()

    bad_urls = []

    for record in event["Records"]:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']

        print(f"Inspecting CloudFront logs in s3://{bucket}/{key}...")

        for hit in get_cloudfront_logs(sess, bucket=bucket, key=key):
            if hit[b'sc-status'] < 500:
                continue

            protocol = hit[b'cs-protocol'].decode('utf8')
            host = hit[b'x-host-header'].decode('utf8')
            path = hit[b'cs-uri-stem'].decode('utf8')
            query = hit[b'cs-uri-query'].decode('utf8')

            bad_urls.append({
                'status': hit[b'sc-status'],
                'url': f'{protocol}://{host}{path}?{query}'
            })

        if not bad_urls:
            print("no errors in this CloudFront log, nothing to do")
            continue

        secrets_client = sess.client("secretsmanager")
        webhook_url = secrets_client.get_secret_value(SecretId="monitoring/monitoring/critical_slack_webhook")["SecretString"]

        message = "The following URLs had errors in CloudFront:\n```\n" + "\n".join(
            f"{error['status']} {error['url']}"
            for error in bad_urls
        ) + "\n```"

        s3_url_prefix = urllib.parse(['prefix', key])
        s3_link = "👉 <https://us-east-1.console.aws.amazon.com/s3/object/{bucket}?{s3_url_prefix}&region=us-east-1#|View the CloudFront logs in S3>"

        slack_payload = {
            "username": "cloudfront-errors",
            "icon_emoji": ":rotating_light:",
            "attachments": [
                {
                    "color": "danger",
                    "fallback": "cloudfront-errors",
                    "title": "5xx errors from CloudFront",
                    "fields": [
                        {
                            "value": message
                        }, { "value": s3_link }]
                }]
        }

        req = urllib.request.Request(
            webhook_url,
            data=json.dumps(slack_payload).encode("utf8"),
            headers={"Content-Type": "application/json"},
        )
        resp = urllib.request.urlopen(req)
        assert resp.status == 200, resp


if __name__ == '__main__':
    for line in get_cloudfront_logs(boto3.Session(), bucket='wellcomecollection-experience-cloudfront-logs', key='wellcomecollection.org/prod/ENN4F9Q8E3GW9.2022-05-18-14.3b395837.gz'):
        if int(line[b'sc-status']) < 500:
            continue
        pprint(line)
        break