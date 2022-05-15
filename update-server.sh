#!/bin/bash

clear;
rsync -a --exclude '/node_modules' . root@predictiveanswers.com:/home/server
