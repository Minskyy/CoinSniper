import { REQUEST_TOKEN } from "./types";
import axios from "axios";

const requestTokenSuccess = (address, data) => {
  return {
    type: REQUEST_TOKEN,
    address,
    data,
  };
};

const requestToken = (address) => async (dispatch) => {
  return axios
    .get(`/users/requestTGToken/${address}`)
    .then((res) => {
      console.log("RES", res);
      dispatch(requestTokenSuccess(address, res.data));
    })
    .catch((err) => {
      console.log("ERROR", err);
    });
};

export { requestToken };
