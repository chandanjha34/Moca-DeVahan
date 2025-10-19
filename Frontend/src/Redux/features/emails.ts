import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmailState {
  value: string;
}

const initialState: EmailState = {
  value: '',
};

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    assignEmail(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
  },
});

export const { assignEmail } = emailSlice.actions;
export default emailSlice.reducer;
