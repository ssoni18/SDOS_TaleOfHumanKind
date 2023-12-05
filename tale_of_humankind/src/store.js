import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const initialState = {
  isLoggedIn: false,
  userData: null,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLoggedIn: true, userData: action.userData };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, userData: null };
    case 'UPDATE_USER_DATA':
      return { ...state, userData: action.userData };
    default:
      return state;
  }
}

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
});

let persistor = persistStore(store);

export { store, persistor };
