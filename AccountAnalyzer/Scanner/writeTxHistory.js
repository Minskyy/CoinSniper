const axios = require('axios');
const web3 = require('web3');
var fs = require('fs');

const getAddressTransactions = async (address) => {
  const res = await axios.get(
    `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=1&endblock=99999999&sort=desc&apikey=YourApiKeyToken`
  );

  console.log(res.data.result[0]);

  return res;
};

/**
 * @param {} address
 */
const writeTransactionsToFile = async (address) => {
  try {
    const transactions = await getAddressTransactions(address);

    fs.writeFile(
      'transactions.json',
      JSON.stringify(transactions.data.result),
      function (err) {
        if (err) throw err;
        console.log('Saved!');
      }
    );
  } catch (error) {}
};

const init = async (address) => {
  writeTransactionsToFile(address);
};

