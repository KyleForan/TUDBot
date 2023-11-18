const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: {
		name: 'ping',
		description: 'Pong!'
	},
	async execute(interaction) {
		
		const sent = await interaction.reply({
			 content: 'Pinging...', 
			 fetchReply: true 
			});
			
		interaction.editReply({
			content: `Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`
		});

	},
};
