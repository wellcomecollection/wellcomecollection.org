import urllib, json, sys, subprocess

def get_commit_message(commit_hash):
  url = 'https://api.github.com/repos/wellcometrust/wellcomecollection.org/git/commits/%s' % commit_hash
  response = urllib.urlopen(url)
  data = json.loads(response.read())

  return data.get('message')

def build_and_push_docker(dir, container, tag):
  build_command = ['docker', 'build', '-t', '%s:%s' % (container, tag), dir]
  push_command = ['docker', 'push', '%s:%s' % (container, tag)]
  build_code = subprocess.call(build_command)
  push_code = subprocess.call(push_command)
  return build_code is 0 and push_code is 0
