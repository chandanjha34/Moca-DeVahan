import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface userState {
  value: string;
}

// 👇 Default should just be an empty string (no need for `undefined`)
const initialState: userState = {
  value: '',
};

const userSlice = createSlice({
  name: 'username', // better to use `wallet` than `address`
  initialState,
  reducers: {
    assignUser: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { assignUser } = userSlice.actions;
export default userSlice.reducer;
