import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import {
    LOGOUT_HENT,
    LOGOUT_MOTTA,
    LOGOUT_ERROR,
} from '../actiontypes';

export default function* logoutSaga() {
    yield takeLatest(LOGOUT_HENT, mottaLogoutResultat);
}

function* mottaLogoutResultat() {
    try {
        const response = yield call(sendLogout);
        const logoutresult = (response.headers['content-type'] === 'application/json') ? response.data : {};
        yield put(LOGOUT_MOTTA(logoutresult));
    } catch (error) {
        yield put(LOGOUT_ERROR(error));
    }
}

function sendLogout() {
    return axios.get('/api/logout');
}
