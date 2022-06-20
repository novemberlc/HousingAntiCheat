const discord = require('discord.js');
const config = require('./config.json')
const myIntents = new discord.Intents();
const mineflayer = require('mineflayer');
const color = require('chalk')
const fs = require('fs')
const logger = fs.createWriteStream('log.txt', {
    flags: 'a'
})
myIntents.add(discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.GUILD_MEMBERS, discord.Intents.FLAGS.GUILD_PRESENCES, discord.Intents.FLAGS.GUILDS);

function getLogTime() {
    logTime = new Date()
    return `${logTime.getFullYear()}-${logTime.getMonth()}-${logTime.getDate()} ${logTime.getHours()}:${logTime.getMinutes()}:${logTime.getSeconds()}`
}

var configPasses = false;

if(config.minecraft.email !== "" && config.minecraft.ownername !== "" && config.minecraft.housingname !== "" && config.minecraft.auth !== "") configPasses = true;

if (configPasses) {
    const client = new discord.Client({ intents: myIntents });

    const bot = mineflayer.createBot({
        host: 'play.hypixel.net',
        username: config.minecraft.email,
        password: config.minecraft.pass,
        port: 25565,
        version: "1.17.1",
        auth: config.minecraft.auth
    });

    console.log(color.green(`[${getLogTime()}] Starting bots...`))

    bot.once('spawn', () => {
        bot.chat("/visit " + config.minecraft.ownername + " " + config.minecraft.housingname)
        console.log(color.green(`[${getLogTime()}] Minecraft bot is online`))
        logger.write(`[${getLogTime()}] Minecraft bot is online\n`)
    })
    bot.addChatPattern("parkour", /(.*) completed the parkour in ((.*):.*\..*)!/, { parse: true, repeat: true })

    client.once('ready', () => {
        console.log(color.green(`[${getLogTime()}] Discord bot is online`))
        logger.write(`[${getLogTime()}] Discord bot is online\n`)
    });

    bot.on('chat:parkour', (matches) => {
        if(parseInt(matches[0][2]) < parseInt(config.anticheat.autobantime)) {
            bot.chat('/housing ban ' + matches[0][0])
            const embed = new discord.MessageEmbed()
            .setTitle('Parkour Ban (Automatic)')
            .setFooter({text: 'This ban was automatically executed by HousingAntiCheat'})
            .setColor("RED")
            .setImage("https://mc-heads.net/avatar/" + matches[0][0] + ".png")
            .setDescription(matches[0][0] + " was banned for having an illegitimate time of `" + matches[0][1] + "`");
            client.channels.cache.get(config.discord.logchannelid).send({ embeds: [embed] })
            console.log(color.blue(`[${getLogTime()}] ${matches[0][0]} was automatically banned for an illegitimate parkour time of ${matches[0][1]}`))
            logger.write(`[${getLogTime()}] ${matches[0][0]} was automatically banned for an illegitimate parkour time of ${matches[0][1]}\n`)
        }
    })

    if(config.discord.enable) {
        client.login(config.discord.token).catch((err) => { console.log(red(`[${getLogTime()}] Error Found: `  + err)) })
    }
} else {
    console.log(color.red(`[${getLogTime()}] Configuration was not set up correctly. Make sure to input all the required settings in config.json`))
}