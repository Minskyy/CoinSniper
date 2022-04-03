const axios = require('axios');
const web3 = require('web3');
var fs = require('fs');

const getTransactionReceipt = async (txHash) => {
  const res = await axios.get(
    `https://api.bscscan.com/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=YourApiKeyToken`
  );
  return res.data.result.logs;
};

const init = async () => {
  try {
    let rawdata = fs.readFileSync('transactionsWithLogs.json');
    let transactions = JSON.parse(rawdata);

    for (i = 0; i < transactions.length; i++) {
      const tx = transactions[i];
      if (tx.logs) {
        console.log('Skipping tx: ', tx.hash);
        continue;
      }
      const logs = await getTransactionReceipt(tx.hash);
      tx.logs = logs;
      console.log(`Writing logs for tx ${tx.hash} - Iteration ${i}`);
    }

    fs.writeFile(
      'transactionsWithLogs.json',
      JSON.stringify(transactions),
      function (err) {
        if (err) throw err;
        console.log('Saved!');
      }
    );
  } catch (error) {
    console.log('error', error);
  }
};

init();
