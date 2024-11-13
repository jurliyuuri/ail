#!/bin/bash

# 1. CHECK LOGICS
pnpm vitest run

# 2. DOWNLOAD
wget -O dict.txt 'https://docs.google.com/spreadsheets/d/1Han8vd6RHVaT0CV6svMh840AgeAiqi7ieY2kbuBbfEk/export?gid=0&format=tsv'

# 3. GENERATE JSON
cd preprocess
deno run --allow-all generateJSON.ts