const bedrock = require("bedrock-protocol");
const client = bedrock.createClient({
  host: "localhost", // optional
  port: 19131, // optional, default 19132
  username: "Da1z981", // the username you want to join as, optional if online mode
  offline: true, // optional, default false. if true, do not login with Xbox Live. You will not be asked to sign-in if set to true.
});

// The 'join' event is emitted after the player has authenticated
// and is ready to recieve chunks and start game packets
client.on("join", (client) => console.log("Player has joined!"));

// The 'spawn' event is emitted. The chunks have been sent and all is well.
client.on("spawn", (client) => console.log("Player has spawned!"));

// We can listen for text packets. See proto.yml for documentation.
client.on("text", (packet) => {
  console.log("Client got text packet", packet);
});

// For example, we can listen to https://prismarinejs.github.io/minecraft-data/?v=bedrock_1.19.60&d=protocol#packet_add_player
// and send them a chat message when a player joins saying hello. Note the lack of the `packet` prefix, and that the packet
// names and as explained in the "Protocol doc" section below, fields are all case sensitive!
client.on("add_player", (packet) => {
  client.queue("text", {
    type: "chat",
    needs_translation: false,
    source_name: client.username,
    xuid: "",
    platform_chat_id: "",
    message: `Hey, ${packet.username} just joined!`,
  });
});
