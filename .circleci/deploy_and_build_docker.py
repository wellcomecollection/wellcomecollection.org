import sys
from utils import build_and_push_docker

arg_dir = sys.argv[1]
arg_container = sys.argv[2]
arg_tag = sys.argv[3]


def main(dir, container, tag):
  return build_and_push_docker(dir, container, tag)


if __name__ == '__main__':
  sys.exit(main(arg_dir, arg_container, arg_tag))
