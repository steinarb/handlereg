import { createReducer } from '@reduxjs/toolkit';
import {
    VELG_BUTIKK,
    HOME_BUTIKKNAVN_ENDRE,
    BUTIKKNAVN_ENDRE,
} from '../actiontypes';
import { api } from '../api';

const defaultState = '';

const butikkReducer = createReducer(defaultState, builder => {
    builder
        .addMatcher(api.endpoints.getHandlinger.matchFulfilled, finnSisteButikknavn)
        .addCase(VELG_BUTIKK, (state, action) => action.payload.butikknavn)
        .addCase(HOME_BUTIKKNAVN_ENDRE, (state, action) => action.payload.navn)
        .addCase(BUTIKKNAVN_ENDRE, (state, action) => action.payload)
        .addMatcher(api.endpoints.postNybutikk.matchFulfilled, () => (defaultState))
        .addMatcher(api.endpoints.postEndrebutikk.matchFulfilled, () => (defaultState));
});

export default butikkReducer;

function finnSisteButikknavn(state, action) {
    const { pageParams, pages } = action.payload;
    if (pageParams.length === 1) {
        const handlinger = pages[0];
        const sistebutikk = [...handlinger].pop();
        return sistebutikk.butikk;
    }

    return state;
}
