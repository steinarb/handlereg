import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import { useSelector, useDispatch } from 'react-redux';
import {
    useGetOversiktQuery,
    useGetButikkerQuery,
    useGetFavoritterQuery,
    usePostFavorittLeggtilMutation,
} from '../api';
import {
    VELG_FAVORITTBUTIKK,
} from '../actiontypes';

export default function FavoritterLeggTil() {
    const { data: oversikt = {}, isSuccess: oversiktIsSuccess } = useGetOversiktQuery();
    const { brukernavn } = oversikt;
    const { data: butikker = [] } = useGetButikkerQuery();
    const { data: favoritter = [] } = useGetFavoritterQuery(brukernavn, { skip: !oversiktIsSuccess });
    const favorittbutikk = useSelector(state => state.favorittbutikk);
    const [ postFavorittLeggtil ] = usePostFavorittLeggtilMutation();
    const ledigeButikker = butikker.filter(butikk => !favoritter.find(fav => fav.store.storeId === butikk.storeId));
    const ingenButikkValgt = favorittbutikk === -1;
    const dispatch = useDispatch();
    const onLeggTilFavorittClicked = async () => {
        await postFavorittLeggtil({ brukernavn, butikk: { storeId: favorittbutikk }});
    }
    const navigate = useNavigate();
    const swipeHandlers = useSwipeable({
        onSwipedLeft: async () => navigate('/favoritter'),
    });

    return (
        <div {...swipeHandlers}>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Legg til favoritt</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/favoritter">Opp</Link></li>
                </ul>
            </div>
            <div className="content-wrapper">
                <div>
                    { favoritter.map(f => <div className="favourite" key={'favoritt_' + f.favouriteid}>{f.store.butikknavn}</div>) }
                </div>
                <form className="pure-form pure-form-aligned" onSubmit={ e => { e.preventDefault(); }}>
                    <select value={favorittbutikk} onChange={e => dispatch(VELG_FAVORITTBUTIKK(parseInt(e.target.value)))}>
                        <option key="butikk_-1" value="-1" />
                        { ledigeButikker.map(b => <option key={'butikk_' + b.storeId.toString()} value={b.storeId}>{b.butikknavn}</option>) }
                    </select>
                    <div>
                        <button className="pure-button pure-button-primary" disabled={ingenButikkValgt} onClick={onLeggTilFavorittClicked}>Legg til favoritt</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
