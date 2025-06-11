// ./store/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./state"; // assure-toi que le fichier state.js existe

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
