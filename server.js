const bedrock = require("bedrock-protocol");
const server = bedrock.createServer({
  host: "100.89.61.11", // optional. host to bind as.
  port: 19132, // optional
  version: "1.21.30", // optional. The server version, latest if not specified.
  maxPlayers: 114514,
  motd: {
    motd: 'Localhost', // Top level message shown in server list
    levelName: 'WTF LOL' // Sub-level header
  }
});

server.on("connect", (client) => {
  client.on("join", () => {
    // The client has joined the server.
    const d = new Date(); // Once client is in the server, send a colorful kick message
    client.disconnect(
      `${d.getHours() < 12 ? "§eおはようございます！§r" : "§3こんにちは！§r"} 接続テストありがとうございます :)\n\n時間: ${d.toLocaleString()} !\n\nサーバーは現在オフラインです！`,
    );
  });
});
