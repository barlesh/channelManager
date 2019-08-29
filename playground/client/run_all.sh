#!/bin/bash

npm run build 
echo "running client1"
node dist/playground/client/src/client.js &
sleep 10
echo "running client2"
node dist/playground/client/src/client2.js &
