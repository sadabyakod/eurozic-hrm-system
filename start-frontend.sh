#!/bin/bash
# Build and start frontend
cd "$(dirname "$0")/frontend"
npm install
npm run build
npm start
