#!/bin/bash

duplicate_line=$(awk '{print $1}' ../dict.txt | uniq --all-repeated)

if [ -n "$duplicate_line" ]; then
  echo "| ERROR: There is some duplicated ID"
  echo $duplicate_line | sed "s/ /\n/g" | xargs -I@ echo "| @"
  echo
  exit 1
else
  exit 0
fi