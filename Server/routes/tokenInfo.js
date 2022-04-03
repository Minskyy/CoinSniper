var express = require('express');
var router = express.Router();
const axios = require('axios');
const { v4: uuid } = require('uuid');
const {
  retrieveTokenHoldersList,
  getPercentageBurntOrLocked,
} = require('../../Common/Requests/WebScraping');
const {
  getTokenBalancesForAddress,
  getLpBurns,
} = require('../../Common/Requests/BitQuery');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* GET users listing. */
router.get('/:address', async function (req, res, next) {
  try {
    const tokenHolders = await getTokenHoldersList(req.params.address);
    const lpHolders = await getPercentageBurntOrLocked(req.params.address);
    const lpBurns = await getLpBurns(lookBackTime);
    res.send(lpBurns);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
