var express = require('express');
var router = express.Router();
const axios = require('axios');
const { v4: uuid } = require('uuid');
const {
  getTokenBalancesForAddress,
} = require('../../Common/Requests/BitQuery');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* GET users listing. */
router.get('/requestTGToken/:address', async function (req, res, next) {
  try {
    const httpResponse = await getTokenBalancesForAddress(req.params.address);
    const balances = httpResponse.ethereum.address[0].balances;

    const premiumCoinBalance = balances.find(
      (token) =>
        token.currency.address === '0x292213141dcea64af318453e005c759261f6175f'
    );

    if (premiumCoinBalance && premiumCoinBalance.value > 30000000) {
      const newToken = uuid();

      await mRedis.hset('tokens', newToken, req.params.address);

      console.log('published to redis');
      res.send(`Enjoy your token! ${newToken}`);
      console.log('TOKEN', newToken);
    } else {
      res.send(
        'Your RAST balance is insufficient to access our premium features'
      );
    }
  } catch (error) {
    console.log('error', error);

    res.send('error');
  }
});

/* GET users listing. */
router.get('/:address', async function (req, res, next) {
  const balances = await getTokenBalancesForAddress(req.params.address);
  res.send(balances);
});

module.exports = router;
