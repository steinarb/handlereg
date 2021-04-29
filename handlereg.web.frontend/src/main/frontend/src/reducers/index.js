import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { emptyUser, emptyUserAndPasswords, emptyRole, emptyPermission } from '../constants';
import login from './loginReducer';
import oversikt from './oversiktReducer';
import butikker from './butikkerReducer';
import butikk from './butikkReducer';
import valgtButikk from './valgtButikkReducer';
import handlinger from './handlingerReducer';
import nyhandling from './nyhandlingReducer';
import sumbutikk from './sumbutikkReducer';
import handlingerbutikk from './handlingerbutikkReducer';
import sistehandel from './sistehandelReducer';
import sumyear from './sumyearReducer';
import sumyearmonth from './sumyearmonthReducer';
import brukernavn from './brukernavnReducer';
import favoritter from './favoritterReducer';
import favorittbutikk from './favorittbutikkReducer';
import errors from './errorsReducer';

export default (history) => combineReducers({
    router: connectRouter(history),
    login: login,
    oversikt: oversikt,
    butikker: butikker,
    butikk: butikk,
    handlinger: handlinger,
    nyhandling: nyhandling,
    sumbutikk: sumbutikk,
    handlingerbutikk: handlingerbutikk,
    sistehandel: sistehandel,
    sumyear: sumyear,
    sumyearmonth: sumyearmonth,
    errors: errors,
    brukernavn,
    favoritter,
    favorittbutikk,
});
