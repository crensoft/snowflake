#!/usr/bin/env bash

test -d .git/hooks || mkdir .git/hooks
cp -f .git-hooks/* .git/hooks
chmod a+x .git/hooks/*