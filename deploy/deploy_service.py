#!/usr/bin/env python

import urllib, json, subprocess, sys

arg_service_name = sys.argv[1]


# It is assumed this is returning by last_updated
# We also filter out the test tag, as that's used for testing >.<
url = 'https://registry.hub.docker.com/v2/repositories/wellcome/wellcomecollection_%s_webapp/tags/' % arg_service_name
response = urllib.urlopen(url)
data = json.loads(response.read())
releases = [result for result in data.get('results') if result.get('name') != 'test']
latest_release = releases[0].get('name')

github_url = 'https://api.github.com/repos/wellcometrust/wellcomecollection.org/git/commits/%s' % latest_release
github_response = urllib.urlopen(github_url)
github_commit_message = json.loads(github_response.read()).get('message')

forward_march = raw_input(('Deploy:\n%s - %s\n(y/N): ' % (latest_release, github_commit_message)).encode('utf-8'))

if forward_march.lower().strip() == 'y':
  print 'Off we go!'
  subprocess.check_call(['./terraform_apply_service.sh', arg_service_name, latest_release])
