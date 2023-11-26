import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
}

const store = configureStore({
  reducer: {
    auth: reducer,
  },
});

export default store;
