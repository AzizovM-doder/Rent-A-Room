import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listingsApi } from "../api/listingsAPI";

export const fetchListings = createAsyncThunk("listings/fetch", async () => {
  return await listingsApi.getAll();
});

export const createListing = createAsyncThunk("listings/create", async (payload, { rejectWithValue }) => {
  try { return await listingsApi.create(payload); }
  catch (e) { return rejectWithValue(e.message); }
});

export const updateListing = createAsyncThunk("listings/update", async ({ id, payload }, { rejectWithValue }) => {
  try { return await listingsApi.update(id, payload); }
  catch (e) { return rejectWithValue(e.message); }
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
    clearError: (s) => { s.error = ""; },
  },
  extraReducers: (b) => {
    // ── Fetch ──────────────────────────────────────────────────────
    b.addCase(fetchListings.pending, (s) => { s.loading = true; s.error = ""; });
    b.addCase(fetchListings.fulfilled, (s, a) => { s.loading = false; s.items = a.payload || []; });
    b.addCase(fetchListings.rejected, (s, a) => { s.loading = false; s.error = a.error.message || "Failed to load"; });

    // ── Create ─────────────────────────────────────────────────────
    b.addCase(createListing.pending, (s) => { s.saving = true; s.error = ""; });
    b.addCase(createListing.fulfilled, (s, a) => { s.saving = false; s.items.unshift(a.payload); });
    b.addCase(createListing.rejected, (s, a) => { s.saving = false; s.error = a.payload || a.error.message || "Failed to create"; });

    // ── Update ─────────────────────────────────────────────────────
    b.addCase(updateListing.pending, (s) => { s.saving = true; s.error = ""; });
    b.addCase(updateListing.fulfilled, (s, a) => {
      s.saving = false;
      const idx = s.items.findIndex((x) => x.id === a.payload.id);
      if (idx !== -1) s.items[idx] = a.payload;
    });
    b.addCase(updateListing.rejected, (s, a) => { s.saving = false; s.error = a.payload || a.error.message || "Failed to update"; });

    // ── Delete ─────────────────────────────────────────────────────
    b.addCase(deleteListing.pending, (s, a) => { s.deletingId = a.meta.arg; });
    b.addCase(deleteListing.fulfilled, (s, a) => {
      s.deletingId = null;
      s.items = s.items.filter((x) => String(x.id) !== String(a.payload));
    });
    b.addCase(deleteListing.rejected, (s, a) => { s.deletingId = null; s.error = a.error.message || "Failed to delete"; });
  },
});

export const { clearError } = listingsSlice.actions;
export default listingsSlice.reducer;
