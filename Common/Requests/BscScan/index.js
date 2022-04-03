const axios = require('axios');

const getInternalTransactionsForAddress = async (contractAddress) => {
  const res = await axios.get(
    `https://api.bscscan.com/api?module=account&action=txlistinternal&address=${contractAddress}&sort=asc&apikey=YourApiKeyToken`
  );
};

const getTxInteractedContract = async (txHash) => {
  const res = await axios.get(
    `https://api.bscscan.com/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=YourApiKeyToken`
  );

  return res && res.data.result.to;
};

const getTransactionReceipt = async (txHash) => {
  const res = await axios.get(
    `https://api.bscscan.com/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=YourApiKeyToken`
  );
  return res && res.data.result.logs;
};

module.exports = {
  getInternalTransactionsForAddress,
  getTxInteractedContract,
  getTransactionReceipt,
};
