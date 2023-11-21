const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getData, updateBal } = require('../../economy');
const calls = ['Heads', 'Tails']

module.exports = {
    data: new SlashCommandBuilder()
		.setName('flip')
		.setDescription('Bet on a coin flip. Max $75')
		// .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addStringOption(option => 
			option.setName('call')
			.setDescription('Heads or Tails')
			.setRequired(true)
            .setChoices(
                {name: 'Heads', value: 'Heads'},
                {name: 'Tails', value: 'Tails'},
            )
		)
        .addIntegerOption(option => 
			option.setName('bet')
			.setDescription('Bet money. Max $75')
			.setRequired(true)
            .setMaxValue(75)
            .setMinValue(0)
		),
	async execute(interaction) {
        
        const { options, user } = interaction

		const call = options.getString('call')
		const bet = options.getInteger('bet')

        var { balance } = await getData(user)
        balance = +balance

        if (balance < bet) return interaction.reply({
            content: `Your Balance is to low, Balance: ${balance}`,
			ephemeral: true
        })

        await updateBal(user, balance - bet)

        const land = calls[Math.floor(Math.random() * 2)]
        const win = (land == call)

        if (win) await updateBal(user, balance + bet)

        interaction.reply({
            content: `You ${win ? 'WIN!' : 'Lose.'} Current bal: ${balance + (win ? bet : -bet)}`,
			ephemeral: true
        })

	},
};
