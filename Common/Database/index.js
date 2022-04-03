const path = require('path')
const { google } = require("googleapis");

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
}

const auth = new google.auth.GoogleAuth({
  keyFile: "../../secrets.json", //the key file
  //url to spreadsheets API
  scopes: "https://www.googleapis.com/auth/spreadsheets", 
});

const getServerSideProps = async () => {


  console.log('process.env.SHEET_ID', process.env);
  const authClientObject = await auth.getClient();

  const sheets = google.sheets({ version: 'v4', auth: authClientObject });

  // const { id } = query;
  const range = `A3:C3`;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });

  const [title, content] = response.data.values[0];

  return {
    props: { title, content },
  };
};


/**
 * Insert array of values into spreadsheet
 * @param {Array} values - An array of values
 * @returns 
 */
const insertValuesInSheet = async (values) => {
  const authClientObject = await auth.getClient();

  const sheets = google.sheets({ version: 'v4', auth: authClientObject });

  const res = await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: 'Folha1',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: [values],
    },
  });

  return res;
};

const init = async () => {
  const res = await insertValuesInSheet([new Date().toISOString(), 'Some value', 'Another value']);
  console.log('RES', res);
  // console.log(process.env.SHEET_ID);
};

init();

module.exports = {
  getServerSideProps,
};
