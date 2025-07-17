import React from 'react';
import { Link } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { usePostNybutikkMutation } from '../api';
import { BUTIKKNAVN_ENDRE } from '../actiontypes';

export default function NyButikk() {
    const butikknavn = useSelector(state => state.butikknavn);
    const [ postNybutikk ] = usePostNybutikkMutation();
    const dispatch = useDispatch();

    const onLeggTilButikkClicked = async () => {
        await postNybutikk({ butikknavn, gruppe: 2 });
    }

    return (
        <div>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Ny butikk</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/leggetilendreslette">Opp</Link></li>
                </ul>
            </div>
            <div className="content-wrapper">
                <form className="pure-form pure-form-aligned" onSubmit={ e => { e.preventDefault(); }}>
                    <div className="pure-control-group">
                        <label htmlFor="amount">Ny butikk</label>
                        <input id="amount" type="text" value={butikknavn} onChange={e => dispatch(BUTIKKNAVN_ENDRE(e.target.value))} />
                    </div>
                    <div className="pure-control-group">
                        <div>&nbsp;</div>
                        <button className="pure-button pure-button-primary" onClick={onLeggTilButikkClicked}>Legg til butikk</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
