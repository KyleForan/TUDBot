const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const dictToButton = (Arr) => {
    return new ButtonBuilder()
        .setCustomId(Arr.id)
        .setLabel(Arr.label)
        .setStyle(Arr.style)
}

const buttonResponseCheck = async (interaction, name, buttons) => {
    if (!buttons.includes(name)) return

    await interaction.editReply({
        content: name,
        components: []
    })

} 

module.exports = {
	data: new SlashCommandBuilder()
        .setName('button')
        .setDescription('Test for buttons and action rows'),
	async execute(interaction) {

        const buttons = {
            yesButton: {
                id: 'confirm',
                label: 'Confirm Ban',
                style: ButtonStyle.Success
            },
            noButton: {
                id: 'deny',
                label: 'Deny Ban',
                style: ButtonStyle.Danger
            }
        }

        const row = new ActionRowBuilder()

        Object.values(buttons).forEach(element => {
            var button = dictToButton(element)
            row.addComponents(button)
        });
			
		const msg = await interaction.reply({
			content: "This is a  Button Test!",
            components: [row],
            fetchReply: true
		});

        try {

            const buttonResponse = await msg.awaitMessageComponent({ 
                filter: (i => i.user.id === interaction.user.id ),
                time: 20000
            })

            await buttonResponseCheck(interaction, buttonResponse.customId, ['confirm', 'deny'])

        } catch (e) {

            if (e.message == 'Collector received no interactions before ending with reason: time') { 

                await interaction.editReply({
                    content: 'No input Recieved within 20 seconds',
                    components: []
                })
                
            } else {
                console.error(e.message)
            }


        }

	},
};
