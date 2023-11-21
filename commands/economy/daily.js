const { SlashCommandBuilder } = require('discord.js');
const { getData, updateBal, updateDaily } = require('../../economy');

const day = 1000 * 60 * 60 * 24

module.exports = {
	data: {
		name: 'daily',
		description: 'Gives $20 once a day!'
	},
	async execute(interaction) {
		
		const sent = await interaction.reply({
            content: 'Checking Time...', 
            fetchReply: true ,
			ephemeral: true
        });

        const { balance, daily } = await getData(interaction.user)
        const updatedBal = +balance + 20 

        if (sent.createdTimestamp >= (daily + day)) {
            
            await updateBal(interaction.user, updatedBal),
            await updateDaily(interaction.user)

            interaction.editReply({
                content: `Current Bal: $${updatedBal}`
            });
            
        }
        else {

            const rawDifference = daily + day - interaction.createdTimestamp
            const difference = new Date(rawDifference).toISOString().slice(11,19).split(':')   // HH:MM:SS

            interaction.editReply({
                content: `${difference[0]}hrs ${difference[0]}mins and ${difference[0]}secs left until next payout`
            })
        }
            
	},
};
