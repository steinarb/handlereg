import { createReducer } from '@reduxjs/toolkit';
import {
    VELG_FAVORITTBUTIKK,
} from '../actiontypes';

const favorittbutikkReducer = createReducer(-1, builder => {
    builder
        .addCase(VELG_FAVORITTBUTIKK, (state, action) => action.payload);
});

export default favorittbutikkReducer;
