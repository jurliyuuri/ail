#!/bin/bash

# 1. DOWNLOAD
wget -O dict.txt 'https://docs.google.com/spreadsheets/d/1Han8vd6RHVaT0CV6svMh840AgeAiqi7ieY2kbuBbfEk/export?gid=0&format=tsv'

# 2. VALIDATE ID UNIQUENESS
cd preprocess
sh validateID.sh
result=$?

if [ $result -eq 1 ]; then
  echo "Duplicated ID is found."
  exit 1
else
  echo "| INFO: No duplicated IDs!\n"
fi

# 3. PREPROCESS
deno generateJSON.ts