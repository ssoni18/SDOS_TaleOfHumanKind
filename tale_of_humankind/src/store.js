import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  userType: null,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false };
    case 'SET_USER_TYPE':
      return { ...state, userType: action.userType };
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
