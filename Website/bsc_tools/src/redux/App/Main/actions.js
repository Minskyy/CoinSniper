import {
  CONNECT_WALLET,
  DISCONNECT_WALLET,
  GET_BALANCES,
  LOADING,
  ERROR,
} from './types';
import axios from 'axios';

const actionLoading = (triggerFunction, isLoading) => {
  return {
    type: LOADING,
    isLoading,
    triggerFunction,
  };
};

const actionError = (hasError, error, type) => ({
  type: ERROR,
  hasError,
  error,
});

const connectWalletSuccess = (address) => {
  return {
    type: CONNECT_WALLET,
    address,
  };
};

const disconnectWalletSuccess = () => {
  return {
    type: DISCONNECT_WALLET,
  };
};

const getBalancesSuccess = (balances) => {
  return {
    type: GET_BALANCES,
    balances,
  };
};

const connectwallet = () => async (dispatch) => {
  dispatch(actionLoading(CONNECT_WALLET, true));
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    const account = accounts[0];
    dispatch(connectWalletSuccess(account));
    dispatch(actionLoading(CONNECT_WALLET, false));
  } catch (error) {
    dispatch(actionError(true, error, CONNECT_WALLET));
  }
};

const disconnectWallet = () => async (dispatch) => {
  dispatch(actionLoading(DISCONNECT_WALLET, true));
  try {
    dispatch(disconnectWalletSuccess());
    dispatch(actionLoading(DISCONNECT_WALLET, false));
  } catch (error) {
    dispatch(actionError(true, error, DISCONNECT_WALLET));
  }
};

const getBalances = (address) => async (dispatch) => {
  try {
    dispatch(actionLoading(GET_BALANCES, true));
    const res = await axios.get(`/users/${address}`);
    const balances = res?.data.ethereum.address[0].balances;
    const filteredBalances = balances.filter((elem) => elem.value > 0);
    dispatch(getBalancesSuccess(filteredBalances));
    // dispatch(actionLoading(false, GET_BALANCES));
  } catch (error) {
    dispatch(actionError(true, error, GET_BALANCES));
  }
};

export {
  connectwallet,
  disconnectWallet,
  disconnectWalletSuccess,
  getBalances,
};
