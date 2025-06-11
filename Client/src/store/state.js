import { createSlice } from "@reduxjs/toolkit";

// État initial
const storedUser =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user"))
    : null;

const initialState = {
  token: storedUser?.token || null,
  userInfo: storedUser?.userInfo || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "user",
          JSON.stringify({
            token: action.payload.token,
            userInfo: action.payload.userInfo,
          })
        );
      }
    },
    logout: (state) => {
      state.token = null;
      state.userInfo = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
