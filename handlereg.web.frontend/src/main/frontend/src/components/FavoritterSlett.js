import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import { useDispatch } from 'react-redux';
import {
    useGetOversiktQuery,
    useGetFavoritterQuery,
    usePostFavorittSlettMutation,
} from '../api';

export default function FavoritterSlett() {
    const { data: oversikt = {}, isSuccess: oversiktIsSuccess } = useGetOversiktQuery();
    const { brukernavn } = oversikt;
    const { data: favoritter = [] } = useGetFavoritterQuery(brukernavn, { skip: !oversiktIsSuccess });
    const [ postFavorittSlett ] = usePostFavorittSlettMutation();
    const dispatch = useDispatch();
    const onFavorittClicked = async (favoritt) => {
        await postFavorittSlett(favoritt);
    }
    const navigate = useNavigate();
    const swipeHandlers = useSwipeable({
        onSwipedLeft: async () => navigate('/favoritter'),
    });

    return (
        <div {...swipeHandlers}>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Slett favoritter</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/favoritter">Opp</Link></li>
                </ul>
            </div>
            <div className="content-wrapper">
                <div className="favourite-group">
                    { favoritter.map(f => <button className="favourite" key={'favoritt_' + f.favouriteid} onClick={() => onFavorittClicked({...f, brukernavn})}>{f.store.butikknavn}</button>) }
                </div>
            </div>
        </div>
    );
}
