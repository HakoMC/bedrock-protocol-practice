const bedrock = require("bedrock-protocol");
const client = bedrock.createClient({
  host: "localhost", // optional
  port: 19131, // optional, default 19132
  username: "Da1z981", // the username you want to join as, optional if online mode
  offline: true, // optional, default false. if true, do not login with Xbox Live. You will not be asked to sign-in if set to true.
});

player.queue(
  "text",
  {
    type: "chat",
    needs_translation: false,
    source_name: client.username,
    xuid: "",
    platform_chat_id: "",
    message: `Hey, ${packet.username} just joined!`,
  },
  (err) => {
    if (err) {
      console.error("テキストパケットの送信中にエラーが発生しました:", err);
    } else {
      console.log("テキストパケットが正常に送信されました");
    }
  },
);
