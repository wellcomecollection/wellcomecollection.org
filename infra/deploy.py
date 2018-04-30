#!/usr/bin/env python

import json
import requests
import subprocess


wellcomecollection_docker_tags_url = (
    'https://registry.hub.docker.com/v2/repositories/wellcome/wellcomecollection/tags/'
)

wellcomecollection_github_commits_url = (
    'https://api.github.com/repos/wellcometrust/wellcomecollection.org/git/commits/%s'
)

def get_as_json(url):
    response = requests.get(url)
    return response.json()

def get_docker_releases():
    data = get_as_json(wellcomecollection_docker_tags_url)
    return [result for result in data.get('results') if result.get('name') != 'test']

def get_github_commit_message(ref):
    data = get_as_json(wellcomecollection_github_commits_url % ref)
    return data.get('message')
    

docker_releases = get_docker_releases()
latest_release = docker_releases[0].get('name')
github_commit_message = get_github_commit_message(latest_release)

forward_march = input(('Deploy:\n%s - %s\n(y/N): ' % (latest_release, github_commit_message)).encode('utf-8'))

if forward_march.lower().strip() == 'y':
    print('Off we go!')
    subprocess.check_call(['./apply_task_definition.sh', latest_release])
