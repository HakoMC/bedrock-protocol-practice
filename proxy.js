const { Relay } = require("bedrock-protocol");
const relay = new Relay({
  version: "1.21.30", // The version
  /* host and port to listen for clients on */
  host: "100.89.61.11",
  port: 19132,
  /* Where to send upstream packets to */
  destination: {
    host: "127.0.0.1",
    port: 19131,
  },
});

relay.listen(); // Tell the server to start listening.

function logSkinInfo(skinData, source) {
  console.log(`Player Skin Information (${source}):`);
  console.log("UUID:", skinData.uuid);
  console.log("Skin Name:", skinData.skin_name);
  console.log("Skin Id:", skinData.skin.skin_id);
  console.log("Skin Image Width:", skinData.skin.skin_data.width);
  console.log("Skin Image Height:", skinData.skin.skin_data.height);
  console.log("Skin Data Binary:", skinData.skin.skin_data.data);
  saveSkinAsPNG(
    skinData.skin.skin_data.data,
    skinData.skin.skin_data.width,
    skinData.skin.skin_data.height,
    "player_skin.png",
  )
    .then(() => console.log("Skin saved as PNG"))
    .catch((err) => console.error("Error saving skin:", err));
}

relay.on("connect", (player) => {
  console.log("New connection", player.connection.address);

  // Server is sending a message to the client.
  player.on("clientbound", ({ name, params }, des) => {
    if (name === "disconnect") {
      // Intercept kick
      params.message = "Intercepted"; // Change kick message to "Intercepted"
    }
    if (name === "player_skin") {
      logSkinInfo(params, "Skin Change");
    }
    if (name === "start_game") {
      params.seed = 114514n;
      params.world_name = "翻訳ワールド";
    }
    if (name === "player_list") {
      console.log(params.records.type);
      if (params.records.type === "add") {
        console.log(params.records.records_count);
        params.records.records.forEach((record) => {
          console.log(record.uuid);
          console.log(record.username);
          console.log(record.xbox_user_id);
          console.log(record.platform_chat_id);
          console.log(record.skin_data.skin_data.data);
        });
      }
    }
  });
  // Client is sending a message to the server
  player.on("serverbound", ({ name, params }, des) => {
    if (name === "text") {
      // Intercept chat message to server and append time.
      params.message += ` (via proxy)`;
      let messageType = params.type;
      let playerName = params.source_name;
      console.log(`Type: ${messageType}, Source: ${playerName}`);
    }

    if (name === "command_request") {
      // Intercept command request to server and cancel if its "/test"
      if (params.command == "/test") {
        des.canceled = true;
      }
    }
  });
});

const fs = require("fs");
const { PNG } = require("pngjs");

function saveSkinAsPNG(skinData, width, height, filename) {
  // ByteArrayをBufferに変換
  const buffer = Buffer.from(skinData);

  // 新しいPNGオブジェクトを作成
  const png = new PNG({
    width: width,
    height: height,
    filterType: -1,
  });

  // BufferデータをPNGのデータ配列にコピー
  buffer.copy(png.data, 0, 0, buffer.length);

  // PNGをエンコードしてファイルに保存
  const stream = png.pack();
  const out = fs.createWriteStream(filename);
  stream.pipe(out);

  return new Promise((resolve, reject) => {
    out.on("finish", resolve);
    out.on("error", reject);
  });
}
