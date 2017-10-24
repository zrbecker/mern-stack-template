#!/usr/bin/env bash

#
# Should be run from root package.json
#

(cd ./packages/client && npm install) & \
(cd ./packages/server && npm install)
