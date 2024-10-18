require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { Relay } = require("bedrock-protocol");

const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const relay = new Relay({
  version: "1.21.30",
  host: "100.89.61.11",
  port: 19132,
  destination: {
    host: "127.0.0.1",
    port: 19131,
  },
});

relay.conLog = console.debug;
relay.listen();

let minecraftPlayer = null;

relay.on("connect", (player) => {
  console.log("Minecraft接続確立:", player.connection.address);
  minecraftPlayer = player;
});

discordClient.on("ready", () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on("messageCreate", (message) => {
  if (message.author.bot) return; // ボットのメッセージは無視

  console.log(
    `Discord message: ${message.author.username}: ${message.content}`,
  );

  if (minecraftPlayer) {
    minecraftPlayer.queue("text", {
      type: "chat",
      needs_translation: false,
      source_name: message.author.username,
      xuid: "",
      platform_chat_id: "",
      filtered_message: "",
      message: message.content,
    });
    console.log("Message sent to Minecraft");
  } else {
    console.log("Minecraft player not connected");
  }
});

discordClient.login(process.env.DISCORD_TOKEN);
