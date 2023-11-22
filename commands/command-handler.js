const Discord = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')
const { clientId, guilds } = require('../config.json')

require('dotenv').config()

module.exports = (client) => {

    const dirPath = __dirname
    // const dirStats = fs.lstatSync(__dirname)
    const dirFolders = fs.readdirSync(dirPath).filter(folder => !folder.endsWith('.js'))

    for (folder of dirFolders) {

        if (folder == 'depreciated') continue
        
        const commandPath = path.join(dirPath, folder)
        const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'))

        for (file of commandFiles) {
                const filepath = path.join(commandPath, file)
                const command = require(filepath)
        
                const { data, execute } = command
        
                if (data && execute) {
                    client.commands.set(data.name, command)
                }
                else {
                    console.warn(`${file} did not have both data and execute properties`)
                }
            }
        
        }

        const rest = new Discord.REST().setToken(process.env.TOKEN);
        const commands = Array.from(client.commands.values()).map((el, _) => el.data);
    
        (async () => {
            try {
                console.log(`Started refreshing ${commands.length} application (/) commands.`);

                // The put method is used to fully refresh all commands in the guild with the current set
                const data = await rest.put(
                    Discord.Routes.applicationGuildCommands(clientId, guilds.test),
                    { body: commands },
                );

                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            } catch (error) {
                // And of course, make sure you catch and log any errors!
                console.error(error);
            }
        })()

    // Reads Files in command directory and subdirectory and loads them as commands
    client.on(Discord.Events.InteractionCreate, async interaction => {
        if (interaction.isChatInputCommand()) {
            
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
            
        } else if (interaction.isButton) {
            // skip
        }

    });
    

}
    