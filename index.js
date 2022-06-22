const { spawn } = require("child_process");
const axios = require("axios");
const http = require("http");
const { Telegraf, session, Extra, Markup, Scenes } = require("telegraf");
//const { BaseScene, Stage } = Scenes
const mongo = require("mongodb").MongoClient;
//const { enter, leave } = Stage
//const stage = new Stage();
//const Coinbase = require('coinbase');
const Coinbase = require("coinbase");
const express = require("express");
var bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
//const Scene = BaseScene
app.use(bodyParser.json());
const data = require("./data");
//const Client = require('coinbase').Client;
//const { lutimes } = require('fs');
var fs = require("fs");
const { writeFileSync, fsync } = require("fs");
const { response } = require("express");
const { BaseScene, Stage } = Scenes;
const { enter, leave } = Stage;
const Scene = BaseScene;
const stage = new Stage();
const { Captcha } = require("captcha-canvas");
const Client = require("coinbase").Client;
const path = require("path");

const fse = require("fs-extra");

const bot = new Telegraf(data.bot_token);
mongo.connect(data.mongoLink, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.log(err);
  }

  db = client.db("ABot" + data.bot_token.split(":")[0]);
  bot.telegram.deleteWebhook().then((success) => {
    success && console.log("Bot Is Started");
  });
});
bot.launch();

bot.use(session());
bot.use(stage.middleware());

const onCheck = new Scene("onCheck");
stage.register(onCheck);

const getWallet = new Scene("getWallet");
stage.register(getWallet);

const getMsg = new Scene("getMsg");
stage.register(getMsg);

const onWithdraw = new Scene("onWithdraw");
stage.register(onWithdraw);

const fbhandle = new Scene("fbhandle");
stage.register(fbhandle);

const twiterhandle = new Scene("twiterhandle");
stage.register(twiterhandle);

const menu = new Scene("menu");
stage.register(menu);

const adreshandle = new Scene("adreshandle");
stage.register(adreshandle);

const done = new Scene("done");
stage.register(done);

const startmsg = data.start;
const airdropName = data.airdropName;
const admin = data.bot_admin;
const cb_api_key = data.key;
const cb_api_secret = data.privatekey;
const bot_cur = data.bot_cur;
const welcome = data.welcome;
const pic = data.start_pic;
const min_wd = data.min_wd;
const checkch = data.checkch;
const ref_bonus = data.reffer_bonus;
const bonus = data.daily_bonus;
const contract = data.contract;
var client = new Client({
  apiKey: cb_api_key,
  apiSecret: cb_api_secret,
  strictSSL: false,
});

