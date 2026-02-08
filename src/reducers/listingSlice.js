import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listingsApi } from "../api/listingsAPI";

export const fetchListings = createAsyncThunk("listings/fetch", async () => {
  return await listingsApi.getAll();
});

export const createListing = createAsyncThunk(
  "listings/create",
  async (payload) => {
    return await listingsApi.create(payload);
  },
);

export const updateListing = createAsyncThunk(
  "listings/update",
  async ({ id, payload }) => {
    return await listingsApi.update(id, payload);
  },
);

export const deleteListing = createAsyncThunk("listings/delete", async (id) => {
  await listingsApi.remove(id);
  return id;
});

const initialState = {
  items: [
    {
      id: 1,
      name: {
        en: "Modern Apartment",
        ru: "Современная квартира",
        tj: "Хонаи муосир",
      },
      location: { en: "Dushanbe", ru: "Душанбе", tj: "Душанбе" },
      price: 35,
      rooms: 2,
      type: { en: "apartment", ru: "квартира", tj: "хона" },
      about: "Clean modern apartment in the city center.",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    },
    {
      id: 2,
      name: { en: "Family House", ru: "Семейный дом", tj: "Хонаи оилавӣ" },
      location: { en: "Hisor", ru: "Гиссар", tj: "Ҳисор" },
      price: 50,
      rooms: 4,
      type: { en: "house", ru: "дом", tj: "хона" },
      about: "Spacious house perfect for families.",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
    },
    {
      id: 3,
      name: { en: "Forest Dacha", ru: "Лесная дача", tj: "Дача дар ҷангал" },
      location: { en: "Varzob", ru: "Варзоб", tj: "Варзоб" },
      price: 60,
      rooms: 3,
      type: { en: "dacha", ru: "дача", tj: "дача" },
      about: "Quiet dacha surrounded by nature.",
      image: "https://images.unsplash.com/photo-1449844908441-8829872d2607",
    },
    {
      id: 4,
      name: { en: "City Studio", ru: "Городская студия", tj: "Студияи шаҳрӣ" },
      location: { en: "Khujand", ru: "Худжанд", tj: "Хуҷанд" },
      price: 25,
      rooms: 1,
      type: { en: "apartment", ru: "квартира", tj: "хона" },
      about: "Compact studio for solo travelers.",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    },
    {
      id: 5,
      name: {
        en: "Luxury Villa",
        ru: "Роскошная вилла",
        tj: "Виллаи боҳашамат",
      },
      location: { en: "Norak", ru: "Нурек", tj: "Норак" },
      price: 120,
      rooms: 5,
      type: { en: "house", ru: "дом", tj: "хона" },
      about: "Premium villa with lake view.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    },
    {
      id: 6,
      name: {
        en: "Cozy Apartment",
        ru: "Уютная квартира",
        tj: "Хонаи бароҳат",
      },
      location: { en: "Vahdat", ru: "Вахдат", tj: "Ваҳдат" },
      price: 30,
      rooms: 2,
      type: { en: "apartment", ru: "квартира", tj: "хона" },
      about: "Warm and cozy apartment near park.",
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
    },
    {
      id: 7,
      name: { en: "Mountain Dacha", ru: "Горная дача", tj: "Дача дар кӯҳ" },
      location: { en: "Varzob", ru: "Варзоб", tj: "Варзоб" },
      price: 70,
      rooms: 3,
      type: { en: "dacha", ru: "дача", tj: "дача" },
      about: "Dacha with mountain scenery.",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    },
    {
      id: 8,
      name: { en: "Budget Room", ru: "Бюджетная комната", tj: "Ҳуҷраи арзон" },
      location: { en: "Kulob", ru: "Куляб", tj: "Кӯлоб" },
      price: 15,
      rooms: 1,
      type: { en: "apartment", ru: "квартира", tj: "хона" },
      about: "Affordable option for short stays.",
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858",
    },
    {
      id: 9,
      name: { en: "Garden House", ru: "Дом с садом", tj: "Хона бо боғ" },
      location: { en: "Hisor", ru: "Гиссар", tj: "Ҳисор" },
      price: 55,
      rooms: 3,
      type: { en: "house", ru: "дом", tj: "хона" },
      about: "House with a private garden.",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    },
    {
      id: 10,
      name: {
        en: "Lake View Apartment",
        ru: "Квартира с видом на озеро",
        tj: "Хона бо намуди кӯл",
      },
      location: { en: "Norak", ru: "Нурек", tj: "Норак" },
      price: 65,
      rooms: 2,
      type: { en: "apartment", ru: "квартира", tj: "хона" },
      about: "Apartment with beautiful lake view.",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    },
  ],
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
      s.items =
        a.payload.length > 1
          ? a.payload
          : [
              {
                id: 1,
                name: {
                  en: "Modern Apartment",
                  ru: "Современная квартира",
                  tj: "Хонаи муосир",
                },
                location: { en: "Dushanbe", ru: "Душанбе", tj: "Душанбе" },
                price: 35,
                rooms: 2,
                type: { en: "apartment", ru: "квартира", tj: "хона" },
                about: "Clean modern apartment in the city center.",
                image:
                  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
              },
              {
                id: 2,
                name: {
                  en: "Family House",
                  ru: "Семейный дом",
                  tj: "Хонаи оилавӣ",
                },
                location: { en: "Hisor", ru: "Гиссар", tj: "Ҳисор" },
                price: 50,
                rooms: 4,
                type: { en: "house", ru: "дом", tj: "хона" },
                about: "Spacious house perfect for families.",
                image:
                  "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
              },
              {
                id: 3,
                name: {
                  en: "Forest Dacha",
                  ru: "Лесная дача",
                  tj: "Дача дар ҷангал",
                },
                location: { en: "Varzob", ru: "Варзоб", tj: "Варзоб" },
                price: 60,
                rooms: 3,
                type: { en: "dacha", ru: "дача", tj: "дача" },
                about: "Quiet dacha surrounded by nature.",
                image:
                  "https://images.unsplash.com/photo-1449844908441-8829872d2607",
              },
              {
                id: 4,
                name: {
                  en: "City Studio",
                  ru: "Городская студия",
                  tj: "Студияи шаҳрӣ",
                },
                location: { en: "Khujand", ru: "Худжанд", tj: "Хуҷанд" },
                price: 25,
                rooms: 1,
                type: { en: "apartment", ru: "квартира", tj: "хона" },
                about: "Compact studio for solo travelers.",
                image:
                  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
              },
              {
                id: 5,
                name: {
                  en: "Luxury Villa",
                  ru: "Роскошная вилла",
                  tj: "Виллаи боҳашамат",
                },
                location: { en: "Norak", ru: "Нурек", tj: "Норак" },
                price: 120,
                rooms: 5,
                type: { en: "house", ru: "дом", tj: "хона" },
                about: "Premium villa with lake view.",
                image:
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
              },
              {
                id: 6,
                name: {
                  en: "Cozy Apartment",
                  ru: "Уютная квартира",
                  tj: "Хонаи бароҳат",
                },
                location: { en: "Vahdat", ru: "Вахдат", tj: "Ваҳдат" },
                price: 30,
                rooms: 2,
                type: { en: "apartment", ru: "квартира", tj: "хона" },
                about: "Warm and cozy apartment near park.",
                image:
                  "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
              },
              {
                id: 7,
                name: {
                  en: "Mountain Dacha",
                  ru: "Горная дача",
                  tj: "Дача дар кӯҳ",
                },
                location: { en: "Varzob", ru: "Варзоб", tj: "Варзоб" },
                price: 70,
                rooms: 3,
                type: { en: "dacha", ru: "дача", tj: "дача" },
                about: "Dacha with mountain scenery.",
                image:
                  "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
              },
              {
                id: 8,
                name: {
                  en: "Budget Room",
                  ru: "Бюджетная комната",
                  tj: "Ҳуҷраи арзон",
                },
                location: { en: "Kulob", ru: "Куляб", tj: "Кӯлоб" },
                price: 15,
                rooms: 1,
                type: { en: "apartment", ru: "квартира", tj: "хона" },
                about: "Affordable option for short stays.",
                image:
                  "https://images.unsplash.com/photo-1484154218962-a197022b5858",
              },
              {
                id: 9,
                name: {
                  en: "Garden House",
                  ru: "Дом с садом",
                  tj: "Хона бо боғ",
                },
                location: { en: "Hisor", ru: "Гиссар", tj: "Ҳисор" },
                price: 55,
                rooms: 3,
                type: { en: "house", ru: "дом", tj: "хона" },
                about: "House with a private garden.",
                image:
                  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
              },
              {
                id: 10,
                name: {
                  en: "Lake View Apartment",
                  ru: "Квартира с видом на озеро",
                  tj: "Хона бо намуди кӯл",
                },
                location: { en: "Norak", ru: "Нурек", tj: "Норак" },
                price: 65,
                rooms: 2,
                type: { en: "apartment", ru: "квартира", tj: "хона" },
                about: "Apartment with beautiful lake view.",
                image:
                  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
              },
            ];
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
      s.items = s.items.map((x) =>
        String(x.id) === String(a.payload.id) ? a.payload : x,
      );
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
