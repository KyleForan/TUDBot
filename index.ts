const Discord = require('discord.js')
const handler = require('./command-handler')

// Create bot instance
const bot = new Discord.Client({
     intents: [Discord.GatewayIntentBits.Guilds] 
    })

bot.commands = new Discord.Collection();
handler(bot)

// Logs Bot online
bot.once('ready', () => {
    console.log(`Logged in as ${bot.user.username}`)
})


require('dotenv').config()
bot.login(process.env.TOKEN)