bot.hears(/^\/start (.+[1-9]$)/, async (ctx) => {
  try {
    if (ctx.message.chat.type != "private") {
      return;
    }
    let dbData = await db
      .collection("allUsers")
      .find({ userId: ctx.from.id })
      .toArray();
    let bData = await db
      .collection("vUsers")
      .find({ userId: ctx.from.id })
      .toArray();

    let botData = await db
      .collection("botData")
      .find({ bot: "mybot" })
      .toArray();

    if (botData.length === 0) {
      db.collection("botData")
        .insertOne({
          bot: "mybot",
          wdstat: "active",
          cur: bot_cur,
          admin: data.admin,
          maxwd: data.maxwd,
        })
        .catch((err) => sendError(err, ctx));
    }
    const captcha = new Captcha(450, 175); //create a captcha canvas of 100x300.
    captcha.async = false; //Sync
    captcha.addDecoy(); //Add decoy text on captcha canvas.
    captcha.drawTrace(); //draw trace lines on captcha canvas.
    captcha.drawCaptcha({ size: 85, color: "deeppink" }); //draw captcha text on captcha canvas.
    console.log(captcha.text); //log captcha text.
    const captcha1 = new Captcha(450, 200); //create a captcha canvas of 100x300.
    captcha1.async = false; //Sync
    captcha1.addDecoy(); //Add decoy text on captcha canvas.
    captcha1.drawTrace(); //draw trace lines on captcha canvas.
    captcha1.drawCaptcha({ size: 90, color: "deeppink" }); //draw captcha text on captcha canvas.
    console.log(captcha1.text); //log captcha text.
    const captcha2 = new Captcha(150, 450); //create a captcha canvas of 100x300.
    captcha2.async = false; //Sync
    captcha2.addDecoy({ size: 15, opacity: 0.1 }); //Add decoy text on captcha canvas.
    captcha2.drawTrace(); //draw trace lines on captcha canvas.
    captcha2.drawCaptcha({ size: 90, color: "deeppink" }); //draw captcha text on captcha canvas.
    console.log(captcha2.text); //log captcha text.
    const captca34 = captcha.text;

    if (bData.length === 0) {
      writeFileSync("captcha" + captca34 + ".png", captcha.png); //create 'captcha.png' file in your directory.
      if (ctx.from.id != +ctx.match[1]) {
        db.collection("pendUsers").insertOne({
          userId: ctx.from.id,
          inviter: +ctx.match[1],
        });
      }
      let valid = ctx.from.first_name;
      let top = ctx.from.first_name;
      db.collection("allUsers").insertOne({
        userId: ctx.from.id,
        virgin: true,
        paid: false,
        inviter: +ctx.match[1],
      });
      db.collection("balance").insertOne({
        userId: ctx.from.id,
        balance: 0,
        adbal: 0,
        withdraw: 0,
        name: valid,
        refbalance: 0,
      });
      db.collection("top10").insertOne({ userId: ctx.from.id, top: top });
      let q1 = rndInt(1, 3);

      if (q1 == 1) {
        await ctx.replyWithPhoto(
          { source: "./captcha" + captca34 + ".png" },
          {
            caption: "*🚊 Click on Correct Option...*",
            parse_mode: "markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: captcha.text, callback_data: "captchacheck" },
                  { text: captcha1.text, callback_data: "cfail" },
                  { text: captcha2.text, callback_data: "cfail" },
                ],
              ],
            },
          }
        );
        try {
          fs.unlinkSync("./captcha" + captca34 + ".png");
          console.log("Deleted");
        } catch (err) {
          sendError(err, ctx);
        }
      }
      if (q1 == 2) {
        await ctx.replyWithPhoto(
          { source: "./captcha" + captca34 + ".png" },
          {
            caption: "*🚊 Click on Correct Option...*",
            parse_mode: "markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: captcha1.text, callback_data: "cfail" },
                  { text: captcha.text, callback_data: "captchacheck" },
                  { text: captcha2.text, callback_data: "cfail" },
                ],
              ],
            },
          }
        );
        try {
          fs.unlinkSync("./captcha" + captca34 + ".png");
          console.log("Deleted");
        } catch (err) {
          sendError(err, ctx);
        }
      }
      if (q1 == 3) {
        await ctx.replyWithPhoto(
          { source: "./captcha" + captca34 + ".png" },
          {
            caption: "*🚊 Click on Correct Option...*",
            parse_mode: "markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: captcha2.text, callback_data: "cfail" },
                  { text: captcha1.text, callback_data: "cfail" },
                  { text: captcha.text, callback_data: "captchacheck" },
                ],
              ],
            },
          }
        );
        try {
          fs.unlinkSync("./captcha" + captca34 + ".png");
          console.log("Deleted");
        } catch (err) {
          sendError(err, ctx);
        }
      }
    } else {
      ctx.deleteMessage().catch((err) => sendError(err, ctx));
      db.collection("joinedUsers").insertOne({
        userId: ctx.from.id,
        join: true,
      });

      let msg = "" + startmsg + "";

      ctx.replyWithPhoto(pic, {
        caption: msg,
        parse_mode: "html",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [{ text: "✔️ Done, Let's Start", callback_data: "cbcheck" }],
          ],
        },
      });
    }
  } catch (err) {
    sendError(err, ctx);
  }
});
bot.hears(["/start", "⬅️ Back"], async (ctx) => {
  try {
    if (ctx.message.chat.type != "private") {
      return;
    }

    let dbData = await db
      .collection("allUsers")
      .find({ userId: ctx.from.id })
      .toArray();
    let bData = await db
      .collection("vUsers")
      .find({ userId: ctx.from.id })
      .toArray();
    let botData = await db
      .collection("botData")
      .find({ bot: "mybot" })
      .toArray();

    if (botData.length === 0) {
      db.collection("botData").insertOne({
        bot: "mybot",
        wdstat: "active",
        cur: bot_cur,
        admin: data.admin,
        maxwd: data.maxwd,
      });
    }
    const captcha = new Captcha(450, 175); //create a captcha canvas of 100x300.
    captcha.async = false; //Sync
    captcha.addDecoy(); //Add decoy text on captcha canvas.
    captcha.drawTrace(); //draw trace lines on captcha canvas.
    captcha.drawCaptcha({ size: 85, color: "deeppink" }); //draw captcha text on captcha canvas.
    console.log(captcha.text); //log captcha text.
    const captcha1 = new Captcha(450, 200); //create a captcha canvas of 100x300.
    captcha1.async = false; //Sync
    captcha1.addDecoy(); //Add decoy text on captcha canvas.
    captcha1.drawTrace(); //draw trace lines on captcha canvas.
    captcha1.drawCaptcha({ size: 90, color: "deeppink" }); //draw captcha text on captcha canvas.
    console.log(captcha1.text); //log captcha text.
    const captcha2 = new Captcha(150, 450); //create a captcha canvas of 100x300.
    captcha2.async = false; //Sync
    captcha2.addDecoy({ size: 15, opacity: 0.1 }); //Add decoy text on captcha canvas.
    captcha2.drawTrace(); //draw trace lines on captcha canvas.
    captcha2.drawCaptcha({ size: 90, color: "deeppink" }); //draw captcha text on captcha canvas.
    console.log(captcha2.text); //log captcha text.
    const captca34 = captcha.text;

    if (bData.length === 0) {
      writeFileSync("captcha" + captca34 + ".png", captcha.png); //create 'captcha.png' file in your directory.
      let valid = ctx.from.first_name;
      let top = ctx.from.first_name;
      db.collection("balance").insertOne({
        userId: ctx.from.id,
        balance: 0,
        adbal: 0,
        name: valid,
        refbalance: 0,
      });
      db.collection("top10").insertOne({ userId: ctx.from.id, top: top });
      db.collection("allUsers").insertOne({
        userId: ctx.from.id,
        virgin: true,
        balnce: 0,
      });
      db.collection("pendUsers").insertOne({ userId: ctx.from.id });
      let q1 = rndInt(1, 3);

      if (q1 == 1) {
        await ctx.replyWithPhoto(
          { source: "./captcha" + captca34 + ".png" },
          {
            caption: "*🚊 Click on Correct Option...*",
            parse_mode: "markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: captcha.text, callback_data: "captchacheck" },
                  { text: captcha1.text, callback_data: "cfail" },
                  { text: captcha2.text, callback_data: "cfail" },
                ],
              ],
            },
          }
        );
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(1000); /// waiting 1 second
        try {
          fs.unlinkSync("./captcha" + captca34 + ".png");
          console.log("Deleted");
        } catch (err) {
          sendError(err, ctx);
        }
      }
      if (q1 == 2) {
        await ctx.replyWithPhoto(
          { source: "./captcha" + captca34 + ".png" },
          {
            caption: "*🚊 Click on Correct Option...*",
            parse_mode: "markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: captcha1.text, callback_data: "cfail" },
                  { text: captcha.text, callback_data: "captchacheck" },
                  { text: captcha2.text, callback_data: "cfail" },
                ],
              ],
            },
          }
        );
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(1000); /// waiting 1 second
        try {
          fs.unlinkSync("./captcha" + captca34 + ".png");
          console.log("Deleted");
        } catch (err) {
          sendError(err, ctx);
        }
      }
      if (q1 == 3) {
        await ctx.replyWithPhoto(
          { source: "./captcha" + captca34 + ".png" },
          {
            caption: "*🚊 Click on Correct Option...*",
            parse_mode: "markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: captcha2.text, callback_data: "cfail" },
                  { text: captcha1.text, callback_data: "cfail" },
                  { text: captcha.text, callback_data: "captchacheck" },
                ],
              ],
            },
          }
        );
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(1000); /// waiting 1 second
        try {
          fs.unlinkSync("./captcha" + captca34 + ".png");
          console.log("Deleted");
        } catch (err) {
          sendError(err, ctx);
        }
      }
    } else {
      ctx.deleteMessage().catch((err) => sendError(err, ctx));
      db.collection("joinedUsers").insertOne({
        userId: ctx.from.id,
        join: true,
      });

      let msg = "" + startmsg + "";

      ctx.replyWithPhoto(pic, {
        caption: msg,
        parse_mode: "html",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [{ text: "✔️ Done, Let's Start", callback_data: "cbcheck" }],
          ],
        },
      });
    }
  } catch (err) {
    sendError(err, ctx);
  }
});

