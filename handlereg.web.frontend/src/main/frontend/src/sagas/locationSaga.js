import { takeLatest, put } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'connected-react-router';
import { OVERSIKT_HENT } from '../reducers/oversikt';
import { BUTIKKER_HENT } from '../reducers/butikker';
import { SUMBUTIKK_HENT } from '../reducers/sumbutikk';
import { HANDLINGERBUTIKK_HENT } from '../reducers/handlingerbutikk';
import { SISTEHANDEL_HENT } from '../reducers/sistehandel';
import { SUMYEAR_HENT } from '../reducers/sumyear';
import { SUMYEARMONTH_HENT } from '../reducers/sumyearmonth';

function* locationChange(action) {
    const { location = {} } = action.payload || {};
    const { pathname = '' } = location;

    if (pathname === '/handlereg/') {
        yield put(OVERSIKT_HENT());
        yield put(BUTIKKER_HENT());
    }

    if (pathname === '/handlereg/endrebutikk') {
        yield put(BUTIKKER_HENT());
    }

    if (pathname === '/handlereg/statistikk/sumbutikk') {
        yield put(SUMBUTIKK_HENT());
    }

    if (pathname === '/handlereg/statistikk/handlingerbutikk') {
        yield put(HANDLINGERBUTIKK_HENT());
    }

    if (pathname === '/handlereg/statistikk/sistehandel') {
        yield put(SISTEHANDEL_HENT());
    }

    if (pathname === '/handlereg/statistikk/sumyear') {
        yield put(SUMYEAR_HENT());
    }

    if (pathname === '/handlereg/statistikk/sumyearmonth') {
        yield put(SUMYEARMONTH_HENT());
    }
}

export default function* locationSaga() {
    yield takeLatest(LOCATION_CHANGE, locationChange);
}