#!/usr/bin/env bash

(cd ./packages/client && npm start) &
(cd ./packages/server && npm start)
