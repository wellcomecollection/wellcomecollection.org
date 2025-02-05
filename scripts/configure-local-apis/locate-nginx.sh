#!/usr/bin/env bash

set -e

nginx -V 2>&1 | grep "configure arguments:" | sed 's/[^*]*conf-path=\([^ ]*\)\/nginx\.conf.*/\1/g'