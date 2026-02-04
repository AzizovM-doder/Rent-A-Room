import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listingsApi } from "../api/listingsAPI";

export const fetchListings = createAsyncThunk("listings/fetch", async () => {
  return await listingsApi.getAll();
});

export const createListing = createAsyncThunk("listings/create", async (payload) => {
  return await listingsApi.create(payload);
});

export const updateListing = createAsyncThunk("listings/update", async ({ id, payload }) => {
  return await listingsApi.update(id, payload);
});

export const deleteListing = createAsyncThunk("listings/delete", async (id) => {
  await listingsApi.remove(id);
  return id;
});

const initialState = {
  items: [],
  loading: false,
  saving: false,
  deletingId: null,
  error: "",
};

export const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    clearError: (s) => {
      s.error = "";
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchListings.pending, (s) => {
      s.loading = true;
      s.error = "";
    });
    b.addCase(fetchListings.fulfilled, (s, a) => {
      s.loading = false;
      s.items = a.payload || [];
    });
    b.addCase(fetchListings.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message || "Failed";
    });

    b.addCase(createListing.pending, (s) => {
      s.saving = true;
      s.error = "";
    });
    b.addCase(createListing.fulfilled, (s, a) => {
      s.saving = false;
      s.items = [a.payload, ...s.items];
    });
    b.addCase(createListing.rejected, (s, a) => {
      s.saving = false;
      s.error = a.error.message || "Create failed";
    });

    b.addCase(updateListing.pending, (s) => {
      s.saving = true;
      s.error = "";
    });
    b.addCase(updateListing.fulfilled, (s, a) => {
      s.saving = false;
      s.items = s.items.map((x) => (String(x.id) === String(a.payload.id) ? a.payload : x));
    });
    b.addCase(updateListing.rejected, (s, a) => {
      s.saving = false;
      s.error = a.error.message || "Update failed";
    });

    b.addCase(deleteListing.pending, (s, a) => {
      s.deletingId = a.meta.arg;
      s.error = "";
    });
    b.addCase(deleteListing.fulfilled, (s, a) => {
      s.deletingId = null;
      s.items = s.items.filter((x) => String(x.id) !== String(a.payload));
    });
    b.addCase(deleteListing.rejected, (s, a) => {
      s.deletingId = null;
      s.error = a.error.message || "Delete failed";
    });
  },
});

export const { clearError } = listingsSlice.actions;
export default listingsSlice.reducer;
