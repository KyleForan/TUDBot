const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: {
		name: 'user',
		description: 'Gives information about the information'	
	},
	async execute(interaction) {

		const date = interaction.user.createdAt.toLocaleDateString('en-IE', {
			month: 'long', year: 'numeric'
		})
		const name = interaction.user.username

		await interaction.reply({
			content: `This command was run by ${name}.\nMember since ${date}`,
			ephemeral: true
		});
	},
};
