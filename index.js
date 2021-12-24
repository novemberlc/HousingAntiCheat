const fs = require('fs')
const discord = require('discord.js');
const axios = require('axios');
const config = require('./config.json')
const myIntents = new discord.Intents();
const mineflayer = require('mineflayer');
const mineflayerViewer = require('prismarine-viewer').mineflayer;
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
    if(config.housing.housingnumber == 1) return bot.clickWindow(12, 0, 0);
    if(config.housing.housingnumber == 2) return bot.clickWindow(13, 0, 0);
    if(config.housing.housingnumber == 3) return bot.clickWindow(14, 0, 0);
}

bot.once('spawn', () => {
    mineflayerViewer(bot, {port: 3007, firstPerson: true});
    bot.chat("/visit " + config.housing.owner)
    setTimeout(function(){ 
        joinHousing()
    }, 3000)
    if(config.housing.usespawncoordinates == "true") {
        setTimeout(function(){ 
            bot.chat("/tp " + config.housing.spawncoords)
        }, 5000)
    }
})
bot.addChatPattern("housing", /^(?:\[(?:[^V+]*)\] )?(?:\[.*\] )?(.*): (.*)$/, { parse: true, repeat: true })
bot.addChatPattern("chatMessage", /(.*)/)
bot.addChatPattern("privateMessage", /^From (?:\[.*\] )?(.*): (.*)$/)
bot.addChatPattern("parkour", /(.*) completed the parkour in (.*)!/, { parse: true, repeat: true })
bot.on('chat:chatMessage', (message) => {
    console.log(message[0])
})

client.commands = new discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

if(config.bridge.usebridge == "true"){
    client.on('messageCreate', (message) => {
        if(!message.author.bot && message.channel.id == config.bridge.bridgeid) {
        bot.chat("【 " + message.author.username + " 】 " + message.content.toString())
        }
    })
    bot.on("chat:housing", (matches) => {
        if(matches[0][0] === `Now playing`) return;
        if(matches[0][0] == bot.username) return;
        axios.post('https://discordapp.com/api/webhooks/923744706804985916/1helOMxhPNiF_Ft8vadXOSLKdyhjYkWSTps10CyiFPxhwGtT8n1nCFh1ZwpYwrNyV-Et', {
            username: matches[0][0],
            avatar_url: "https://mc-heads.net/avatar/" + matches[0][0] + ".png",
            content: matches[0][1],
        })
    });
    bot.on("chat:parkour", (matches) => {
        console.log('parkour time haha')
        const embed = new discord.MessageEmbed()
        .setColor('GOLD')
        .setTitle('Completed the parkour in `' + matches[0][1] + '`!')
        .setDescription('If this time is illegitimate, pin this message.');
        const finalEmbed = embed.toJSON
        axios.post('https://discordapp.com/api/webhooks/923744706804985916/1helOMxhPNiF_Ft8vadXOSLKdyhjYkWSTps10CyiFPxhwGtT8n1nCFh1ZwpYwrNyV-Et', {
            username: matches[0][0],
            avatar_url: "https://mc-heads.net/avatar/" + matches[0][0] + ".png",
            embeds: [ embed ],
        }).catch(e => {
            console.log(e)
        })
    })
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, bot);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(config.discord.token)