const axios = require('axios');
const web3 = require('web3');
var fs = require('fs');
const objectsToCsv = require('objects-to-csv');

const addressMapper = {
  '0x522e4c72ae4b6d1b9a22bead644b38182dc54460': 'PancakeSwap: GG2 4',
  '0x42368414cdcbf0a2e5f8cc027614b5b142cb9f59': 'SPB',
  '0x4a5a34212404f30c5ab7eb61b078fa4a55adc5a5': 'MILK',
  '0xba8a6ef5f15ed18e7184f44a775060a6bf91d8d0': 'SHAKE',
  '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c': 'BNB',
  '0xe9e7cea3dedca5984780bafc599bd69add087d56': 'BUSD',
  '0xe561479bebee0e606c19bb1973fc4761613e3c42': 'MEOWTH',
  '0x2b56ae44435825cebdb3cbcb15e2458345da5247': 'MEOWTH POOL',
  '0x89e4595155d4064dcf7bd1bf8854a0c20d45f2c7': 'PERSEKEER',
  '0x522e4c72ae4b6d1b9a22bead644b38182dc54460': 'GG2',
  '0xa41497122bb9b9eb2eb1c5c872551e145bc3166b': 'GG1',
  '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82': 'CAKE',
  '0xf952fc3ca7325cc27d15885d37117676d25bfda6': 'EGG',
  '0xa184088a740c695e156f91f5cc086a06bb78b827': 'AUTO',
  '0x233d91a0713155003fc4dce0afa871b508b3b715': 'DITTO',
  '0xf859bf77cbe8699013d6dbc7c2b926aaf307f830': 'BRY',
  '0x067a5ad3f0f91acf512ffe66ea77f37b4dcaaf18': 'WYNAUT',
  '0x2849b1ae7e04a3d9bc288673a92477cf63f28af4': 'SALT',
  '0x5239fe1a8c0b6ece6ad6009d15315e02b1e7c4ea': 'SMOKE',
  '0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51': 'BUNNY',
  '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95': 'BANANA',
  '0x096901973ac5b4dd14728fae04597b90b2a47da9': 'GLTO',
  '0x4f47a0d15c1e53f3d94c069c7d16977c29f9cb6b': 'RAMEN',
  '0xa6025ec5cc294546eb9c56c7f0e460104eb6dc3c': 'GBOI',
  '0x2263bf3c00787a7cfa17aef830261d1fe342fd5b': 'FLO',
  '0x3ea50b7ef6a7eaf7e966e2cb72b519c16557497c': 'PBOM',
  '0x22d67b3f6acdf8c0682f6fb20590e902deea6ba1': 'TOAD',
  '0x111111111117dc0aa78b770fa6a738034120c302': '1INCH',
  '0x4ac95acb54bf2fdb48cab3fab6f40ff88bd85c85': 'ICLP',
  '0xbc387eda241f51f21e885f2cc3b85039af58ee27': 'FBUF',
  '0x790be81c3ca0e53974be2688cdb954732c9862e1': 'BREW',
  '0xe02df9e3e622debdd69fb838bb799e3f168902c5': 'BAKE',
  '0x6306e883493824ccf606d90e25f68a28e47b98a3': 'EXF',
  '0xf21768ccbc73ea5b6fd3c687208a7c2def2d966e': 'REEF',
  '0x42b41189e9b371b7952b77ae791fe25e78d22681': 'Moo Ramen Ramen-BNB',
  '0x605d96de6068f08489392a35e9dbe90201574bbc': 'Moo Ramen Ramen-BUSD',
  '0x470bc451810b312bbb1256f96b0895d95ea659b1': 'CAKE-LP',
  '0xd1b59d11316e87c3a0a069e80f590ba35cd8d8d3': 'CAKE-LP-EGG',
  '0xc2015012fc30090b35be493327ed1f762e43f4c6': 'CAKE-LP-GG2',
  '0x82f504d655ec6dba8d5ebbd0036a908a719a295f': 'CAKE-LP-RAMEN',
  '0xa153dcf90b0704fbac98f9d20ebf4e2ff15253f7': 'CAKE-LP-SPB',
  '0x04f81b56b6947cd0fd35fbea570fc09d1b946c56': 'CAKE-LP-RAMEN-BUSD',
  '0xa6846394f9765a9ab6ff1f516777d615e8556003': 'CAKE-LP-SHAKE',
  '0x1bf2609946b0583eac8c9a3136a24f7ea06c91bc': 'CAKE-LP-MILK',
  '0xe7d530cc866487407d93836194b6b7a47a5c1582': 'CAKE-LP-SMOKE',
  '0x6284b49544c8900b4612f8450dce8d484e5c2631': 'CAKE-LP-SALT',
  '0x730e2065b9daee84c3003c05bf6d2b3a08e55667': 'CAKE-LP-MEOWTH',
  '0xa8d547d000349b28a4e8c0289e15407c453ad009': 'CAKE-LP-WYNAUT',
  '0x4d0228ebeb39f6d2f29ba528e2d15fc9121ead56': 'CAKE-LP-AUTO',
};

const unkAddresses = [];

const mapAddress = (address) => {
  if (addressMapper[address]) {
    return addressMapper[address];
  }
  if (!unkAddresses.includes(address)) {
    unkAddresses.push(address);
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

const ignoreLeading0s = (hex) => {
  return hex.replace(/^0x0+/, '0x');
};

const getAmount = (data) => {
  const decValue = hexToDec(data);
  const valueFromWei = weiToDecimal(decValue.toString());

  return valueFromWei;
};

const getAddress = (address) => {};

const init = async () => {
  try {
    let rawdata = fs.readFileSync('transactionsWithLogs.json');
    let transactions = JSON.parse(rawdata);
    const arrayToWriteToCSV = [];

    for (const tx of transactions) {
      const logs = tx.logs;

      if (!tx.logs || !tx.logs.length) {
        continue;
      }

      const from = logs[0];
      const to = logs[logs.length - 1];

      const amountFrom = getAmount(from.data);
      const amountTo = getAmount(to.data);

      // if (amountFrom < 0 || amountTo < 0) {
      //   continue;
      // }

      const fromAddress = mapAddress(from.address);
      const toAddress = mapAddress(to.address);

      const obj = {
        fromAddress: fromAddress,
        fromAmount: amountFrom,
        toAddress: toAddress,
        toAmount: amountTo,
        txHash: tx.hash,
        gasUsed: tx.gasUsed,
        contract: tx.to,
      };

      arrayToWriteToCSV.push(obj);

      console.log(
        `Swapped: ${amountFrom} ${fromAddress} For: ${amountTo} ${toAddress}`
      );
    }

    const csv = new objectsToCsv(arrayToWriteToCSV);

    await csv.toDisk('./transactions.csv');

    const from = log[0].topics[1];
    const to = ignoreLeading0s(log[log.length - 1].topics[2]);

    logs.forEach((log) => {
      if (log.data.length <= 66) {
        const decValue = hexToDec(log.data);

        const valueFromWei = weiToDecimal(decValue.toString());

        // console.log('log', log);

        const from = ignoreLeading0s(log.topics[1]);
        const to = ignoreLeading0s(log.topics[2]);

        console.log(
          `
          From: ${mapAddress(from)}
          To: ${mapAddress(to)}
          Token: ${mapAddress(log.address)}
          amount: ${valueFromWei}`
        );
      }
    });
  } catch (error) {
    console.log('error', error);
  }
};

init();
// console.log('UNKNOWN ADDRESSES', unkAddresses);

function hexToDec(hexString) {
  return parseInt(hexString, 16);
}
