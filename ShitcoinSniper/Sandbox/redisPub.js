var redis = require('redis');
var redisClient = redis.createClient();
const web3 = require('web3');
const { tokenAddresses } = require('../../Common/Utils/knownAddresses');

const { getNewLiqPairs } = require('../../Common/Requests/BitQuery');
const {
  getTxInteractedContract,
  getTransactionReceipt,
} = require('../../Common/Requests/BscScan');

const weiToDecimal = (weiValue) => {
  try {
    return web3.utils.fromWei(weiValue);
  } catch (error) {
    return -1;
  }
};

const getAmount = (data) => {
  const decValue = hexToDec(data);
  const lel = decValue.toLocaleString('fullwide', { useGrouping: false });
  const valueFromWei = weiToDecimal(lel);

  return valueFromWei;
};

const mapAddress = (address) => {
  if (tokenAddresses[address]) {
    return tokenAddresses[address];
  }
  return address;
};

const ignoreLeading0s = (hex) => {
  return hex.replace(/^0x0+/, '0x');
};

function hexToDec(hexString) {
  return parseInt(hexString, 16);
}

const extractInfoFromLiqPair = (liqPairLogs, token1, token2, lpToken) => {
  const logToken1 = liqPairLogs.find((log) => log.address === token1.value);
  const logToken2 = liqPairLogs.find((log) => log.address === token2.value);
  const logToken3 = liqPairLogs.find((log) => log.address === lpToken.value);

  if (!logToken1 || !logToken2 || !logToken3) {
    console.log('INVALID TXINVALID TXINVALID TXINVALID TXINVALID TXINVALID TX');
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

const interestThresholds = {
  '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c': 10, // BNB
  '0x55d398326f99059ff775485246999027b3197955': 20000, // BUSD-T,
  '0xe9e7cea3dedca5984780bafc599bd69add087d56': 20000, // BUSD,
};

const init = async () => {
  const lpBurnsCache = [];

  try {
    const secondsInterval = 5;
    const intervalms = secondsInterval * 1000;

    const hrsLookBack = 0.5;
    const lookBackTime = hrsLookBack * 60 * 60 * 1000; // hrs

    try {
      const now = new Date(Date.now());
      const startTime = new Date(now - lookBackTime);

      console.log(
        `[LIQUIDITY PAIRS SNIFFER] - ${now.toISOString()} - Getting LP pairs`
      );
      const lpBurns = await getNewLiqPairs(startTime.toISOString());

      const newLiqPairs = lpBurns.ethereum.smartContractEvents;

      for (const tx of newLiqPairs) {
        const txHash = tx.transaction.hash;

        const [token0, token1, lpToken, other] = tx.arguments;

        let liqCoin = '';

        if (interestThresholds[token0.value]) {
          liqCoin = token0.value;
        } else if (interestThresholds[token1.value]) {
          liqCoin = token1.value;
        } else {
          console.log(`No Liq Coin found: https://bscscan.com/tx/${txHash}`);
          continue;
        }

        const receipt = await getTransactionReceipt(txHash);
        console.log(`extracting https://bscscan.com/tx/${txHash}`);

        const { qtyToken0, qtyToken1, qtyLpToken } = extractInfoFromLiqPair(
          receipt,
          token0,
          token1,
          lpToken
        );

        const qty = liqCoin === token0 ? qtyToken0 : qtyToken1;

        if (qty < interestThresholds[liqCoin]) {
          console.log('Shitcoin alert');
          continue;
        }

        console.log(`Good liq`);
        // redisClient.publish(
        //   'newLiqPairsChannel',
        //   `
        //   TxHash: https://bscscan.com/tx/${txHash}
        //   Token1: ${qtyToken0} ${mapAddress(token0.value)}
        //   Token2: ${qtyToken1} ${mapAddress(token1.value)}
        //   Received: ${qtyLpToken} ${lpToken.value}`,
        //   function () {}
        // );
      }

      return;

      const txHash = lpBurns.ethereum.smartContractEvents[1].transaction.hash;
      const [
        token0,
        token1,
        lpToken,
        other,
      ] = lpBurns.ethereum.smartContractEvents[1].arguments;

      const receipt = await getTransactionReceipt(txHash);

      extractInfoFromLiqPair(receipt, token0, token1, lpToken);

      return;
      for (const tx of lpBurns.ethereum.transfers) {
        if (!lpBurnsCache.includes(tx.transaction.hash)) {
          const to = await getTxInteractedContract(tx.transaction.hash);
          lpBurnsCache.push(tx.transaction.hash);
          if (blackListContracts.includes(to)) {
            console.log(`${now.toISOString()} - No new LP Burns found`);
            continue;
          }
          redisClient.publish(
            'rawDataChannel',
            `https://bscscan.com/tx/${tx.transaction.hash}`,
            function () {}
          );
          console.log(
            `[LIQUIDITY PAIRS SNIFFER] - ${now.toISOString()} - https://bscscan.com/tx/${
              tx.transaction.hash
            }`
          );
        }
      }
    } catch (error) {
      console.error('ERROR', error);
    }
  } catch (error) {
    console.log(error);
  }
};

// const a = getAmount(
//   '0x00000000000000000000000000000000000000000000000573a0ece8bbadc218'
// );
// console.log('a', a);
init();
