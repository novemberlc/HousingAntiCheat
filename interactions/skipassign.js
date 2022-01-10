const sqlite = require('sqlite3')
const playerdb = new sqlite.Database('./db/players.db')
const discord = require('discord.js')
const config = require('../config.json')

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

module.exports = {
    name: 'interactionCreate',
    execute(interaction) {
        if(interaction.channel.id != config.linking.linkaccountchannel) return;
        if(!interaction.isButton) return;
        if(interaction.customId === "skipassign") {
            let sql1 = 
            `SELECT *
            FROM skiprequests
            WHERE messageid = '${interaction.id}'`;
            playerdb.get(sql2, async (err, row) => {
                if(!row) {
                    await interaction.reply({content: 'Invalid skip request', ephemeral: true})
                    return;
                }
                if(row.assignedTo != "") {
                    await interaction.reply({content: 'This skip request has already been assigned', ephemeral: true})
                    return;
                }
                let sql2 = `UPDATE skiprequests
                SET assignedTo = '${interaction.user.id}'
                WHERE messageId = '${interaction.id}'`;
                playerdb.run(sql2, async function(err) {
                    if (err) {
                        return console.error(err.message)
                    }
                    const embed = new discord.MessageEmbed()
                        .setTitle(row.username)
                        .setDescription('Log on to `play.hypixel.net` and type `/msg ' + config.minecraft.username + " !link " + linkcode + '`')
                        .setColor('BLUE')
                        .setFooter("Only your Minecraft and Discord ID's and usernames will be stored.");
                    await interaction.reply({ embeds: [ embed ] , ephemeral: true })
                })
            })
        }
    }
}