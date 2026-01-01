#!/usr/bin/env bash
# exit on error
set -o errexit


pip install -r requirements.txt


if [ ! -d "ffmpeg" ]; then
  mkdir -p ffmpeg
  cd ffmpeg
  curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz | tar xJ --strip-components=1
  cd ..
fi


export PATH=$PATH:$(pwd)/ffmpeg