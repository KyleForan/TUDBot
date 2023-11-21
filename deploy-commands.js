const Discord = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')
const { clientId, guilds } = require('./config.json')

require('dotenv').config()

const commandspath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandspath).filter(file => file.endsWith('.js'))

let commands = []

const dirPath = path.join(__dirname, 'commands')
// const dirStats = fs.lstatSync(__dirname)
const dirFolders = fs.readdirSync(dirPath).filter(folder => !folder.endsWith('.js'))

for (folder of dirFolders) {

	const commandPath = path.join(dirPath, folder)
	const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'))

	for (file of commandFiles) {
			const filepath = path.join(commandPath, file)
			const command = require(filepath)
	
			const { data, execute } = command
	
			if (data && execute) {
				commands.push(data)
			}
			else {
				console.warn(`${file} did not have both data and execute properties`)
			}
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
