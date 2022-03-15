# Early Development Warning:
Housecord is a Discord bot and Minecraft bot that work together to improve the Hypixel Housing experience. This is in very early development, and I would not recommend trying to use it for your Housing yet, as it is likely to break. Currently it has the capability to log into a Minecraft account, join a housing, and create a bridge between Hypixel housing and a Discord channel using Webhooks to allow users to communicate between a Housing world and Discord.

# Installation
## Requirements

 - Node.js v16.6.0 or higher
 - Git (if using Linux)
 - A little bit of brain power

## Windows
1. Install Node.js https://nodejs.org/en/
2. Download the .zip file containing the source code using the green "Code" dropdown and extract its contents.
![image](https://cdn.novlc.io/images/png/Pe2ND.png)
3. Open the folder
4. Hold shift and right click in any blank space in the folder
5. Click "Open PowerShell window here"
6. Run `npm install` to install the required dependencies
7. Make a copy of "config-template.json" and name it "config.json"
8. Edit the config with your own information. A detailed description of the config can be found [here](ADD URL)
9. Run `node index.js` to start the Discord and Minecraft bots!

## Linux
If you're using Linux, you probably know what you're doing, but if you don't, here are the instructions. This segment will assume you're using a command line. You probably need sudo access.
 1. Install Node.js, if not already installed. https://nodejs.org/en/download/package-manager/
 2. Install git, if not already installed. `sudo apt install git-all` for Debian based distros.
 3. Clone the repo. Make sure you're in a directory you want it to be in, then: `git clone https://github.com/unchilled/Housecord.git`
 4. `cd Housecord`
 5. Install the dependencies: `npm install`
 6. Copy the sample config to an actual one: `cp config-template.json config.json`
 7. Edit the config using your information. `nano config.json`
 8. Run the bots! `node index.js`

## Configuration
Coming soon in the wiki

## Usage
Coming soon in the wiki
