import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer from "./rootReducer";

const composeEnhancers = composeWithDevTools({
  // Specify custom devTools options
});

const middlewares = [thunk];

const store = createStore(
  rootReducer,
  /* preloadedState, */ composeEnhancers(
    applyMiddleware(...middlewares)
    // other store enhancers if any
  )
);

export default store;
