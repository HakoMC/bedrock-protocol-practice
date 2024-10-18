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
