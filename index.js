const Discord = require('discord.js')
const handler = require('./commands/command-handler')

const bot = new Discord.Client({
     intents: [Discord.GatewayIntentBits.Guilds] 
    })

bot.commands = new Discord.Collection();
handler(bot)

bot.once('ready', () => {
    console.log(`Logged in as ${bot.user.username}`)
})


require('dotenv').config()
bot.login(process.env.TOKEN)