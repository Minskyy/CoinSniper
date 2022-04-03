const ScannerConfigs = {
  liqPairSnifferConfigs: {
    firstRunLookBackTimeInHours: 4, // How many hours to look back in the first cycle after starting the bot
    lookBackTimeInHours: 0.5,
    pollingIntervalInSeconds: 60,
    interestThresholds: {
      '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c': 80, // BNB
      '0x55d398326f99059ff775485246999027b3197955': 30000, // BUSD-T,
      '0xe9e7cea3dedca5984780bafc599bd69add087d56': 30000, // BUSD,
    },
  },
  liqBurnSnifferConfigs: {
    firstRunLookBackTimeInHours: 4, // How many hours to look back in the first cycle after starting the bot
    lookBackTimeInHours: 0.5,
    pollingIntervalInSeconds: 60,
    // Estes contratos têm muito spam de lp burns, podemos ignorar
    blackListContracts: [
      '0xd4a55d437da5753da2f937518fd797f5d2211e1c',
      '0x94fcecedbe1050d079c60b1edeb1d4d16b3bf76c',
      '0x71add42909a3319dd3b65d4512d10012ad40ea9c',
      '0x3db7a0de578c928e3a7bde143aec09556080203e',
      '0x42187c7eada603198165c2b95ea237865036bed1',
    ],
  },
};

module.exports = {
  ScannerConfigs,
};
