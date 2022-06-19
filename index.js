const discord = require('discord.js');
const config = require('./config.json')
const myIntents = new discord.Intents();
const mineflayer = require('mineflayer');
myIntents.add(discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.GUILD_MEMBERS, discord.Intents.FLAGS.GUILD_PRESENCES, discord.Intents.FLAGS.GUILDS);

const client = new discord.Client({ intents: myIntents });

const bot = mineflayer.createBot({
    host: 'play.hypixel.net',
    username: config.minecraft.email,
    password: config.minecraft.pass,
    port: 25565,
    version: "1.17.1",
    auth: config.minecraft.auth
});

function joinHousing() {
    if(config.minecraft.housingnumber == 1) return bot.clickWindow(12, 0, 0);
    if(config.minecraft.housingnumber == 2) return bot.clickWindow(13, 0, 0);
    if(config.minecraft.housingnumber == 3) return bot.clickWindow(14, 0, 0);
}

bot.once('spawn', () => {
    bot.chat("/visit " + config.minecraft.ownername)
    setTimeout(function(){ 
        joinHousing()
    }, 1000)
})
bot.addChatPattern("parkour", /(.*) completed the parkour in ((.*):.*\..*)!/, { parse: true, repeat: true })

client.once('ready', () => {
	console.log('Discord Bot Ready!');
});

bot.on('chat:parkour', (matches) => {
    if(parseInt(matches[0][2]) < parseInt(config.anticheat.autobantime)) {
        bot.chat('/housing ban ' + matches[0][0])
        const embed = new discord.MessageEmbed()
        .setTitle('Parkour Ban (Automatic)')
        .setFooter("This ban was automatically executed by HousingAntiCheat")
        .setColor("RED")
        .setImage("https://mc-heads.net/avatar/" + matches[0][0] + ".png")
        .setDescription(matches[0][0] + " was banned for having an illegitimate time of `" + matches[0][1] + "`");
        client.channels.cache.get(config.discord.logchannelid).send({ embeds: [embed] })
        console.log(parseInt(matches[0][2]))
    }
})

if(config.discord.enable) {
    client.login(config.discord.token)
}