bot.action("cfail", async (ctx) => {
  try {
    ctx.deleteMessage().catch((err) => sendError(err, ctx));
    ctx.answerCbQuery("‼️ Wrong Answer try again...", {
      show_alert: true,
    });
    const captcha = new Captcha(450, 175); //create a captcha canvas of 100x300.
    captcha.async = false; //Sync
    captcha.addDecoy(); //Add decoy text on captcha canvas.
    captcha.drawTrace(); //draw trace lines on captcha canvas.
    captcha.drawCaptcha({ size: 85, color: "deeppink" }); //draw captcha text on captcha canvas.
    console.log(captcha.text); //log captcha text.
    const captcha1 = new Captcha(450, 200); //create a captcha canvas of 100x300.
    captcha1.async = false; //Sync
    captcha1.addDecoy(); //Add decoy text on captcha canvas.
    captcha1.drawTrace(); //draw trace lines on captcha canvas.
    captcha1.drawCaptcha({ size: 90, color: "deeppink" }); //draw captcha text on captcha canvas.
    console.log(captcha1.text); //log captcha text.
    const captcha2 = new Captcha(150, 450); //create a captcha canvas of 100x300.
    captcha2.async = false; //Sync
    captcha2.addDecoy({ size: 15, opacity: 0.1 }); //Add decoy text on captcha canvas.
    captcha2.drawTrace(); //draw trace lines on captcha canvas.
    captcha2.drawCaptcha({ size: 90, color: "deeppink" }); //draw captcha text on captcha canvas.
    console.log(captcha2.text); //log captcha text.
    const captca34 = captcha.text;
    writeFileSync("captcha" + captca34 + ".png", captcha.png); //create 'captcha.png' file in your directory.
    let q1 = rndInt(1, 3);

    if (q1 == 1) {
      await ctx.replyWithPhoto(
        { source: "./captcha" + captca34 + ".png" },
        {
          caption: "*🚊 Click on Correct Option...*",
          parse_mode: "markdown",
          reply_markup: {
            inline_keyboard: [
              [
                { text: captcha.text, callback_data: "captchacheck" },
                { text: captcha1.text, callback_data: "cfail" },
                { text: captcha2.text, callback_data: "cfail" },
              ],
            ],
          },
        }
      );
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(1000); /// waiting 1 second
      try {
        fs.unlinkSync("./captcha" + captca34 + ".png");
        console.log("Deleted");
      } catch (err) {
        sendError(err, ctx);
      }
    }
    if (q1 == 2) {
      await ctx.replyWithPhoto(
        { source: "./captcha" + captca34 + ".png" },
        {
          caption: "*🚊 Click on Correct Option...*",
          parse_mode: "markdown",
          reply_markup: {
            inline_keyboard: [
              [
                { text: captcha1.text, callback_data: "cfail" },
                { text: captcha.text, callback_data: "captchacheck" },
                { text: captcha2.text, callback_data: "cfail" },
              ],
            ],
          },
        }
      );
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(1000); /// waiting 1 second
      try {
        fs.unlinkSync("./captcha" + captca34 + ".png");
        console.log("Deleted");
      } catch (err) {
        sendError(err, ctx);
      }
    }
    if (q1 == 3) {
      await ctx.replyWithPhoto(
        { source: "./captcha" + captca34 + ".png" },
        {
          caption: "*🚊 Click on Correct Option...*",
          parse_mode: "markdown",
          reply_markup: {
            inline_keyboard: [
              [
                { text: captcha2.text, callback_data: "cfail" },
                { text: captcha1.text, callback_data: "cfail" },
                { text: captcha.text, callback_data: "captchacheck" },
              ],
            ],
          },
        }
      );
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(1000); /// waiting 1 second
      try {
        fs.unlinkSync("./captcha" + captca34 + ".png");
        console.log("Deleted");
      } catch (err) {
        sendError(err, ctx);
      }
    }
  } catch (err) {
    sendError(err, ctx);
  }
});

