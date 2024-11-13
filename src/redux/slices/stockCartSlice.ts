import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShowVendorOrder } from "../../types/VendorOrder";

interface CartState {
  stockCartItems: ShowVendorOrder[];
}

const initialState: CartState = {
  stockCartItems: [],
};

const stockCartSlice = createSlice({
  name: "stockCart",
  initialState,
  reducers: {
    setItemToStockCart: (state, action: PayloadAction<ShowVendorOrder>) => {
      // Append the new item to the existing stockCartItems
      state.stockCartItems.push(action.payload);
    },

    removeItemFromStockCart: (state, action: PayloadAction<string>) => {
      state.stockCartItems = state.stockCartItems.filter((item) => item.toy.id !== action.payload);
    },

    setUpdateQtyToStockCart: (state, action: PayloadAction<ShowVendorOrder>) => {
      if (action.payload.quantity < 1) {
        return;
      }
      const index = state.stockCartItems.findIndex((item) => item.toy.id === action.payload.toy.id);
      if (index !== -1) state.stockCartItems[index].quantity = isNaN(action.payload.quantity) ? 0 : action.payload.quantity;
    },

    clearStockCart: (state, action) => {
      state.stockCartItems = action.payload;
    },
  },
});

export const { setItemToStockCart, removeItemFromStockCart, clearStockCart, setUpdateQtyToStockCart } = stockCartSlice.actions;

export default stockCartSlice.reducer;
