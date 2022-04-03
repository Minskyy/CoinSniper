import { REQUEST_TOKEN } from "./types";

const INITIAL_STATE = {
  isLoading: false,
  address: undefined,
};

const requestToken = (state, action) => {
  return {
    ...state,
    isLoading: true,
    address: action.address,
    data: action.data,
  };
};

const reducer = (state = INITIAL_STATE, action) => {
  const mapper = {
    [REQUEST_TOKEN]: requestToken,
  };

  if (Object.prototype.hasOwnProperty.call(mapper, action.type)) {
    return mapper[action.type](state, action);
  }
  return state;
};

export default reducer;
