const redis = require('redis');
const lpBurnSniffer = redis.createClient();
const liquidityPairSniffer = redis.createClient();
const pubisher = redis.createClient();
const { getInitialLiquidityOfPair } = require('../../Common/Requests/BitQuery');
const {
  getPercentageBurntOrLocked,
} = require('../../Common/Requests/WebScraping');
const { mapAddress } = require('../../Common/Utils');
const baseCurrencyAddresses = {
  '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c': 'BNB', // BNB
  '0x55d398326f99059ff775485246999027b3197955': 'BUSD-T', // BUSD-T,
  '0xe9e7cea3dedca5984780bafc599bd69add087d56': 'BUSD', // BUSD,
};
const { google } = require('googleapis');

lpBurnSniffer.on('message', async function (channel, data) {
  const parsedData = JSON.parse(data);

  const { currency, transaction } = parsedData;

  if (currency.address == '-') {
    console.log('Could not retrieve LP info');
    return;
  }
  const res = await getInitialLiquidityOfPair(currency.address);

  const initialLP = res.ethereum.transfers;

  const baseCurrency = initialLP.find(
    (entry) => baseCurrencyAddresses[entry.currency.address]
  );
  const shitcoin = initialLP.find(
    (entry) => !baseCurrencyAddresses[entry.currency.address]
  );

  const percentageBurnt = await getPercentageBurntOrLocked(currency.address);

  const dataToPublish = `
  - *New LP Burn*!
  - BaseCurrency - ${
    baseCurrency
      ? `*${baseCurrency.amount} ${
          baseCurrencyAddresses[baseCurrency.currency.address]
        }*`
      : 'Unknown amount of BNB'
  }
  - Tokens minted - ${shitcoin ? `*${shitcoin.amount}*` : 'Unknown'}
  - LP Burnt/Locked: *${(percentageBurnt * 100).toFixed(2)}*%
  - Tx: https://bscscan.com/tx/${transaction.hash}
  `;

  pubisher.publish('analyzedDataChannel', dataToPublish, function () {
    console.log(
      `[ANALYZER] - Analyzed and published ${dataToPublish} to analyzedDataChannel `
    );
  });
});

liquidityPairSniffer.on('message', async function (channel, data) {
  const parsedData = JSON.parse(data);

  const { liqCoin, qty, txHash, lpToken } = parsedData;

  const percentageBurnt = await getPercentageBurntOrLocked(lpToken);

  const dataToPublish = `
  New Liquidity Pair found with *${qty} ${mapAddress(liqCoin.value)}*
  LP Burnt/Locked: *${(percentageBurnt * 100).toFixed(2)}*%
  https://bscscan.com/tx/${txHash}`;

  pubisher.publish('analyzedLiqPairsChannel', dataToPublish, async function () {
    console.log(
      `[ANALYZER] - Analyzed and published ${data} to analyzedLiqPairsChannel `
    );
  });
});

lpBurnSniffer.subscribe('newLPBurnsChannel');
liquidityPairSniffer.subscribe('newLiqPairsChannel');
