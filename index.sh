#!/bin/bash

# DOWNLOAD
wget -O dict.txt 'https://docs.google.com/spreadsheets/d/1Han8vd6RHVaT0CV6svMh840AgeAiqi7ieY2kbuBbfEk/export?gid=0&format=tsv'

# 2. PREPROCESS
cd preprocess
node generateJSON.js