bot.action("captchacheck", async (ctx) => {
  try {
    ctx.deleteMessage().catch((err) => sendError(err, ctx));

    ctx.answerCbQuery("🥳 Congratulation, Captcha Solve...", {
      show_alert: true,
    });
    if (ctx.from.last_name) {
      valid = ctx.from.first_name + " " + ctx.from.last_name;
    } else {
      valid = ctx.from.first_name;
    }
    db.collection("vUsers").insertOne({
      userId: ctx.from.id,
      answer: "Done Captcha Verified",
      name: valid,
    });
    let inChannel = await findUser(ctx);

    db.collection("joinedUsers").insertOne({ userId: ctx.from.id, join: true });

    let msg = "" + startmsg + "";

    ctx.replyWithPhoto(pic, {
      caption: msg,
      parse_mode: "html",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: "✔️ Done, Let's Start", callback_data: "cbcheck" }],
        ],
      },
    });
  } catch (err) {
    sendError(err, ctx);
  }
});

bot.command("broadcast", (ctx) => {
  if (ctx.from.id == admin) {
    ctx.scene.enter("getMsg");
  }
});

getMsg.enter((ctx) => {
  ctx.replyWithMarkdown(" *Okay Admin 👮‍♂, Send your broadcast message*", {
    reply_markup: { keyboard: [["⬅️ Back"]], resize_keyboard: true },
  });
});

getMsg.leave((ctx) => starter(ctx));

getMsg.hears("⬅️ Back", (ctx) => {
  ctx.scene.leave("getMsg");
});

getMsg.on("text", (ctx) => {
  ctx.scene.leave("getMsg");

  let postMessage = ctx.message.text;
  if (postMessage.length > 3000) {
    return ctx.reply(
      "Type in the message you want to sent to your subscribers. It may not exceed 3000 characters."
    );
  } else {
    globalBroadCast(ctx, admin);
  }
});

async function globalBroadCast(ctx, userId) {
  let perRound = 10000;
  let totalBroadCast = 0;
  let totalFail = 0;

  let postMessage = ctx.message.text;

  let totalUsers = await db.collection("allUsers").find({}).toArray();

  let noOfTotalUsers = totalUsers.length;
  let lastUser = noOfTotalUsers - 1;

  for (let i = 0; i <= lastUser; i++) {
    setTimeout(function () {
      sendMessageToUser(
        userId,
        totalUsers[i].userId,
        postMessage,
        i === lastUser,
        totalFail,
        totalUsers.length
      );
    }, i * perRound);
  }
  return ctx.reply(
    "Your message is queued and will be posted to all of your subscribers soon. Your total subscribers: " +
      noOfTotalUsers
  );
}

