const { gql, GraphQLClient } = require('graphql-request');
const { bitQueryConfigs } = require('../../config');
const path = require('path')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') })
}

const graphQLClient = new GraphQLClient(bitQueryConfigs.endpoint, {
  headers: {
    'X-API-KEY': process.env.BITQUERY_APIKEY,
  },
});

const getHistoricTokenBalanceForAddress = async (address) => {
  const query = gql`{
    ethereum(network: bsc) {
      address(address: {is: "${address}"}) {
        balances {
          value
          currency {
            symbol
          }
        }
      }
    }
  }`;

  const historicBalance = await graphQLClient.request(query);

  return historicBalance;
};

const getCurrentTokenBalanceOfAddress = async (address) => {
  const query = gql`{
    ethereum(network: bsc) {
      address(address: {is: "${address}"}) {
        balances {
          value
          currency {
            symbol
          }
        }
      }
    }
  }`;

  const balance = await graphQLClient.request(query);

  return balance;
};

const getContractTxWhereFunctionNameWasCalled = async (
  contractAddress,
  functionName
) => {
  const query = gql`{
    ethereum(network: bsc) {
      smartContractCalls(
        smartContractAddress: {is: "${contractAddress}"}
        smartContractMethod: {is: "${functionName}"}
      ) {
        any(of: date)
        smartContractMethod {
          name
        }
        transaction {
          hash
        }
      }
    }
  }`;

  const tx = await graphQLClient.request(query);

  return tx;
};

const getLpBurns = async (startDate) => {
  const query = gql`
  {
    ethereum(network: bsc) {
      transfers(
        receiver: {is: "0x000000000000000000000000000000000000dead"}
        time: {after: "${startDate}"}
        txFrom: {notIn: "0x000000000000000000000000000000000000dead"}
        sender: {not: "0x0000000000000000000000000000000000000000"}
        currency: {notIn: ["0x32698423559ccafe39ee4969a08d41199aaf2796"]}
      ) {
        currency {
          symbol
          address
        }
        transaction {
          hash
        }
      }
    }
  }
  `;

  const res = await graphQLClient.request(query);

  // Filter by Cake-LP stopped working at bitquery, we'll use this as a fix for now
  const transfers = res.ethereum.transfers;
  const lpBurns = transfers.filter(
    (entry) => entry.currency.symbol === 'Cake-LP'
  );

  return lpBurns;
};

const getHistoricTransactionsForAddressByToken = async (address, token) => {
  const query = gql`
    {
      ethereum(network: bsc) {
        dexTrades(
          txSender: { is: "${address}" }
        ) {
          transaction {
            hash
          }
          baseCurrency(
            baseCurrency: { is: "${token}" }
          ) {
            symbol
          }
          buyAmount
          buyCurrency {
            symbol
            address
          }
          sellCurrency {
            symbol
            address
          }
          sellAmount
          block(time: {}) {
            timestamp {
              unixtime
            }
          }
        }
      }
    }
  `;

  const res = await graphQLClient.request(query);

  return res;
};

const getTokenBalancesForAddress = async (address) => {
  const query = gql`
    {
      ethereum(network: bsc) {
        address(address: { is: "${address}" }) {
          balances {
            currency {
              symbol
              address
            }
            value
          }
        }
      }
    }
  `;

  const res = await graphQLClient.request(query);

  return res;
};

const getInitialLiquidityOfPair = async (lpTokenAddress) => {
  const query = gql`
    {
      ethereum(network: bsc) {
        transfers(
          options: { asc: "block.timestamp.time", limit: 2 }
          amount: { gt: 0 }
          receiver: { is: "${lpTokenAddress}" }
        ) {
          block {
            timestamp {
              time(format: "%Y-%m-%d %H:%M:%S")
            }
            height
          }
          address: sender {
            address
            annotation
          }
          currency {
            address
            symbol
          }
          amount
          transaction {
            hash
          }
          external
        }
      }
    }
  `;

  const res = await graphQLClient.request(query);

  return res;
};

const getNewLiqPairs = async (startDate) => {
  const query = gql`
    {
      ethereum(network: bsc) {
        smartContractEvents(
          smartContractEvent: { in: "PairCreated" }
          time: { after: "${startDate}" }
        ) {
          smartContractEvent(smartContractEvent: { is: "PairCreated" }) {
            name
          }
          transaction {
            hash
          }
          arguments {
            argument
            argumentType
            index
            value
          }
        }
      }
    }
  `;

  const newLiqPairs = await graphQLClient.request(query);

  return newLiqPairs;
};

const getDexTradesForAddressByToken = async (address, currencyAddress) => {
  const query = gql`
    {
      ethereum(network: bsc) {
        dexTrades(
          txSender: { is: "${address}" }
        ) {
          transaction {
            hash
          }
          baseCurrency(
            baseCurrency: { is: "${currencyAddress}" }
          ) {
            symbol
          }
          buyAmount
          buyCurrency {
            symbol
            address
          }
          sellCurrency {
            symbol
            address
          }
          sellAmount
          block(time: {}) {
            timestamp {
              unixtime
            }
          }
        }
      }
    }
  `;
  const dexTrades = await graphQLClient.request(query);

  return dexTrades;
};

module.exports = {
  getNewLiqPairs,
  getLpBurns,
  getHistoricTransactionsForAddressByToken,
  getInitialLiquidityOfPair,
  getTokenBalancesForAddress,
  getDexTradesForAddressByToken,
  getHistoricTransactionsForAddressByToken,
  getHistoricTokenBalanceForAddress,
  getCurrentTokenBalanceOfAddress,
  getContractTxWhereFunctionNameWasCalled,
};
