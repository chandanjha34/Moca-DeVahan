import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletAddressState {
  value: string;
}

const initialState: WalletAddressState = {
  value: '',
};

const walletAddressSlice = createSlice({
  name: 'wallet', // better to use `wallet` than `address`
  initialState,
  reducers: {
    assignAddress: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
}); 

export const { assignAddress } = walletAddressSlice.actions;
export default walletAddressSlice.reducer;
