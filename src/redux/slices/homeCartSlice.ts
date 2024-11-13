import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShowVendorOrder } from "../../types/VendorOrder";

interface CartState {
  homeCartItems: ShowVendorOrder[];
}

const initialState: CartState = {
  homeCartItems: [],
};

const homeCartSlice = createSlice({
  name: "homeCart",
  initialState,
  reducers: {
    setItemToHomeCart: (state, action: PayloadAction<ShowVendorOrder>) => {
      // Append the new item to the existing homeCartItems
      state.homeCartItems.push(action.payload);
    },

    removeItemFromHomeCart: (state, action: PayloadAction<string>) => {
      state.homeCartItems = state.homeCartItems.filter((item) => item.toy.id !== action.payload);
    },

    setUpdateQtyToHomeCart: (state, action: PayloadAction<ShowVendorOrder>) => {
      if (action.payload.quantity < 1) {
        return;
      }
      const index = state.homeCartItems.findIndex((item) => item.toy.id === action.payload.toy.id);
      if (index !== -1) state.homeCartItems[index].quantity = isNaN(action.payload.quantity) ? 0 : action.payload.quantity;
    },

    clearHomeCart: (state, action) => {
      state.homeCartItems = action.payload;
    },
  },
});

export const { setItemToHomeCart, removeItemFromHomeCart, clearHomeCart, setUpdateQtyToHomeCart } = homeCartSlice.actions;

export default homeCartSlice.reducer;
