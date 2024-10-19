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

// relay.conLog = console.debug;
relay.listen();

let minecraftPlayer = null;

relay.on("connect", (player) => {
  console.log("Minecraft接続確立:", player.connection.address);
  minecraftPlayer = player;

  player.on("serverbound", ({ name, params }, des) => {
    if (name === "command_request") {
      if (params.command == "/test") {
        openCustomChest(player);
        des.canceled = true;
      }
    }
  });
});

function openCustomChest(player) {
  player.queue("container_open", {
    window_id: 1,
    window_type: "container",
    coordinates: { x: 0, y: 0, z: 0 },
    runtime_entity_id: -1n,
  });

  const emptyInventory = createEmptyInventory(27);
  player.queue("inventory_content", {
    window_id: 1,
    input: emptyInventory,
    container: { container_id: 7 },
    dynamic_container_size: 27,
  });
}

function createEmptyInventory(size) {
  const inventory = [];
  for (let i = 0; i < size; i++) {
    inventory.push({
      network_id: 0,
      count: 0,
      metadata: 0,
      has_stack_id: 0,
      stack_id: 0,
      block_runtime_id: 0,
      extra: {
        has_nbt: 0,
        can_place_on: [],
        can_destroy: [],
      },
    });
  }
  return inventory;
}

discordClient.on("ready", () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on("messageCreate", (message) => {
  // 指定されたチャンネル以外からのメッセージは無視
  if (message.channelId !== process.env.DISCORD_CHANNEL_ID) return;

  if (message.author.bot) return; // ボットのメッセージは無視

  console.log(
    `Discord message: ${message.author.username}: ${message.content}`,
  );

  let author = message.author.username;
  let content = message.content;

  if (minecraftPlayer) {
    minecraftPlayer.queue("text", {
      type: "system",
      needs_translation: false,
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
