const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const timeOut = 1000 * 5

// TODO: EVERYTHING

const buttons = {
    hitButton: { 
        id: 'hit', label: 'Hit',
        style: ButtonStyle.Success 
    },
    foldButton: { 
        id: 'fold', label: 'Fold',
        style: ButtonStyle.Danger 
    }
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('blackjack')
    .setDescription('Play a game of Blackjack!'),
	async execute(interaction) {
        
        
        const row = new ActionRowBuilder()
        
        Object.values(buttons).forEach(element => {   
            row.addComponents(
                new ButtonBuilder()
                .setCustomId(element.id)
                .setLabel(element.label)
                .setStyle(element.style)
                )
            });
			
            const calls = { hit, fold }
            const msg = await interaction.reply({
                ephemeral: true, fetchReply: true,
                content: "This is a  Button Test!",
                components: [row],
            });
            
            try {

                const buttonResponse = await msg.awaitMessageComponent({ 
                    filter: (i => i.user.id === interaction.user.id), time: timeOut
                })
                
                await interaction.editReply({
                    content: 'Loading...',
                    components: []
                })
                
                calls[buttonResponse.customId]()
                
            } catch (e) {
                
                if (e.message == 'Collector received no interactions before ending with reason: time') { 
                    
                    await interaction.editReply({
                        content: `No input Recieved within ${timeOut/1000} seconds`,
                        components: []
                    })
                    
                } else {
                    console.error(e.message)
                }
                
            }
            
        },
    };
            

const hit = () => {
    console.log('hit')
}

const fold = () => {
    console.log('fold')
}