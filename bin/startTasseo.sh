#!/bin/bash

exec 2>&1

source /opt/tasseo/bin/.awssetting

cd /opt/tasseo
nohup foreman start >/opt/tasseo/tasseo.log &

