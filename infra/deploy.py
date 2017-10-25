#!/usr/bin/env python

import urllib, json, subprocess

# It is assumed this is returning by last_updated
# We also filter out the test tag, as that's used for testing >.<
url = 'https://registry.hub.docker.com/v2/repositories/wellcome/wellcomecollection/tags/'
response = urllib.urlopen(url)
data = json.loads(response.read())
releases = [result for result in data.get('results') if result.get('name') != 'test']
latest_release = releases[0].get('name')

forward_march = raw_input('Deploy %s (y/N): ' % latest_release)

if forward_march.lower().strip() == 'y':
    print 'Off we go!'
    subprocess.check_call(['./apply_task_definition.sh', latest_release])
