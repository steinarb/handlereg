import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { usePostNybutikkMutation } from '../api';
import { blankUtButikk, settButikknavn } from '../reducers/butikkSlice';

export default function NyButikk() {
    const dispatch = useDispatch();
    const location = useLocation();
    useEffect(() => {dispatch(blankUtButikk())}, [location]);
    const butikk = useSelector(state => state.butikk);
    const [ postNybutikk ] = usePostNybutikkMutation();

    const onLeggTilButikkClicked = async () => {
        await postNybutikk({ ...butikk, gruppe: 2 });
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
                        <input id="amount" type="text" value={butikk.butikknavn} onChange={e => dispatch(settButikknavn(e.target.value))} />
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
