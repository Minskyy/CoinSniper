var redis = require('redis');
var liqBurnsSniffer = redis.createClient();
var liqPairsSniffer = redis.createClient();
const path = require('path')

const mRedis = require('../../Common/RedisClient/index');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
}

const oRedis = new mRedis();

const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN;


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const clients = [];

liqBurnsSniffer.subscribe('processedLiqBurnsChannel');
liqPairsSniffer.subscribe('processedLiqPairsChannel');

// Matches "/echo [whatever]"
bot.onText(/\/subscribe(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;

  const resp = match[1].replace(/ /g, '');

  const address = await oRedis.hget('tokens', resp);

  if (!address) {
    console.log('address', address);
    bot.sendMessage(chatId, 'Invalid token');
    return;
  }

  if (!clients.includes(chatId)) {
    bot.sendMessage(chatId, 'You are now subscribed to this premium feature');
    oRedis.hdel('tokens', resp);
    console.log('[TELEGRAM BOT] - New client');
    bot.sendMessage(chatId, 'Scanning...');
    clients.push(chatId);
  }

  bot.sendMessage(chatId, 'You are already subscribed to this feature');
});

// Matches "/echo [whatever]"
bot.onText(/\/showClients/, (msg) => {
  const chatId = msg.chat.id;

  for (const client of clients) {
    bot.sendMessage(chatId, `ClientID: ${client}`);
  }
});

bot.onText(/\/startScanning/, (msg, match) => {
  console.log(token);

  const chatId = msg.chat.id;
  if (!clients.includes(chatId)) {
    console.log('[TELEGRAM BOT] - New client');
    bot.sendMessage(chatId, 'Scanning...');
    clients.push(chatId);
  }
});

liqBurnsSniffer.on('message', function (channel, message) {
  for (const client of clients) {
    console.log('[TELEGRAM BOT] - Sent message to clients');
    bot.sendMessage(client, message, { parse_mode: 'Markdown' });
  }
});

liqPairsSniffer.on('message', function (channel, message) {
  for (const client of clients) {
    console.log('[TELEGRAM BOT] - Sent message to clients');
    bot.sendMessage(client, message, { parse_mode: 'Markdown' });
  }
});
