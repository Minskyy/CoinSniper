// const mRedis = require("../../Common/RedisClient/index");

const {
  retrieveTokenHoldersList,
} = require('../../Common/Requests/WebScraping/index');
const {
  getTransactionReceipt,
} = require('../../Common/Requests/BscScan/index');

const init = async () => {
  // const redisClient = new mRedis();

  // await redisClient.addToList("tgTokens", JSON.stringify({ a: 2, b: 3 }));

  const holders = await retrieveTokenHoldersList(
    '0x067a5ad3f0f91acf512ffe66ea77f37b4dcaaf18'
  );
  const receipt = await getTransactionReceipt(
    '0x64b7e56d43f860b1d01eb423b9632efd4a8b7ab3ef93f6c3561ab03d202fb9fb'
  );
  // console.log(await redisClient.get("ab"));

  console.log('done', receipt.length);

  // redisClient.get('aaaa', (res) => {
  //   console.log('REs', res);
  // })
  // console.log(await getRedis('aaaa'));
  // telegramTokenHandler.set('aaaa', 2);
};

init();
