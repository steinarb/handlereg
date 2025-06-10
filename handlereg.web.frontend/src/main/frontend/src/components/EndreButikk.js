import React from 'react';
import { Link } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import {
    useGetButikkerQuery,
    usePostEndrebutikkMutation,
} from '../api';
import {
    VELG_BUTIKK,
    BUTIKKNAVN_ENDRE,
} from '../actiontypes';


const uvalgtButikk = { storeId: -1, butikknavn: '', gruppe: 2 };

export default function EndreButikk() {
    const valgtButikk = useSelector(state => state.valgtButikk);
    const butikk = useSelector(state => state.butikk);
    const butikknavn = useSelector(state => state.butikknavn);
    const { data: butikker = [] } = useGetButikkerQuery();
    const [ postEndrebutikk ] = usePostEndrebutikkMutation();
    const dispatch = useDispatch();

    const onLagreEndretButikkClicked = async () => {
        await postEndrebutikk({ ...butikk, butikknavn });
    }

    return (
        <div>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Endre butikk</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/leggetilendreslette">Legge til/Endre/Slette</Link></li>
                </ul>
            </div>
            <div className="content-wrapper">
                <form className="pure-form pure-form-aligned" onSubmit={ e => { e.preventDefault(); }}>
                    <select className="select-box" size="10" value={valgtButikk} onChange={e => dispatch(VELG_BUTIKK(butikker.find(b => b.storeId.toString()===e.target.value) || uvalgtButikk))}>
                        { butikker.map((b, indeks) => <option key={'butikk_' + b.storeId.toString()} value={b.storeId.toString()}>{b.butikknavn}</option>) }
                    </select>
                    <div className="pure-control-group">
                        <label htmlFor="amount">Butikknavn</label>
                        <input id="amount" type="text" value={butikknavn} onChange={e => dispatch(BUTIKKNAVN_ENDRE(e.target.value))} />
                    </div>
                    <div className="pure-control-group">
                        <div>&nbsp;</div>
                        <button className="pure-button pure-button-primary" onClick={onLagreEndretButikkClicked}>Lagre endret butikk</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
