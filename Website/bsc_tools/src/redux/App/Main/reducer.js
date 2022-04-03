import {
  CONNECT_WALLET,
  DISCONNECT_WALLET,
  GET_BALANCES,
  LOADING,
  ERROR,
} from './types';

/**
 * One helper function to build one object for one errored state.
 *
 * @param {Object} state - Current state.
 * @param action - The action that is being dispatched. Needs hasError and error properties.
 */
const actionError = (state, action) => ({
  ...state,
  hasError: action.hasError,
  error: action.error,
  isLoading: false,
  [action.type]: action.error,
});

/**
 * One helper function to build one object for one loading state.
 *
 * @param {Object} state - Current state.
 * @param action - The action that is being dispatched that will set loading the the type.
 */
const actionLoading = (state, action) => ({
  ...state,
  loadingStates: {
    ...state.loadingStates,
    [action.triggerFunction]: action.isLoading,
  },
});

const INITIAL_STATE = {
  isLoading: false,
  address: undefined,
};

const connectWallet = (state, action) => ({
  ...state,
  address: action.address,
});

const disconnectWallet = (state, action) => ({
  ...state,
  address: null,
});

const getBalances = (state, action) => ({
  ...state,
  balances: action.balances,
});

const reducer = (state = INITIAL_STATE, action) => {
  const mapper = {
    [CONNECT_WALLET]: connectWallet,
    [DISCONNECT_WALLET]: disconnectWallet,
    [GET_BALANCES]: getBalances,
    [LOADING]: actionLoading,
    [ERROR]: actionError,
  };

  if (Object.prototype.hasOwnProperty.call(mapper, action.type)) {
    return mapper[action.type](state, action);
  }
  return state;
};

export default reducer;
