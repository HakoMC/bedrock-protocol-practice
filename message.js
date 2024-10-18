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
  player.write("text", { type: "system", message: "test" });
  console.log("新しい接続:", player.connection.address);

  player.on("join", () => {
    console.log("player joined.");
  });
});
