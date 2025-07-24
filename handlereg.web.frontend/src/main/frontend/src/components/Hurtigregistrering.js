import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useSwipeable } from 'react-swipeable';
import {
    useGetOversiktQuery,
    useGetFavoritterQuery,
    usePostNyhandlingMutation,
} from '../api';
import Kvittering from './Kvittering';
import {
    BELOP_ENDRE,
} from '../actiontypes';

export default function Hurtigregistrering() {
    const { data: oversikt = {}, isSuccess: oversiktIsSuccess } = useGetOversiktQuery();
    const { brukernavn: username } = oversikt;
    const { data: favoritter = [] } = useGetFavoritterQuery(oversikt.brukernavn, { skip: !oversiktIsSuccess });
    const handletidspunkt = useSelector(state => state.handletidspunkt);
    const belop = useSelector(state => state.belop).toString();
    const [ postNyhandling ] = usePostNyhandlingMutation();
    const dispatch = useDispatch();
    const onStoreClicked = async (storeId) => {
        await postNyhandling({ storeId, belop, handletidspunkt, username })
    }
    const navigate = useNavigate();
    const swipeHandlers = useSwipeable({
        onSwipedLeft: async () => navigate('/'),
    });

    return (
        <div {...swipeHandlers}>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Hurtigregistrering</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/">Opp</Link></li>
                </ul>
            </div>
            <div className="content-wrapper">
                <form className="pure-form pure-form-aligned" onSubmit={ e => { e.preventDefault(); }}>
                    <div className="pure-control-group">
                        <label htmlFor="amount">Nytt beløp</label>
                        <input id="amount" type="number" pattern="\d+" value={belop} onChange={e => dispatch(BELOP_ENDRE(e.target.value))} />
                    </div>
                    <Kvittering/>
                    <div className="favourite-group">
                        { favoritter.map(f => <button className="pure-button pure-button-primary" key={'favoritt_' + f.favouriteid.toString()} disabled={belop <= 0} onClick={() => onStoreClicked(f.store.storeId)}>{f.store.butikknavn}</button>) }
                    </div>
                </form>
            </div>
        </div>
    );
}
