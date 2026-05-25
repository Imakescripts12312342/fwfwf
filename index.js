require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

console.log("START");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const rules = [
    { word: "nga", action: "warn" },
    { word: "bitch", action: "timeout" },
    { word: "b*tch", action: "timeout" },
    { word: "nigger", action: "ban" },
    { word: "nigga", action: "ban" }
];

client.once("ready", () => {
    console.log("ONLINE:", client.user.tag);
});

client.on("messageCreate", async (message) => {
    try {
        if (message.author.bot) return;
        if (!message.guild) return;

        const raw = message.content.toLowerCase();

        // normalize message to catch bypass attempts
        const normalized = raw
            .replace(/[\W_]/g, "") // removes symbols/spaces
            .replace(/0/g, "o")
            .replace(/1/g, "i")
            .replace(/3/g, "e")
            .replace(/4/g, "a")
            .replace(/5/g, "s")
            .replace(/7/g, "t");

        for (const rule of rules) {
            const word = rule.word.toLowerCase();

            if (
                raw.includes(word) ||          // normal match
                normalized.includes(word)      // bypass match
            ) {
                console.log("MATCH:", rule.word);

                const member = await message.guild.members.fetch(message.author.id);

                await message.channel.send(
                    `${message.author} your message was removed for violating rules.`
                );

                await message.delete();

                if (rule.action === "warn") {
                    await message.channel.send(`${message.author} warning issued.`);
                }

                if (rule.action === "timeout") {
                    await member.timeout(5 * 60 * 1000, "Auto moderation");
                }

                if (rule.action === "ban") {
                    await member.ban({ reason: "Auto moderation violation" });
                }

                break;
            }
        }
    } catch (err) {
        console.log("ERROR:", err);
    }
});

client.login(process.env.TOKEN);