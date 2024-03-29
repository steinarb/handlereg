import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import {
    LOGIN_HENT,
    LOGIN_MOTTA,
    LOGIN_ERROR,
} from '../actiontypes';

export default function* loginSaga() {
    yield takeLatest(LOGIN_HENT, mottaLoginResultat);
}

function* mottaLoginResultat(action) {
    try {
        const response = yield call(sendLogin, action.payload);
        const loginresult = (response.headers['content-type'] === 'application/json') ? response.data : {};
        yield put(LOGIN_MOTTA(loginresult));
    } catch (error) {
        yield put(LOGIN_ERROR(error));
    }
}

function sendLogin(credentials) {
    return axios.post('/api/login', credentials);
}
