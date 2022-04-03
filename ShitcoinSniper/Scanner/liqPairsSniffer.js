var redis = require('redis');
var redisClient = redis.createClient();

const { getTransactionReceipt } = require('../../Common/Requests/BscScan');
const { getNewLiqPairs } = require('../../Common/Requests/BitQuery');
const { getAmount } = require('../../Common/Utils');
const {
  ScannerConfigs: { liqPairSnifferConfigs },
} = require('../Config/config');

const {
  pollingIntervalInSeconds,
  interestThresholds,
  lookBackTimeInHours,
  firstRunLookBackTimeInHours,
} = liqPairSnifferConfigs;

let isFirstRun = true;

const newLpPairsCache = [];

const extractInfoFromLiqPair = (liqPairLogs, token1, token2, lpToken) => {
  const logToken1 = liqPairLogs.find((log) => log.address === token1.value);
  const logToken2 = liqPairLogs.find((log) => log.address === token2.value);
  const logToken3 = liqPairLogs.find((log) => log.address === lpToken.value);

  if (!logToken1 || !logToken2 || !logToken3) {
    console.log(`Invalid Tx`);
    return {
      qtyToken0: -1,
      qtyToken1: -1,
      qtyLpToken: -1,
    };
  }
  const value1 = getAmount(logToken1.data);
  const value2 = getAmount(logToken2.data);
  const value3 = getAmount(logToken3.data);

  return {
    qtyToken0: value1,
    qtyToken1: value2,
    qtyLpToken: value3,
  };
};

const fetchNewLiqPairs = async (lookBackTime) => {
  try {
    const now = new Date(Date.now());
    const startTime = new Date(now - lookBackTime);

    console.log(
      `[LIQUIDITY PAIRS SNIFFER] - ${now.toISOString()} - Getting LP Pairs`
    );
    const result = await getNewLiqPairs(startTime.toISOString());

    const newLiqPairs = result.ethereum.smartContractEvents;

    const liqPairs = [];

    for await (const tx of newLiqPairs) {
      if (!newLpPairsCache.includes(tx.transaction.hash)) {
        // Prevent exceeding the rate limit of bscScan
        await new Promise((resolve) => setTimeout(resolve, 210));

        newLpPairsCache.push(tx.transaction.hash);

        const txHash = tx.transaction.hash;

        const [token0, token1, lpToken, other] = tx.arguments;

        let liqCoin = '';

        if (interestThresholds[token0.value]) {
          liqCoin = token0;
        } else if (interestThresholds[token1.value]) {
          liqCoin = token1;
        } else {
          console.log(
            `[LIQUIDITY PAIRS SNIFFER] - No Liq Coin found: https://bscscan.com/tx/${txHash}`
          );
          continue;
        }

        const receipt = await getTransactionReceipt(txHash);
        console.log(
          `[LIQUIDITY PAIRS SNIFFER] - Extracting https://bscscan.com/tx/${txHash}`
        );

        if (!receipt) continue;

        const { qtyToken0, qtyToken1, qtyLpToken } = extractInfoFromLiqPair(
          receipt,
          token0,
          token1,
          lpToken
        );

        const qty = liqCoin.value === token0.value ? qtyToken0 : qtyToken1;

        if (qty < interestThresholds[liqCoin.value]) {
          console.log('[LIQUIDITY PAIRS SNIFFER] - LP below threshold');
          continue;
        }
        liqPairs.push({ liqCoin, qty, txHash, lpToken });
      }
    }
    return liqPairs;
  } catch (error) {
    console.error('ERROR', error);
    return [];
  }
};

const getLookBackTime = () => {
  const lookBackTime =
    (isFirstRun ? firstRunLookBackTimeInHours : lookBackTimeInHours) *
    60 *
    60 *
    1000; // hrs

  isFirstRun = false;
  return lookBackTime;
};

const init = async () => {
  try {
    const intervalms = pollingIntervalInSeconds * 1000;
    setInterval(async () => {
      const lookBackTime = getLookBackTime();
      const newLiqPairs = await fetchNewLiqPairs(lookBackTime);
      for (const newLiqPair of newLiqPairs) {
        console.log(`pushing LP https://bscscan.com/tx/${newLiqPair.txHash}`);

        redisClient.publish(
          'newLiqPairsChannel',
          JSON.stringify(newLiqPair),
          function () {}
        );
      }
    }, intervalms);
  } catch (error) {
    console.log(error);
  }
};

init();
