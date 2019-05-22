import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import nyhandling, { NYHANDLING_REGISTRER } from '../reducers/nyhandling';
import { HANDLINGER_HENT } from '../reducers/handlinger';
const { NYHANDLING_LAGRET } = nyhandling.actions;
import errors from '../reducers/errors';
const { NYHANDLING_ERROR } = errors.actions;

function registrerNyhandling(handling) {
    return axios.post('/handlereg/api/nyhandling', handling);
}

function* mottaNyhandling(action) {
    try {
        const nyhandling = action.payload;
        const response = yield call(registrerNyhandling, nyhandling);
        const oversikt = (response.headers['content-type'] === 'application/json') ? response.data : [];
        yield put(NYHANDLING_LAGRET(oversikt));
        const accountid = oversikt.accountid;
        yield put(HANDLINGER_HENT(accountid));
    } catch (error) {
        yield put(NYHANDLING_ERROR(error));
    }
}

export default function* nyhandlingSaga() {
    yield takeLatest(NYHANDLING_REGISTRER, mottaNyhandling);
}