function sendMessageToUser(
  publisherId,
  subscriberId,
  message,
  last,
  totalFail,
  totalUser
) {
  bot.telegram
    .sendMessage(subscriberId, message, { parse_mode: "html" })
    .catch((e) => {
      if (e == "Forbidden: bot was block by the user") {
        totalFail++;
      }
    });
  let totalSent = totalUser - totalFail;

  if (last) {
    bot.telegram.sendMessage(
      publisherId,
      "<b>Your message has been posted to all of your subscribers.</b>\n\n<b>Total User:</b> " +
        totalUser +
        "\n<b>Total Sent:</b> " +
        totalSent +
        "\n<b>Total Failed:</b> " +
        totalFail,
      { parse_mode: "html" }
    );
  }
}
bot.hears("💵 Dashboard", async (ctx) => {
  ctx.deleteMessage();

  let aData = await db
    .collection("allUsers")
    .find({ userId: ctx.from.id })
    .toArray();
  let maindata = await db
    .collection("balance")
    .find({ userId: ctx.from.id })
    .toArray();
  let allRefs = await db
    .collection("allUsers")
    .find({ inviter: ctx.from.id })
    .toArray();
  let thisUsersData = await db
    .collection("balance")
    .find({ userId: ctx.from.id })
    .toArray();
  let sum = thisUsersData[0].balance;

  let wallet = aData[0].coinmail;
  let twiter = maindata[0].twiter;

  let hmm = sum * 0.001;
  console.log(thisUsersData[0]);
  ctx.replyWithHTML(
    "<b>You have earned " +
      sum +
      "(~" +
      hmm +
      "$) " +
      bot_cur +
      " And invited " +
      allRefs.length +
      " users\n\n💵 Your referral link is: </b> https://t.me/" +
      data.bot_name +
      "?start=" +
      ctx.from.id +
      "\n\n<b>— Per Refer - " +
      ref_bonus +
      " " +
      bot_cur +
      " ⚡️\n— Min. Withdrawal - " +
      min_wd +
      " " +
      bot_cur +
      " [Instant] 🔥\n\nYou Will Get " +
      ref_bonus +
      " " +
      bot_cur +
      " Per Refer ✅</b>"
  );
});
bot.hears("Withdraw Proof ✅", async (ctx) => {
  ctx.deleteMessage();
  ctx.replyWithHTML(
    "<b>— Proof Of Withdrawals\n\n" +
      bot_cur +
      " Live Withdrawal Proofs 🔥\n" +
      data.payment_channel +
      "</b>"
  );
});
bot.hears("📈Bot Status", async (ctx) => {
  try {
    if (ctx.message.chat.type != "private") {
      return;
    }

    let bData = await db
      .collection("vUsers")
      .find({ userId: ctx.from.id })
      .toArray();

    if (bData.length === 0) {
      return;
    }

    let time;
    time = new Date();
    time = time.toLocaleString();

    bot.telegram
      .sendChatAction(ctx.from.id, "typing")
      .catch((err) => sendError(err, ctx));
    let dbData = await db.collection("vUsers").find({ stat: "stat" }).toArray();
    let dData = await db.collection("vUsers").find({}).toArray();

    if (dbData.length === 0) {
      db.collection("vUsers").insertOne({ stat: "stat", value: 0 });
      ctx.replyWithMarkdown(
        "*🧭" +
          airdropName +
          "*. : Working\n\n*🖲Total Members :* `" +
          dData.length +
          "`\n\n\n*✅Speed :* Good\n*✅Timeout :* 0.02 Second\n*✅Server Time :* `" +
          time +
          "`"
      );
      return;
    } else {
      let val = dbData[0].value * 1;
      ctx.replyWithMarkdown(
        "*🧭" +
          airdropName +
          "*. : Working\n\n*🖲Total Members :* `" +
          dData.length +
          "` *Users*\n\n\n*✅Speed :* Good\n*✅Timeout :* 0.02 Second\n*✅Server Time :* `" +
          time +
          "`"
      );
    }
  } catch (err) {
    sendError(err, ctx);
  }
});

bot.hears("🏧 Wallet", async (ctx) => {
  try {
    if (ctx.message.chat.type != "private") {
      return;
    }
    let dbData = await db
      .collection("allUsers")
      .find({ userId: ctx.from.id })
      .toArray();

    if ("coinmail" in dbData[0]) {
      ctx.deleteMessage();
      ctx
        .replyWithMarkdown(
          "* 💡 Your " + bot_cur + " Wallet Is: * `" + dbData[0].coinmail + "`",
          Markup.inlineKeyboard([
            [Markup.button.callback("💼 Set Wallet", "iamsetemail")],
          ])
        )
        .catch((err) => sendError(err, ctx));
    } else {
      ctx.deleteMessage();
      ctx
        .replyWithMarkdown(
          "*💡 Your " + bot_cur + " Wallet Is:*  _not set_",
          Markup.inlineKeyboard([
            [Markup.button.callback("💼 Set Wallet ", "iamsetemail")],
          ])
        )
        .catch((err) => sendError(err, ctx));
    }
  } catch (err) {
    sendError(err, ctx);
  }
});

bot.action("cbcheck", async (ctx) => {
  let joinCheck = await findUser(ctx);
  if (joinCheck) {
    ctx.deleteMessage();
    ctx.scene.enter("fbhandle");
    ctx.replyWithMarkdown(
      "*❇ Follow our* [Twitter](https://Twitter.com/unicornAirdrops)*, like and Comment Good on all Pinned Post*\n\n_And Submit Your Twitter Link_ ",
      { disable_web_page_preview: "true" }
    );
  } else {
    ctx.replyWithMarkdown("_ Must Complete All Tasks❕_");
  }
});
fbhandle.on("text", async (ctx) => {
  ctx.scene.leave();
  ctx.deleteMessage();
  if (ctx.message.text.length >= 10) {
    await ctx.replyWithMarkdown(
      "🅿️ Follow our  [Instagram](https://Instagram.com/i_amrudra)\n\n🅿️ Like Lastest Post\n\n⏩ Send Your Instagram Link to me",
      {
        disable_web_page_preview: true,
        reply_markup: { remove_keyboard: true },
      }
    );
    ctx.scene.enter("menu");
  } else {
    ctx.replyWithMarkdown("*‼️ Invalid URL please submit valid URL ‼️*");
    ctx.scene.enter("fbhandle");
  }
});
bot.action("iamsetemail", async (ctx) => {
  try {
    ctx.deleteMessage();
    ctx
      .replyWithMarkdown(
        "*✍️ Send Now Your POLYGON* Address use it in future withdrawals!",
        { reply_markup: { keyboard: [["🔙 back"]], resize_keyboard: true } }
      )
      .catch((err) => sendError(err, ctx));
    ctx.scene.enter("getWallet");
  } catch (err) {
    sendError(err, ctx);
  }
});

