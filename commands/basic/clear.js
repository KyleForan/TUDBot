const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('clears messages in chat!')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addIntegerOption(option => 
			option.setName('amount')
			.setDescription('Amount of messages to be cleared')
			.setRequired(true)
		)
		.addUserOption(option => 
			option.setName('target')
			.setDescription('Specific users messages to delete')
			.setRequired(false)
		),
	async execute(interaction) {

		const { channel, options, client } = interaction

		const target = options.getUser('target') 
		let amount = options.getInteger('amount')

		if (amount < 1) amount = 1
		if (amount > 98) amount = 99
		
		let messages = await channel.messages.fetch({ limit: amount })
		if (target) messages = await messages.filter(m => m.author.username == target.username)
		
		await channel.bulkDelete(messages)
		
		await interaction.reply({
			content: `Deleted ${messages.size} from ${target ? target : 'This channel'}!`,
		});

		setTimeout(async () => {
			try {
				const reply = await interaction.fetchReply()
				await reply.delete()
			} catch {
				console.log('Message was deleted')
			}
		}, 2000)
	},
};
