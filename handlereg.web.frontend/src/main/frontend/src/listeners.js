import { createListenerMiddleware } from '@reduxjs/toolkit';
import { isAnyOf } from '@reduxjs/toolkit';
import { api } from './api';
import { VIS_KVITTERING, LOCATION_CHANGE } from './actiontypes';
import { blankUtButikk, velgButikk } from './reducers/butikkSlice';

const listenerMiddleware = createListenerMiddleware();

const isRejectedRequest = isAnyOf(
    api.endpoints.getButikker.matchRejected,
    api.endpoints.getHandlinger.matchRejected,
    api.endpoints.getOversikt.matchRejected,
    api.endpoints.getFavoritter.matchRejected,
    api.endpoints.getSumButikk.matchRejected,
    api.endpoints.getHandlingerButikk.matchRejected,
    api.endpoints.getSisteHandel.matchRejected,
    api.endpoints.getSumYear.matchRejected,
    api.endpoints.getSumYearMonth.matchRejected,
    api.endpoints.postEndrebutikk.matchRejected,
    api.endpoints.postNybutikk.matchRejected,
    api.endpoints.postNyhandling.matchRejected,
    api.endpoints.postFavorittLeggtil.matchRejected,
    api.endpoints.postFavorittSlett.matchRejected,
    api.endpoints.postFavorittBytt.matchRejected,
)

listenerMiddleware.startListening({
    matcher: isRejectedRequest,
    effect: ({ payload }) => {
        const { originalStatus } = payload || {};
        const statusCode = parseInt(originalStatus);
        if (statusCode === 401 || statusCode === 403) {
            location.reload(true); // Will return to current location after the login process
        }
    }
})

listenerMiddleware.startListening({
    matcher: api.endpoints.getLogout.matchFulfilled,
    effect: (action, listenerApi) => {
        if (!action.payload.suksess) {
            const basename = listenerApi.getState().basename;
            location.href = basename + '/'; // Setting app top location before going to login, to avoid ending up in "/unauthorized" after login
        }
    }
})

listenerMiddleware.startListening({
    type: LOCATION_CHANGE,
    effect: (action, listenerApi) => {
        listenerApi.dispatch(VIS_KVITTERING(false)); // Blank receit display when navigating in the app
        const basename = listenerApi.getState().basename;
        const newLocation = action.payload.location.pathname;
        if (basename + '/nybutikk' === newLocation) {
            listenerApi.dispatch(blankUtButikk()); // Blank store name form when navigating into new store component
        }
    }
})

// Select store of last transaction as the current store
listenerMiddleware.startListening({
    matcher: api.endpoints.getHandlinger.matchFulfilled,
    effect: (action, listenerApi) => {
        // Find first element of first page of inifinite query, and ignore the rest
        if (action.payload.pageParams.length === 1 && action.payload.pageParams[0] === 0) {
            const firstTransaction = action.payload.pages[0][0];
            const butikker = listenerApi.getState().api.queries['getButikker(undefined)'].data;
            const sistBrukteButikk = butikker.find(b => b.storeId === firstTransaction.storeId);
            listenerApi.dispatch(velgButikk(sistBrukteButikk));
        }
    }
})

export default listenerMiddleware;
