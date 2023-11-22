const { SlashCommandBuilder, PermissionFlagsBits, Webhook } = require('discord.js');
const lists = require('../../lists.json').embarrassingThings

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embarrass')
		.setDescription('Embarrass someone!')
		.addUserOption(option => 
			option.setName('target')
			.setDescription('Specific users messages to delete')
			.setRequired(true)
		),
	async execute(interaction) {

		const { channel, options, client, user } = interaction

        const random = Math.floor(Math.random() * lists.length)
    	const target = options.getUser('target') 
        
        channel.createWebhook({
            name: target.username,
			avatar: target.avatarURL(),
		})
			.then(async webhook => {
				await webhook.send(lists[random])
				await webhook.delete()
			})
			.catch(console.error);

        await interaction.deferReply()
        await interaction.deleteReply()
	},
};
