@echo off
title Setup HousingAntiCheat

if exist node_modules\ (
  echo HousingAntiCheat has already been set up.
  echo Edit your configuration in 'config.json' and start the bot with 'start.bat'
  pause
  exit
) else (
  echo Installing Packages...
  call npm i >> NUL
  echo Done! You can close this window or press any button to close it.
  pause >nul
  exit
)