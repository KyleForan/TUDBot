import * as Discord from 'discord.js'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { clientId, guilds } from './config.json'

require('dotenv').config()

const commandspath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandspath).filter(file => file.endsWith('.js'))

let commands = []

for (file of commandFiles) {
    const filepath = path.join(commandspath, file)
    const command = require(filepath)

    const { data, execute } = command

    if ('data' in command && 'execute' in command) {
        commands.push(command.data)
    }
    else {
        console.warn(`${file} did not have both data and execute properties`)
    }
}

const rest = new Discord.REST().setToken(process.env.TOKEN);

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
})();