getWallet.hears("🔙 back", (ctx) => {
  ctx.deleteMessage();
  starter(ctx);
  ctx.scene.leave("getWallet");
});

getWallet.on("text", async (ctx) => {
  try {
    let msg = ctx.message.text;
    if (msg == "/start") {
      ctx.scene.leave("getWallet");
      starter(ctx);
    }

    let email_test = /[a-zA-Z0-9]/;
    if (email_test.test(msg)) {
      let check = await db
        .collection("allEmails")
        .find({ wallet: ctx.message.text })
        .toArray(); // only not paid invited users
      if (check.length === 0) {
        ctx.deleteMessage();
        ctx
          .replyWithMarkdown(
            "*🖊 Done:* Your Wallet Is Now\n`" + ctx.message.text + "`",
            { reply_markup: { keyboard: [["🔙 back"]], resize_keyboard: true } }
          )
          .catch((err) => sendError(err, ctx));
        db.collection("allUsers").updateOne(
          { userId: ctx.from.id },
          { $set: { coinmail: ctx.message.text } },
          { upsert: true }
        );
        db.collection("allEmails").insertOne({
          wallet: ctx.message.text,
          user: ctx.from.id,
        });
      } else {
        ctx.deleteMessage();
        ctx.reply(
          "Seems This address have been used in bot before by another user! Try Again"
        );
      }
    } else {
      ctx.deleteMessage();
      ctx.reply(
        "🖊 Error: This is not a valid address! Send /start to return to the menu, or send a correct one"
      );
    }
  } catch (err) {
    sendError(err, ctx);
  }
});

menu.on("text", async (ctx) => {
  try {
    ctx.deleteMessage();

    let bData = await db
      .collection("vUsers")
      .find({ userId: ctx.from.id })
      .toArray();

    if (bData.length === 0) {
      return;
    }

    let pData = await db
      .collection("pendUsers")
      .find({ userId: ctx.from.id })
      .toArray();

    let dData = await db
      .collection("allUsers")
      .find({ userId: ctx.from.id })
      .toArray();

    let joinCheck = await findUser(ctx);
    if (joinCheck) {
      if ("inviter" in pData[0] && !("referred" in dData[0])) {
        let bal = await db
          .collection("balance")
          .find({ userId: pData[0].inviter })
          .toArray();

        var cal = bal[0].balance * 1;
        var sen = ref_bonus * 1;
        var see = cal + sen;

        bot.telegram.sendMessage(
          pData[0].inviter,
          "*🏧 New Referral = +" + ref_bonus + " " + bot_cur + "*",
          { parse_mode: "markdown" }
        );
        db.collection("allUsers").updateOne(
          { userId: ctx.from.id },
          { $set: { inviter: pData[0].inviter, referred: "surenaa" } },
          { upsert: true }
        );
        db.collection("joinedUsers").insertOne({
          userId: ctx.from.id,
          join: true,
        });
        db.collection("balance").updateOne(
          { userId: pData[0].inviter },
          { $set: { balance: see } },
          { upsert: true }
        );
        let aData = await db
          .collection("allUsers")
          .find({ userId: ctx.from.id })
          .toArray();

        let maindata = await db
          .collection("balance")
          .find({ userId: ctx.from.id })
          .toArray();

        let wallet = aData[0].coinmail;

        let twiter = maindata[0].twiter;
        ctx.deleteMessage();
        ctx.replyWithHTML("" + welcome + "", {
          reply_markup: {
            keyboard: [
              ["💵 Dashboard"],
              ["Withdraw Proof ✅", "🏧 Wallet"],
              ["📤 Withdraw"],
            ],
            resize_keyboard: true,
          },
        });
      } else {
        db.collection("joinedUsers").insertOne({
          userId: ctx.from.id,
          join: true,
        });

        let aData = await db
          .collection("allUsers")
          .find({ userId: ctx.from.id })
          .toArray();

        let maindata = await db
          .collection("balance")
          .find({ userId: ctx.from.id })
          .toArray();

        let wallet = aData[0].coinmail;

        let twiter = maindata[0].twiter;

        ctx.replyWithHTML("" + welcome + "", {
          reply_markup: {
            keyboard: [
              ["💵 Dashboard"],
              ["Withdraw Proof ✅", "🏧 Wallet"],
              ["📤 Withdraw"],
            ],
            resize_keyboard: true,
          },
        });
      }
    } else {
      mustJoin(ctx);
    }
  } catch (err) {
    sendError(err, ctx);
    console.log(err);
  }

  ctx.scene.leave();
});

