import { configureStore } from "@reduxjs/toolkit";
import listingsSlice from "../reducers/listingSlice";

export const store = configureStore({
  reducer: {
    listings: listingsSlice,
  },
});
