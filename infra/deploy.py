#!/usr/bin/env python

import urllib, json, subprocess

url = 'https://registry.hub.docker.com/v2/repositories/wellcome/wellcomecollection/tags/'
response = urllib.urlopen(url)
data = json.loads(response.read())
releases = [result for result in data.get('results') if result.get('name') != 'test']
lateset_release = releases[0].get('name')

forward_march = raw_input('Deploy %s (y/N): ' % lateset_release)

if forward_march.lower() == 'y':
    print 'Off we go!'
    subprocess.check_call(['./apply_task_definition.sh', lateset_release])
