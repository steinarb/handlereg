import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import {
    useGetOversiktQuery,
    useGetFavoritterQuery,
    usePostFavorittByttMutation,
} from '../api';
import ChevronTop from './bootstrap/ChevronTop';
import ChevronBottom from './bootstrap/ChevronBottom';

export default function FavoritterSorter() {
    const { data: oversikt = {}, isSuccess: oversiktIsSuccess } = useGetOversiktQuery();
    const { brukernavn } = oversikt;
    const { data: favoritter = [] } = useGetFavoritterQuery(brukernavn, { skip: !oversiktIsSuccess });
    const [ postFavorittBytt ] = usePostFavorittByttMutation();
    const onFavorittBytt = async (forste, andre) => {
        await postFavorittBytt({ brukernavn, forste, andre });
    }
    const navigate = useNavigate();
    const swipeHandlers = useSwipeable({
        onSwipedLeft: async () => navigate('/favoritter'),
    });

    return (
        <div {...swipeHandlers}>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Sorter favoritter</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/favoritter">Opp</Link></li>
                </ul>
            </div>
            <div className="content-wrapper">
                {
                    favoritter.map((f, indeks, array) => {
                        const forrige = array[indeks-1];
                        const neste = array[indeks+1];
                        return (
                            <div className="favourite" key={'favoritt_' + f.favouriteid.toString()}>
                                <button disabled={!forrige} onClick={() => onFavorittBytt(f, forrige)}>
                                    <ChevronTop/>
                                </button>
                                <span>{f.store.butikknavn}</span>
                                <button disabled={!neste} onClick={() => onFavorittBytt(f, neste)}>
                                    <ChevronBottom/>
                                </button>
                            </div>);
                    })
                }
            </div>
        </div>
    );
}
