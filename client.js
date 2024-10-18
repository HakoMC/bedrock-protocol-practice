require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const bedrock = require("bedrock-protocol");
const client = bedrock.createClient({
  host: "localhost", // optional
  port: 19131, // optional, default 19132
  username: "Da1z981", // the username you want to join as, optional if online mode
  offline: true, // optional, default false. if true, do not login with Xbox Live. You will not be asked to sign-in if set to true.
});

client.on("add_player", (packet) => {
  client.queue("text", {
    type: "chat",
    needs_translation: false,
    source_name: client.username,
    xuid: "",
    platform_chat_id: "",
    filtered_message: "",
    message: `Hey, ${packet.username} just joined!`,
  });
});

discordClient.on("ready", () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on("messageCreate", (message) => {
  // 指定されたチャンネル以外からのメッセージは無視
  if (message.channelId !== process.env.DISCORD_CHANNEL_ID) return;

  // if (message.author.bot) return; // ボットのメッセージは無視

  console.log(
    `Discord message: ${message.author.username}: ${message.content}`,
  );

  let author = message.author.username;
  let content = message.content;

  if (client) {
    client.queue("text", {
      type: "announcement",
      needs_translation: false,
      // source_name: client.username,
      xuid: "",
      platform_chat_id: "",
      filtered_message: "",
      message: `[${author}] ${content}`,
    });
    console.log("Message sent to Minecraft");
  } else {
    console.log("Minecraft player not connected");
  }
});

discordClient.login(process.env.DISCORD_TOKEN);