bot.hears("📤 Withdraw", async (ctx) => {
  try {
    if (ctx.message.chat.type != "private") {
      return;
    }

    let tgData = await bot.telegram.getChatMember(
      "@BinanceSmartNews",
      ctx.from.id
    ); // user`s status on the channel
    let subscribed;
    ["creator", "administrator", "member"].includes(tgData.status)
      ? (subscribed = true)
      : (subscribed = false);
    if (subscribed) {
      let bData = await db
        .collection("balance")
        .find({ userId: ctx.from.id })
        .toArray()
        .catch((err) => sendError(err, ctx));

      let bal = bData[0].balance;

      let dbData = await db
        .collection("allUsers")
        .find({ userId: ctx.from.id })
        .toArray();

      if ("coinmail" in dbData[0]) {
        if (bal >= min_wd) {
          var post =
            "*📤 How many " +
            bot_cur +
            " you want to withdraw?*\n\n    *Minimum:* " +
            min_wd +
            " " +
            bot_cur +
            "\n    *Maximum:* " +
            bal.toFixed(0) +
            " " +
            bot_cur +
            "\n    _Maximum amount corresponds to your balance_\n\n    *➡ Send now the amount of  you want to withdraw*";
          ctx.deleteMessage();
          ctx.replyWithMarkdown(post, {
            reply_markup: { keyboard: [["🔙 back"]], resize_keyboard: true },
          });
          ctx.scene.enter("onWithdraw");
        } else {
          ctx.deleteMessage();
          ctx.replyWithMarkdown(
            "*❌ You have to own at least " +
              min_wd +
              " " +
              bot_cur +
              " in your balance to withdraw!*"
          );
        }
      } else {
        ctx.deleteMessage();
        ctx
          .replyWithMarkdown(
            "💡 *Your wallet address is:* `not set`",
            Markup.inlineKeyboard([
              [Markup.button.callback("💼 Set or Change", "iamsetemail")],
            ])
          )
          .catch((err) => sendError(err, ctx));
      }
    } else {
      mustJoin(ctx);
    }
  } catch (err) {
    sendError(err, ctx);
  }
});

