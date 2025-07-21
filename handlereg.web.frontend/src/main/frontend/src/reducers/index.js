import { combineReducers } from 'redux';
import { createReducer } from '@reduxjs/toolkit';
import loginresultat from './loginresultatReducer';
import { api } from '../api';
import butikk from './butikkSlice';
import handletidspunkt from './handletidspunktReducer';
import belop from './belopReducer';
import viskvittering from './viskvitteringReducer';
import favorittbutikk from './favorittbutikkReducer';

export default (basename) => combineReducers({
    loginresultat,
    [api.reducerPath]: api.reducer,
    butikk,
    handletidspunkt,
    belop,
    viskvittering,
    favorittbutikk,
    basename: createReducer(basename, (builder) => builder),
});
