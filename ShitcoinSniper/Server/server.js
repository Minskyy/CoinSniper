var redis = require('redis');
var subscriber = redis.createClient();
var analyzedLiquidityPairSniffer = redis.createClient();
var pubisher = redis.createClient();
var telegramTokenHandler = redis.createClient();

telegramTokenHandler.on('message', function (channel, data) {
  console.log('NEW TOKEN', data);
  console.log('NEW TOKEN', data);
  // pubisher.publish('processedLiqBurnsChannel', data, function () {
  //   console.log(
  //     `[SERVER] - Published analyzed ${data} to processedLiqBurnsChannel`
  //   );
  // });
});


subscriber.on('message', function (channel, data) {
  pubisher.publish('processedLiqBurnsChannel', data, function () {
    console.log(
      `[SERVER] - Published analyzed ${data} to processedLiqBurnsChannel`
    );
  });
});

analyzedLiquidityPairSniffer.on('message', function (channel, data) {
  pubisher.publish('processedLiqPairsChannel', data, function () {
    console.log(
      `[SERVER] - Published processed ${data} to processedLiqPairsChannel`
    );
  });
});

subscriber.subscribe('analyzedDataChannel');
analyzedLiquidityPairSniffer.subscribe('analyzedLiqPairsChannel');
telegramTokenHandler.subscribe('newTokensChannel');


