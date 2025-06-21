import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  itinerary: null,
  hotels: [],
  flights: []
};

const itinerarySlice = createSlice({
  name: 'itinerary',
  initialState,
  reducers: {
    setItineraryData: (state, action) => {
      state.itinerary = action.payload.itinerary;
      state.hotels = action.payload.hotels;
      state.flights = action.payload.flights;
    },
    resetItineraryData: (state) => {
      state.itinerary = null;
      state.hotels = [];
      state.flights = [];
    }
  }
});

export const { setItineraryData, resetItineraryData } = itinerarySlice.actions;
export default itinerarySlice.reducer;
