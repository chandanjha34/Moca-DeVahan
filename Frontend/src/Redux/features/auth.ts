import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  name: string | null;
  email: string | null;
  role: "user" | "dealer" | "service" | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  name: null,
  email: null,
  role: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ name: string; email: string; role: "user" | "dealer" | "service"; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.name = null;
      state.email = null;
      state.role = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
