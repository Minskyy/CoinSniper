import { combineReducers } from 'redux';

import tgBotReducer from './App/TgBot/reducer';
import mainReducer from './App/Main/reducer';

const rootReducer = combineReducers({
  main: mainReducer,
  tgBot: tgBotReducer,
});

export default rootReducer;
