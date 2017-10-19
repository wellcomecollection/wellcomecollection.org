#!/usr/bin/env bash

./node_modules/.bin/stylelint ../client/scss/**/*.scss --fix
./node_modules/.bin/eslint ../server ../client --fix
