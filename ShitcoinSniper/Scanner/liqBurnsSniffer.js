var redis = require('redis');
var redisClient = redis.createClient();

const { getLpBurns } = require('../../Common/Requests/BitQuery/index');
const {
  getTxInteractedContract,
  getTransactionReceipt,
} = require('../../Common/Requests/BscScan');
const {
  ScannerConfigs: { liqBurnSnifferConfigs },
} = require('../Config/config');

const {
  blackListContracts,
  lookBackTimeInHours,
  pollingIntervalInSeconds,
  firstRunLookBackTimeInHours,
} = liqBurnSnifferConfigs;
const lpBurnsCache = [];

let isFirstRun = true;

const fetchNewLPBurns = async (lookBackTime) => {
  try {
    const now = new Date(Date.now());
    const startTime = new Date(now - lookBackTime);

    console.log(
      `[LIQUIDITY BURNS SNIFFER] - ${now.toISOString()} - Getting LP Burns`
    );
    const lpBurns = await getLpBurns(startTime.toISOString());
    const lpBurnsResult = [];

    for await (const tx of lpBurns) {
      if (!lpBurnsCache.includes(tx.transaction.hash)) {
        await new Promise((resolve) => setTimeout(resolve, 210));
        const to = await getTxInteractedContract(tx.transaction.hash);
        // const receipt = await getTransactionReceipt(tx.transaction.hash);
        lpBurnsCache.push(tx.transaction.hash);
        if (blackListContracts.includes(to)) {
          console.log(`${now.toISOString()} - No new LP Burns found`);
          continue;
        }

        // if (receipt?.length > 10) {
        //   console.log(
        //     `${now.toISOString()} - Logs.length > 10. Tx : https://bscscan.com/tx/${
        //       tx.transaction.hash
        //     }`
        //   );
        //   continue;
        // }

        lpBurnsResult.push(tx);
      }
    }
    return lpBurnsResult;
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
    const lookBackTime = getLookBackTime();

    setInterval(async () => {
      const newLpBurnsTxHashes = await fetchNewLPBurns(lookBackTime);

      for (const tx of newLpBurnsTxHashes) {
        redisClient.publish(
          'newLPBurnsChannel',
          JSON.stringify(tx),
          function () {}
        );
        console.log(
          `[LIQUIDITY BURNS SNIFFER] Pushed - https://bscscan.com/tx/${tx.transaction.hash}`
        );
      }
    }, intervalms);
  } catch (error) {
    console.log(error);
  }
};

init();
