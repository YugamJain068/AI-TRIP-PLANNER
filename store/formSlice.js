import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: null,
  hasSubmitted: false,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
    resetFormData: (state) => {
      state.formData = null;
      state.hasSubmitted = false;
    },
    setHasSubmitted: (state, action) => {
      state.hasSubmitted = action.payload;
    },
  },
});

export const { setFormData, resetFormData, setHasSubmitted } = formSlice.actions;
export default formSlice.reducer;
