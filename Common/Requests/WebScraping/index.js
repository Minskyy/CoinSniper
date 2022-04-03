const axios = require('axios');
const cheerio = require('cheerio');

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

const lockAdresses = ['0xc8b839b9226965caf1d9fc1551588aaf553a7be6'];

const burnAddresses = [
  '0x000000000000000000000000000000000000dead',
  '0x0000000000000000000000000000000000000000',
];

const getPercentageBurntOrLocked = async (address) => {
  const holders = await retrieveTokenHoldersList(address);

  let percentageBurnt = 0;
  let percentageLocked = 0;

  for (const holder of holders) {
    if (burnAddresses.includes(holder.address)) {
      percentageBurnt += holder.percentage;
    }
    if (lockAdresses.includes(holder.address)) {
      percentageLocked += holder.percentage;
    }
  }

  return percentageBurnt + percentageLocked;
};

/**
 * This function will scrape the page like ex: https://bscscan.com/token/generic-tokenholders2?a=0x8a48cec6c41b5827ecc1f68e3630cd40aa4d508c&s=0&p=
 * and retrieve the list of holders, with the percentage calculated on our side, as it is not shown in this page
 *
 * Note: This looks only at the 1st page of holders, so the numbers might be slighly off, if we want to scrape the complete list of
 * holders for a better estimate, we just need to cycle through the multiple "p=" possibilities at the end of the link, but for now
 * it's not worth the extra time
 *
 * @param {address} address The address of the token
 * @returns {Array} holders array with the format [{address, quantity, percentage}]
 */
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
    const address = $('td:nth-child(2)', row).text().replace(/ /g, '');
    const quantity = $('td:nth-child(3)', row).text().replace(/,/g, ''); // remove commas from number

    const parsedQuantity = parseFloat(quantity);

    holders.push({ address, quantity: parsedQuantity });
    totalTokens += parsedQuantity;
    i++;
  }

  for (const holder of holders) {
    holder.percentage = holder.quantity / totalTokens;
  }
  return holders;
};

module.exports = {
  retrieveTokenHoldersList,
  getPercentageBurntOrLocked,
};
