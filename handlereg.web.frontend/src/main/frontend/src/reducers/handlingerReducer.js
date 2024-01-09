import { createReducer } from '@reduxjs/toolkit';
import {
    HANDLINGER_MOTTA,
} from '../actiontypes';

const handlingerReducer = createReducer([], builder => {
    builder
        .addCase(HANDLINGER_MOTTA, (state, action) => action.payload);
});

export default handlingerReducer;
