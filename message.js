const { Relay } = require("bedrock-protocol");

const relay = new Relay({
  version: "1.21.30",
  host: "100.89.61.11",
  port: 19132,
  destination: {
    host: "127.0.0.1",
    port: 19131,
  },
});

relay.listen();

relay.on("connect", (player) => {
  console.log("新しい接続:", player.connection.address);

  player.on("join", () => {
    player.queue("text", {
      type: "chat", // または "system"
      needs_translation: false,
      source_name: "Server",
      xuid: "",
      platform_chat_id: "",
      message: player.profile.name + " just joined the server!",
    });
  });
});
