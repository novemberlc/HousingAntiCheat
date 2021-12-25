const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');
const config = require('../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('send_panel')
		.setDescription('Send an important panel')
		.addStringOption(option => option.setName('panel')
			.setDescription('Panel you want to send')
			.setRequired(true)
			.addChoice('Link Account', 'linkacc')
		),
	async execute(interaction) {
		if(interaction.options.getString('panel') === "linkacc") {
			if(config.linking.enable == "false") return interaction.reply({content: 'This feature is disabled. Enable it in your config.json to use it.', ephemeral: true});
			const embed = new discord.MessageEmbed()
			.setTitle('Link Your Minecraft Account')
			.setDescription('Click the green **Link Minecraft Account** button to link your Minecraft account to Discord.\n\nYou will be given a code which you need to DM our bot on Hypixel.\n\n*Please note that your code will expire in 5 minutes*')
			.setColor('GREEN')
			.setFooter("Only your Minecraft and Discord ID's and usernames will be stored.");
			const row = new discord.MessageActionRow()
			.addComponents(
				new discord.MessageButton()
					.setCustomId('linkaccount')
					.setLabel('Link Minecraft Account')
					.setStyle('SUCCESS')
					.setEmoji('🔗'),
			);
			await interaction.channel.send({ embeds: [ embed ] , components: [row]})
			await interaction.reply({ content: 'Panel Sent!', ephemeral: true })
		}
	},
};