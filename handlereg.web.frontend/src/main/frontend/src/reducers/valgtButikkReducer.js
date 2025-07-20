import { createReducer } from '@reduxjs/toolkit';
import { velgButikk } from './butikkSlice';

const valgtButikkReducer = createReducer(-1, builder => {
    builder
        .addCase(velgButikk, (state, action) => {
            const { indeks } = action.payload;
            return indeks;
        });
});

export default valgtButikkReducer;
