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

relay.conLog = console.debug;
relay.listen();

relay.on("connect", (player) => {
  console.log("新しい接続:", player.connection.address);

  player.on("join", () => {
    console.log("player joined.");
    player.upstream.queue("text", { type: "System", message: "test" });
  });
  player.on("add_player", (packet) => {
    player.upstream.queue("text", {
      type: "chat",
      needs_translation: false,
      source_name: player.username,
      xuid: "",
      platform_chat_id: "",
      message: `Hey, ${packet.username} just joined!`,
    });
  });
});
