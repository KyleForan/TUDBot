const { SlashCommandBuilder } = require('discord.js');
const economy = require('../../economy')

module.exports = {
	data: {
		name: 'balance',
		description: 'Get current balance'
	},
	async execute(interaction) {
		
		await interaction.reply({
			 content: 'Getting Balance...', 
			 fetchReply: true, ephemeral: true
			});

        const data = await economy.getData(interaction.user)
        var { balance } = data

		// ! DEV REMOVE LATER
		// console.log(data)

        if (!balance) {
            console.error(`${interaction.user.username} balance undefined!`)
            balance = 0
        }
		
		interaction.editReply({
			content: `Current Bal: $${balance}`,
		});

	},
};
