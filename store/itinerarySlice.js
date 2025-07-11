import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  itinerary: null,
  hotels: {}, // object with city keys
  flights: []
};

const itinerarySlice = createSlice({
  name: 'itinerary',
  initialState,
  reducers: {
    setItineraryData: (state, action) => {
      state.itinerary = action.payload.itinerary;
      state.hotels = action.payload.hotels; // ✅ fixed
      state.flights = action.payload.flights;
    },
    setHotelsForCity: (state, action) => {
      const { city, hotels } = action.payload;
      state.hotels[city] = hotels;
    },
    resetItineraryData: (state) => {
      state.itinerary = null;
      state.hotels = {};
      state.flights = [];
    }
  }
});

export const { setItineraryData, setHotelsForCity, resetItineraryData } = itinerarySlice.actions;
export default itinerarySlice.reducer;
