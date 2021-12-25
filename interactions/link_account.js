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
        if(interaction.customId === "linkaccount") {
            var linked = false
            let sql = 
            `SELECT *
            FROM link
            WHERE discordid = '${interaction.user.id}'`;
            playerdb.get(sql, async (err, row) => {
                if (!row){
                    const linkcode = generateString(6)
                    const expiretime = new Date();
                    expiretime.setMinutes(expiretime.getMinutes() + parseInt(config.linking.expirytime))
                    let sql = `INSERT INTO link (discordname,discordid,linkcode,linkexpire)
                    VALUES('${interaction.user.tag}', '${interaction.user.id}', '${linkcode}', '${expiretime.getTime()}')`;
                    playerdb.run(sql, async function(err) {
                        if (err) {
                            return console.error(err.message)
                        }
                        const embed = new discord.MessageEmbed()
                            .setTitle('Linking Instructions')
                            .setDescription('Log on to `play.hypixel.net` and type `/msg ' + config.minecraft.username + " !link " + linkcode + '`')
                            .setColor('BLUE')
                            .setFooter("Only your Minecraft and Discord ID's and usernames will be stored.");
                            await interaction.reply({ embeds: [ embed ] , ephemeral: true })
                        })
                    return;
                }
                if(row.isLinked != 1) {
                    const linkcode = generateString(6)
                    const expiretime = new Date();
                    expiretime.setMinutes(expiretime.getMinutes() + parseInt(config.linking.expirytime))
                    let data = [linkcode, interaction.user.id];
                    let sql = `UPDATE link
                    SET linkcode = ?
                    WHERE discordid = ?`;
                    playerdb.run(sql, data, async function(err) {
                        if (err) {
                            return console.error(err.message)
                        }
                        let sql = `UPDATE link
                        SET linkexpire = '${expiretime.getTime()}'
                        WHERE discordid = '${interaction.user.id}'`;
                        playerdb.run(sql, async function(err) {
                            if (err) {
                                return console.error(err.message)
                            }
                            const embed = new discord.MessageEmbed()
                                .setTitle('Linking Instructions')
                                .setDescription('Log on to `play.hypixel.net` and type `/msg ' + config.minecraft.username + " !link " + linkcode + '`')
                                .setColor('BLUE')
                                .setFooter("Only your Minecraft and Discord ID's and usernames will be stored.");
                                await interaction.reply({ embeds: [ embed ] , ephemeral: true })
                        })
                    return;
                })}
                if(row.isLinked == 1) {
                    await interaction.reply({ content: "You've already linked your account!", ephemeral: true })
                    linked = true;
                    return;
                }
            })
        }
    }
}