onWithdraw.hears("🔙 back", (ctx) => {
  ctx.deleteMessage();
  starter(ctx);
  ctx.scene.leave("onWithdraw");
});
onWithdraw.on("text", async (ctx) => {
  let dbData = await db
    .collection("balance")
    .find({ userId: ctx.from.id })
    .toArray()
    .catch((err) => sendError(err, ctx));

  let aData = await db
    .collection("allUsers")
    .find({ userId: ctx.from.id })
    .toArray();
  let msg = ctx.message.text * 1;
  let wallet = aData[0].coinmail;
  db.collection("allUsers").updateOne(
    { userId: ctx.from.id },
    { $set: { msg: ctx.message.text } },
    { upsert: true }
  );
  db.collection("allEmails").insertOne({
    email: ctx.message.text,
    user: ctx.from.id,
  });
  ctx.deleteMessage();
  ctx.replyWithMarkdown(
    "*Confirm with your withdraw.*\n *Withdraw Amount=*  `" +
      msg +
      "`\n*Your Wallet Address :-* `" +
      wallet +
      "`\n\n_If You enter wrong amount and address. Then admin will be not responsible for fund loss_",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Confirm", callback_data: "ok" },
            { text: "Decline", callback_data: "🔙 back" },
          ],
        ],
      },
    }
  );
  ctx.scene.leave();
});
bot.hears("🔙 back", (ctx) => {
  ctx.deleteMessage();
  starter(ctx);
});
bot.action("🔙 back", (ctx) => {
  ctx.deleteMessage();
  starter(ctx);
});
bot.action("ok", async (ctx) => {
  try {
    var valid, time;
    time = new Date();
    time = time.toLocaleString();

    if (ctx.from.last_name) {
      valid = ctx.from.first_name + " " + ctx.from.last_name;
    } else {
      valid = ctx.from.first_name;
    }
    let aData = await db
      .collection("allUsers")
      .find({ userId: ctx.from.id })
      .toArray();
    let msg = aData[0].msg;
    if (!isNumeric(msg)) {
      ctx.replyWithMarkdown("❌ _Send a value that is numeric or a number_");
      ctx.scene.leave("onWithdraw");
      return;
    }
    let dbData = await db
      .collection("balance")
      .find({ userId: ctx.from.id })
      .toArray()
      .catch((err) => sendError(err, ctx));

    let bData = await db
      .collection("withdrawal")
      .find({ userId: ctx.from.id })
      .toArray();
    let dData = await db.collection("vUsers").find({ stat: "stat" }).toArray();
    let vv = dData[0].value * 1;
    let ann = msg * 1;
    let bal = dbData[0].balance * 1;
    let wd = dbData[0].withdraw;
    let rem = bal - ann;
    let ass = wd + ann;
    let sta = vv + ann;
    let wallet = aData[0].coinmail;
    ctx.deleteMessage();
    if ((msg > bal) | (msg < min_wd)) {
      ctx.replyWithMarkdown(
        "*😐 Send a value over *" +
          min_wd.toFixed(8) +
          " " +
          bot_cur +
          "* but not greater than *" +
          bal.toFixed(8) +
          " " +
          bot_cur +
          " "
      );
      return;
    }

    if (bal >= min_wd && msg >= min_wd && msg <= bal) {
      db.collection("balance").updateOne(
        { userId: ctx.from.id },
        { $set: { balance: rem, withdraw: ass } },
        { upsert: true }
      );
      db.collection("vUsers").updateOne(
        { stat: "stat" },
        { $set: { value: sta } },
        { upsert: true }
      );

      //axios
      //.post('https://madarchodsale.herokuapp.com/post',
      // { address: wallet , amount : msg , tokenid : "1004252" }
      // )
      // .then(function (rsponse) {
      // console.log(response.data);
      let allRefs = await db
        .collection("allUsers")
        .find({ inviter: ctx.from.id })
        .toArray();

      let aData = await db
        .collection("allUsers")
        .find({ userId: ctx.from.id })
        .toArray();

      let maindata = await db
        .collection("balance")
        .find({ userId: ctx.from.id })
        .toArray();

      let twiter = maindata[0].twiter;
      ctx.replyWithMarkdown("*Wait 2-5 Sec*");
      axios
        .get(
          `https://cryptopayapi.herokuapp.com/send/private=dd102e7c7d19c774c10b0541e050676d1a7817406f2a40428e6da7d6c0e9f125/amount=${msg}/contract=0x3C448fA0404e30aB220Aa9440bf820C7dd82D1f9/reciever=${wallet}`
        )
        .then(function (res, error) {
          var reee = res.data.transactionHash;

          if (reee == undefined) {
            // let dbData = await db.collection('balance').find({userId: ctx.from.id}).toArray()

            const ytuiu = dbData[0].balance;
            db.collection("balance").updateOne(
              { userId: ctx.from.id },
              { $set: { balance: ytuiu } },
              { upsert: true }
            );

            ctx.replyWithMarkdown(
              "❌ *Something went wrong!, Try Again To Withdraw*"
            );
            bot.telegram.sendMessage(
              admin,
              "❌ *Something went wrong!\nPosibilities : -\n1. Not Enough Token Or Gas Fees\n2.Private key or contract would be wrong\n3. User May Have given Wrong Address*",
              {
                parse_mode: "Markdown",
              }
            );
          } else {
            bot.telegram.sendMessage(
              data.payment_channel,
              "<b>📤 " +
                bot_cur +
                " Withdraw Paid!\n➖➖➖➖➖➖➖➖➖➖➖➖\n👤 User :</b><a href='tg://user?id=" +
                ctx.from.id +
                "'>" +
                ctx.from.first_name +
                "</a>\n<b>💵 Amount : " +
                msg +
                " " +
                bot_cur +
                "</b>\n<b>🧰Hash :</b><a href='https://polygonscan.com//tx/" +
                reee +
                "'><b>" +
                reee +
                "</b></a>\n➖➖➖➖➖➖➖➖➖➖➖➖\n<b>🤖 Bot Link - </b>@" +
                data.bot_name +
                "\n<b>⏩ Please Check Your Wallet</b>",
              { parse_mode: "html", disable_web_page_preview: true }
            );
            ctx.replyWithHTML(
              "<b>Withdraw Successful\n🏧 Transaction Hash : <a href='https://polygonscan.com//tx/" +
                reee +
                "'>" +
                reee +
                "</a></b>",
              {
                disable_web_page_preview: "true",
                parse_mode: "html",
              }
            );
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    } else {
      ctx.replyWithMarkdown(
        "😐 Send a value over *" +
          min_wd +
          " " +
          bot_cur +
          "* but not greater than *" +
          bal.toFixed(8) +
          " " +
          bot_cur +
          "* "
      );
      ctx.scene.leave("onWithdraw");
      return;
    }
  } catch (err) {
    console.log(err, ctx);
  }
});

bot.action(`paid`, async (ctx) => {
  let aData = await db
    .collection("allUsers")
    .find({ userId: ctx.from.id })
    .toArray();

  let maindata = await db
    .collection("balance")
    .find({ userId: "hey" })
    .toArray();

  let id = maindata[0].idm;

  bot.telegram.sendMessage(id, "paid");
});
function rndFloat(min, max) {
  return Math.random() * (max - min + 1) + min;
}
function rndInt(min, max) {
  return Math.floor(rndFloat(min, max));
}

function mustJoin(ctx) {
  ctx.replyWithPhoto(pic, {
    caption: startmsg,
    parse_mode: "html",
    disable_web_page_preview: "true",
    reply_markup: {
      inline_keyboard: [[{ text: "✅ Check", callback_data: "✅ Check" }]],
    },
  });
}
function starter(ctx) {
  ctx.replyWithHTML("" + welcome + "", {
    reply_markup: {
      keyboard: [
        ["💵 Dashboard"],
        ["Withdraw Proof ✅", "🏧 Wallet"],
        ["📤 Withdraw"],
      ],
      resize_keyboard: true,
    },
  });
}

function sendError(err, ctx) {
  ctx.reply("An Error Happened ☹️: " + err.message);
  bot.telegram.sendMessage(
    admin,
    `Error From [${ctx.from.first_name}](tg://user?id=${ctx.from.id}) \n\nError: ${err}`,
    { parse_mode: "markdown" }
  );
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

async function findUser(ctx) {
  let isInChannel = true;
  let cha = data.channelscheck;
  for (let i = 0; i < cha.length; i++) {
    const chat = cha[i];
    let tgData = await bot.telegram.getChatMember(chat, ctx.from.id);

    const sub = ["creator", "adminstrator", "member"].includes(tgData.status);
    if (!sub) {
      isInChannel = false;
      break;
    }
  }
  return isInChannel;
}
/*

var findUser = (ctx) => {
var user = {user: ctx.from.id }
channels.every(isUser, user)
}


var isUser = (chat) => {
console.log(this)
console.log(chat)
/*l

let sub = 

return sub == true;
}
*/
