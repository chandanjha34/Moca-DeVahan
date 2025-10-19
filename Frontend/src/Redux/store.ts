import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../Redux/features/users'
import walletReducer from '../Redux/features/wallet'
import emailReducer from './features/emails'
import authReducer from './features/auth'

export const store = configureStore({
  reducer: {
    user:userReducer,
    wallet: walletReducer,
    email:emailReducer,
    auth:authReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
