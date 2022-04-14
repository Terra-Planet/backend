#!/bin/bash
#
# Removes files that App Store doesn't like
#

for i in `find . -name "prebuilds”`; do rm -rf $i; done 
for i in `find . -name "Release`; do rm -rf $i; done 

