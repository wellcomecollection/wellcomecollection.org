import subprocess


def build_and_push_docker(dir, container, tag):
    build_command = ['docker', 'build', '-t', '%s:%s' % (container, tag), dir]
    push_command = ['docker', 'push', '%s:%s' % (container, tag)]
    subprocess.check_call(build_command)
    subprocess.check_call(push_command)
