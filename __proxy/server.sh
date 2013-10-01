#!/usr/bin/env bash
cd `dirname "$0"`

cd ..
startdir=`pwd`

cd _site
$startdir/__proxy/server.py
