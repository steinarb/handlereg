import { createSlice } from '@reduxjs/toolkit';
import { api } from '../api';

const initialState = {
    storeId: -1,
    butikknavn: '',
    gruppe: 2,
};

export const butikkSlice = createSlice({
    name: 'butikk',
    initialState,
    reducers: {
        blankUtButikk: () => ({ ...initialState }),
        velgButikk: (_, action) => action.payload,
        settButikknavn: (state, action) => ({ ...state, butikknavn: action.payload }),
    },
    extraReducers: builder => {
        builder
            .addMatcher(api.endpoints.postNybutikk.matchFulfilled, () => ({ ...initialState }))
            .addMatcher(api.endpoints.postEndrebutikk.matchFulfilled, () => ({ ...initialState }));
    },
});

export const { blankUtButikk, velgButikk, settButikknavn } = butikkSlice.actions;

export default butikkSlice.reducer;
