const fs = require('fs')
const discord = require('discord.js');
const axios = require('axios');

const sqlite = require('sqlite3')
const playerdb = new sqlite.Database('./db/players.db')

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
    }, 1000)
    if(config.housing.usespawncoordinates == "true") {
        setTimeout(function(){ 
            bot.chat("/tp " + config.housing.spawncoords)
        }, 2000)
    }
})
bot.addChatPattern("housing", /^(?:\[(?:[^V+]*)\] )?(?:\[.*\] )?(.*): (.*)$/, { parse: true, repeat: true })
bot.addChatPattern("chatMessage", /(.*)/)
bot.addChatPattern("privateMessage", /^From (?:\[.*\] )?(.*): (.*)$/, { parse: true, repeat: true })
bot.addChatPattern("parkour", /(.*) completed the parkour in ((.*):.*\..*)!/, { parse: true, repeat: true })
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
    });
    bot.on("chat:housing", (matches) => {
        if(matches[0][0] === `Now playing`) return;
        if(matches[0][0] == bot.username) return;
        axios.post(config.bridge.webhookurl, {
            username: matches[0][0],
            avatar_url: "https://mc-heads.net/avatar/" + matches[0][0] + ".png",
            content: matches[0][1],
        }).catch(e => {})
    });
    bot.on("chat:parkour", (matches) => {
        if(parseInt(matches[0][2]) < parseInt(config.parkour.autoban.cheatingtime) && config.parkour.autoban.enable == "true") return;
        const embed = new discord.MessageEmbed()
        .setColor('GOLD')
        .setTitle('Completed the parkour in `' + matches[0][1] + '`!')
        .setDescription('If this time is illegitimate, pin this message.');
        axios.post(config.bridge.webhookurl, {
            username: matches[0][0],
            avatar_url: "https://mc-heads.net/avatar/" + matches[0][0] + ".png",
            embeds: [ embed ],
        }).catch(e => {
            console.log(e)
        })
    })
}

if(config.linking.enable == "true") {
    bot.on('chat:privateMessage', (matches) => {
        message = matches[0][1];
        if(!message.toString().startsWith('!link')) return;
        const args = matches[0][1].split(' ')
        uuid = ''
        axios.get('https://api.mojang.com/users/profiles/minecraft/' + matches[0][0]).then(res => {
            uuid = res.data.id
            let uuidsql = 
            `SELECT *
            FROM link
            WHERE uuid = '${uuid}'`;
            console.log(uuid)
            playerdb.get(uuidsql, (err, row) => {
                if(!row) return;
                if(row.isLinked == 1) {
                    bot.chat('/r ' + matches[0][0] + ", you've already linked your account!.")
                    return;
                }
            })
        }).catch(e => {
            console.log(e)
        })
        let codesql = 
        `SELECT *
        FROM link
        WHERE linkcode = '${args[1]}'`
        playerdb.get(codesql, (err, row) => {
            if (!row){
                bot.chat('/r ' + matches[0][0] + ", you need to start the linking process in the Discord server.")
                return;
            }
            if(row.isLinked != 1) {
                axios.get('https://api.mojang.com/users/profiles/minecraft/' + matches[0][0]).then(res => {
                    if(row.linkexpire <= new Date()) return bot.chat('/r ' + matches[0][0] + ', your link code has expired. Please generate another code.')
                    uuid = res.data.id
                    let updateuuidsql = `UPDATE link
                    SET uuid = '${uuid}'
                    WHERE linkcode = '${args[1]}'`;
                    playerdb.run(updateuuidsql, (err) => {
                        if (err) {
                            return console.error(err.message)
                        }
                        let updatenamesql = `UPDATE link
                        SET mcname = '${matches[0][0]}'
                        WHERE linkcode = '${args[1]}'`;
                        playerdb.run(updatenamesql, (err) => {
                            if (err) {
                                return console.error(err.message)
                            }
                            let updatelinkedsql = `UPDATE link
                            SET isLinked = 1
                            WHERE linkcode = '${args[1]}'`;
                            playerdb.run(updatelinkedsql, (err) => {
                                if (err) {
                                    return console.error(err.message)
                                }
                                let updatelinksql = `UPDATE link
                                SET linkexpire = NULL
                                WHERE linkcode = '${args[1]}'`;
                                playerdb.run(updatelinksql, (err) => {
                                    if (err) {
                                        return console.error(err.message)
                                    }
                                    let updatelinksql = `UPDATE link
                                    SET linkcode = NULL
                                    WHERE linkcode = '${args[1]}'`;
                                    playerdb.run(updatelinksql, (err) => {
                                        if (err) {
                                            return console.error(err.message)
                                        }
                                        bot.chat("/r You have successfully linked with the Discord account " + row.discordname)
                                    })
                                })
                            })
                        })
                    })
                }).catch(e => {
                    console.log(e)
                })
                return;
            }
            if(row.isLinked == 1) {
                interaction.reply({ content: "You've already linked your account!", ephemeral: true })
                linked = true;
                return;
            }
        })
    })
}

if(config.parkour.useparkour == "true") {
    if(config.parkour.autoban.enable == "true") {
        bot.on('chat:parkour', (matches) => {
            if(parseInt(matches[0][2]) < parseInt(config.parkour.autoban.cheatingtime)) {
                bot.chat('/housing ban ' + matches[0][0])
                const embed = new discord.MessageEmbed()
                .setTitle('Parkour Ban (Automatic)')
                .setFooter('This ban was automatically executed by ' + client.user.username + "'s anticheat")
                .setColor("RED")
                .setImage("https://mc-heads.net/avatar/" + matches[0][0] + ".png")
                .setDescription(matches[0][0] + " was banned for having an illegitimate time of `" + matches[0][1] + "`");
                client.channels.cache.get(config.bridge.bridgeid).send({ embeds: [embed] })
                console.log(parseInt(matches[0][2]))
            }
        })
    }
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

const eventFiles = fs.readdirSync('./interactions').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./interactions/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(config.discord.token)