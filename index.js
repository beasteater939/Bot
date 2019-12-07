const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const colours = require("./colours.json");

require('http').createServer().listen(3000)

const bot = new Discord.Client({disabledEveryone: true});

const activities_list = [
    "#Bean's!",
    "#18 Days!",
    "#Winter!"

    ];

bot.on("ready", async () => {
    console.log("Bean's Manager Loaded!")
    bot.user.setStatus("idle")

  setInterval(() => {
      const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); 
      bot.user.setActivity(activities_list[index], {type : "WATCHING"}); 
   }, 5000); 
});

const token = "NjE1NzIzNTA0Nzc5Nzg4MzA3.XevdBA.SZIvm4K0p-X7YjNtR-Ed1NxgZqk"

const fs = require("fs");

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0) {
        console.log("[Logs] I couldn't find Commands!")
    }

    jsfile.forEach((f, _i) => {
        let pull = require(`./commands/${f}`);
        bot.commands.set(pull.config.name, pull);
        pull.config.aliases.forEach(alias => {
            bot.aliases.set(alias, pull.config.name)
        });
    }); 
});

//console chatter
let y = process.openStdin()
y.addListener("data", res => {
    let x = res.toString().trim().split(/ +/g)
    bot.channels.get("648945976223989771").send(x.join(" "));
})

bot.on("message", async message => {
    if(message.author.bot || message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ")
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let E1mbed = new Discord.RichEmbed()
    .setColor(colours.lightblue) 
    .setTitle(`:exclamation:Please, Tell Me A Member Name!`)
    .setFooter("Bean's Assistant Prompt Mistake")
    
    if(!message.content.startsWith(prefix)) return;
    let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)))
    if(commandfile) commandfile.run(bot,message,args)

})

bot.login(process.env.token);
