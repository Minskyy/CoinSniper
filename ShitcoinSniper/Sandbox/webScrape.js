const axios = require('axios');
const cheerio = require('cheerio');

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

const burnAddresses = [
  '0x000000000000000000000000000000000000dead',
  '0x0000000000000000000000000000000000000000',
];

const getPercentageBurnt = async (address) => {
  const { totalTokens, holders } = await retrieveTokenHoldersList(address);
  let percentageBurnt = 0;

  for (const holder of holders) {
    if (burnAddresses.includes(holder.address)) {
      percentageBurnt += holder.percentage;
    }
  }

  return percentageBurnt;
};

const retrieveTokenHoldersList = async (address) => {
  const url = `https://bscscan.com/token/generic-tokenholders2?a=${address}&s=0&p=`;
  const $ = await fetchHTML(url);
  const tbody = $('#maintable > div:nth-child(3) > table > tbody');
  let i = 1;
  let totalTokens = 0;
  const holders = [];
  while (true) {
    const row = $(`tr:nth-child(${i})`, tbody);
    if (!row.text()) {
      break;
    }
    const address = $('td:nth-child(2)', row).text().replaceAll(' ', ''); // If the address is a contract, the contract icon makes a ' ' in the text
    const quantity = $('td:nth-child(3)', row).text().replaceAll(',', ''); // remove commas from number

    const parsedQuantity = parseFloat(quantity);

    holders.push({ address, quantity: parsedQuantity });
    totalTokens += parsedQuantity;
    i++;
  }

  for (const holder of holders) {
    holder.percentage = holder.quantity / totalTokens;
  }
  return { totalTokens, holders };
};

const init = async () => {
  const percentburnt = await getPercentageBurnt(
    '0x067a5ad3f0f91acf512ffe66ea77f37b4dcaaf18'
  );

  console.log('percentburnt', percentburnt);
};

init();
