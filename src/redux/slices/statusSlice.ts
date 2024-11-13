import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBackEndError } from '../../types/error';

interface StatusState {
    loading: boolean;
    error: IBackEndError | null;
    backdrop: boolean;
}

const initialState: StatusState = {
    loading: false,
    error: null,
    backdrop: false
};

const statusSlice = createSlice({
    name: 'status',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setBackdrop: (state, action: PayloadAction<boolean>) => {
            state.backdrop = action.payload;
        },
        setError: (state, action: PayloadAction<IBackEndError>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    }
});

export const { setLoading, setError, clearError, setBackdrop } = statusSlice.actions;
export default statusSlice.reducer;
