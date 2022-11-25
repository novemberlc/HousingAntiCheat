# HousingAntiCheat
HousingAntiCheat is a Minecraft bot created to monitor parkour times and automatically ban players with a time shorter than specified.

## Early Development Warning
This project is in early development. The current version may be working, but is not recommended for use in production due to the unstable nature of early development projects.

# Installation
## Requirements

 - Node.js v16.6.0 or higher
 - Git (if using Linux)
 - A little bit of brain power

## Windows EXE (recommended)
**Warning: It's not a good idea to run random EXEs. You have no idea what could be on them. This one only contains what's on this repository, but please exercise extreme caution when running random EXEs on the internet.**
1. Download the latest exe from [releases](https://github.com/novemberlc/HousingAntiCheat/releases).
2. Put the exe in a folder on its own
3. Double click the exe to run it. If you get a "Windows protected your PC" popup, click "More info", then "Run anyway". A config will be created for you.
4. Edit the config as described [here](https://github.com/novemberlc/HousingAntiCheat/wiki/Configuration)
5. Double click the exe to run your bot!

## Windows (non-exe / no CLI)
1. Install Node.js https://nodejs.org/en/
2. Download the .zip file containing the source code using the green "Code" dropdown and extract its contents.
   <img src="https://cdn.unchld.me/img/12xne.png" alt="zip donwnload" width="400"/>
3. Open the folder
4. Double-click `setup.bat` and let it run. This installs the dependencies. If you get a "Windows protected your PC" popup, click "More info", then "Run anyway".
7. Make a copy of "config-template.json" and name it "config.json"
8. Edit the config with your own information. A detailed description of the config can be found [here](https://github.com/novemberlc/HousingAntiCheat/wiki/Configuration)
9. Run `start.bat` to start the Discord and Minecraft bots!
10. Log into Hypixel, and make sure you give your bot permission to ban players on your Housing.

## Linux
If you're using Linux, you probably know what you're doing, but if you don't, here are the instructions. This segment will assume you're using a command line. You probably need sudo access.
 1. Install Node.js, if not already installed. https://nodejs.org/en/download/package-manager/
 2. Install git, if not already installed. `sudo apt install git-all` for Debian based distros.
 3. Clone the repo. Make sure you're in a directory you want it to be in, then: `git clone https://github.com/novemberlc/HousingAntiCheat.git`
 4. `cd HousingAntiCheat`
 5. Install the dependencies: `npm ci`
 6. Copy the sample config to an actual one: `cp config-template.json config.json`
 7. Edit the config using your information. `nano config.json` (or any text editor of your choice)
 8. Run the bots! `node .`
 9. Log into Hypixel and make sure you give your bot permission to ban players on your Housing.

## Configuration
See a detailed walkthrough of the configuration [here](https://github.com/novemberlc/HousingAntiCheat/wiki/Configuration).
