const Discord = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')

module.exports = (client) => {

    // Load commands from files in command folder
    // TODO: Search subdirectories
    const commandspath = path.join(__dirname, 'commands')
    const commandFiles = fs.readdirSync(commandspath).filter(file => file.endsWith('.js'))

    for (file of commandFiles) {
        const filepath = path.join(commandspath, file)
        const command = require(filepath)

        const { data, execute } = command

        if (data && execute) {
            client.commands.set(data.name, command)
        }
        else {
            console.warn(`${file} did not have both data and execute properties`)
        }
    }

    // Reads Files in command directory and subdirectory and loads them as commands
    client.on(Discord.Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return

        const command = interaction.client.commands.get(interaction.commandName)

        if (!command) return console.error(`No command matching ${interaction.commandName} was found`)
        console.log(interaction.user.username, interaction.commandName)

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }

        
    });

}
