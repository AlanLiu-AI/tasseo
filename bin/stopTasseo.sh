#!/bin/bash

ps aux | grep -E 'ruby' | grep -E 'rackup' | grep -v grep | awk '{print $2}' | xargs sudo kill -9

