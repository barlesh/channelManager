#!/bin/bash

cd libs/agents-manager
npm test

cd ../../

cd libs/connections-manager
npm test

cd ../../

cd libs/resource-manager
npm test
