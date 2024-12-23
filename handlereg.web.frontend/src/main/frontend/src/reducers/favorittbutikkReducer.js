import { createReducer } from '@reduxjs/toolkit';
import { VELG_FAVORITTBUTIKK } from '../actiontypes';
import { api } from '../api';

const defaultState = -1;

const favorittbutikkReducer = createReducer(defaultState, builder => {
    builder
        .addCase(VELG_FAVORITTBUTIKK, (state, action) => action.payload)
        .addMatcher(api.endpoints.postFavorittLeggtil.matchFulfilled, () => defaultState);
});

export default favorittbutikkReducer;
