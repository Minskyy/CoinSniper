const web3 = require('web3');
const { tokenAddresses } = require('../../Common/Utils/knownAddresses');

const mapAddress = (address) => {
  if (tokenAddresses[address]) {
    return tokenAddresses[address];
  }
  return address;
};

const weiToDecimal = (weiValue) => {
  try {
    return web3.utils.fromWei(weiValue);
  } catch (error) {
    return -1;
  }
};

/**
 * Returns the amount converted from a wei number (18 0's) to a regular decimal
 *
 * @param {String} data ex: 1890000000000000000 -> 1,89
 */
const getAmount = (data) => {
  const decValue = hexToDec(data);
  const decValueWithCommasRemoved = decValue.toLocaleString('fullwide', {
    useGrouping: false,
  });
  const valueFromWei = weiToDecimal(decValueWithCommasRemoved);

  return valueFromWei;
};

const ignoreLeading0s = (hex) => {
  return hex.replace(/^0x0+/, '0x');
};

function hexToDec(hexString) {
  return parseInt(hexString, 16);
}

module.exports = {
  mapAddress,
  hexToDec,
  ignoreLeading0s,
  getAmount,
  weiToDecimal,
};
