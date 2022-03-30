#!/bin/bash
#
# Removes files that App Store doesn't like
#

find . -name "prebuilds" -delete
find . -name "Release" -delete

