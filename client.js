const bedrock = require("bedrock-protocol");
const client = bedrock.createClient({
  host: "localhost", // optional
  port: 19131, // optional, default 19132
  username: "Da1z981", // the username you want to join as, optional if online mode
  offline: true, // optional, default false. if true, do not login with Xbox Live. You will not be asked to sign-in if set to true.
});

client.on("text", (packet) => {
  client.queue("packet_text", params);
});
