import { createReducer } from '@reduxjs/toolkit';
import { HOME_BUTIKKNAVN_ENDRE } from '../actiontypes';
import { velgButikk } from './butikkSlice';
import { api } from '../api';

const defaultState = '';

const butikkReducer = createReducer(defaultState, builder => {
    builder
        .addMatcher(api.endpoints.getHandlinger.matchFulfilled, finnSisteButikknavn)
        .addCase(velgButikk, (state, action) => action.payload.butikknavn)
        .addCase(HOME_BUTIKKNAVN_ENDRE, (state, action) => action.payload.navn)
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
