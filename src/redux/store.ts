// src/redux/store.ts
import { configureStore, Store } from "@reduxjs/toolkit";
import statusReducer from "./slices/statusSlice";

import cartReducer from './slices/homeCartSlice'
import stockReducer from './slices/stockCartSlice'

const store: Store = configureStore({
    reducer: {
        status: statusReducer,
        home: cartReducer,
        stock: stockReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
