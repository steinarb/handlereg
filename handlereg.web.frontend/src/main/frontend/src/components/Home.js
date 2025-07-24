import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useSwipeable } from 'react-swipeable';
import {
    useGetOversiktQuery,
    useGetHandlingerInfiniteQuery,
    useGetButikkerQuery,
    usePostNyhandlingMutation,
} from '../api';
import {
    BELOP_ENDRE,
    DATO_ENDRE,
    LOCATION_CHANGE,
} from '../actiontypes';
import { velgButikk } from '../reducers/butikkSlice';
import Kvittering from './Kvittering';
import ChevronRight from './bootstrap/ChevronRight';


export default function Home() {
    const { data: oversikt = {}, isSuccess: oversiktIsSuccess } = useGetOversiktQuery();
    const { data: handlinger, isSuccess: handlingerIsSuccess, fetchNextPage } = useGetHandlingerInfiniteQuery(oversikt.accountid, { skip: !oversiktIsSuccess });
    const username = oversikt.brukernavn;
    const { data: butikker = [] } = useGetButikkerQuery();
    const [ postNyhandling ] = usePostNyhandlingMutation();
    const butikk = useSelector(state => state.butikk);
    const [butikknavn, setButikknavn] = useState(butikk.butikknavn);
    useEffect(() => {setButikknavn(butikk.butikknavn)}, [butikk]);
    const handletidspunkt = useSelector(state => state.handletidspunkt);
    const handledato = handletidspunkt.split('T')[0];
    const belop = useSelector(state => state.belop).toString();
    const dispatch = useDispatch();
    const location = useLocation();
    useEffect(() => {dispatch(LOCATION_CHANGE(location))}, [location]);
    const onNextPageClicked = async () => fetchNextPage();
    const onRegistrerHandlingClicked = async () => {
        await postNyhandling({ storeId: butikk.storeId, belop, handletidspunkt, username })
    }
    const navigate = useNavigate();
    const swipeHandlers = useSwipeable({
        onSwipedUp: async () => fetchNextPage(),
        onSwipedLeft: async () => navigate('/hurtigregistrering'),
    });

    return (
        <div {...swipeHandlers}>
            <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
                <a className="pure-menu-heading">Matregnskap</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link className="pure-menu-link" to="/hurtigregistrering">Hurtig</Link></li>
                    <li className="pure-menu-item"><a className="pure-menu-link" href="../..">Opp</a></li>
                </ul>
            </div>
            <div className="content-wrapper navigation-link-list">
                <Link className="pure-button" to="/statistikk">Statistikk <ChevronRight/></Link>
                <Link className="pure-button" to="/leggetilendreslette">Legge til/Endre/Slette <ChevronRight/></Link>
                <form className="pure-form pure-form-aligned" onSubmit={ e => { e.preventDefault(); }}>
                    <div className="pure-control-group">
                        <label htmlFor="amount">Nytt beløp</label>
                        <input id="amount" type="number" pattern="\d+" value={belop} onChange={e => dispatch(BELOP_ENDRE(e.target.value))} />
                    </div>
                    <div className="pure-control-group">
                        <label htmlFor="jobtype">Velg butikk</label>
                        <input
                            list="butikker"
                            id="valgt-butikk"
                            name="valgt-butikk"
                            value={butikknavn}
                            onChange={e => {
                                dispatch(velgButikk(finnButikkFraNavn(e, butikker)));
                                setButikknavn(e.target.value);
                            }}/>
                        <datalist id="butikker">
                            <option key="-1" value="" />
                            {butikker.map(b => <option key={b.storeId} value={b.butikknavn}/>)}
                        </datalist>
                    </div>
                    <div className="pure-control-group">
                        <label htmlFor="date">Dato</label>
                        <input
                            id="date"
                            type="date"
                            value={handledato}
                            onChange={e => dispatch(DATO_ENDRE(e.target.value))}
                        />
                    </div>
                    <div className="pure-control-group">
                        <div>&nbsp;</div>
                        <button className="pure-button pure-button-primary" disabled={belop <= 0} onClick={onRegistrerHandlingClicked}>Registrer handling</button>
                    </div>
                </form>
                <Kvittering/>
                <p>Dine siste innkjøp, er:</p>
                <div>
                    <table className="pure-table pure-table-bordered">
                        <thead>
                            <tr>
                                <th>Dato</th>
                                <th>Beløp</th>
                                <th>Butikk</th>
                            </tr>
                        </thead>
                        <tbody>
                            {handlingerIsSuccess && handlinger.pages.map((page) => page.map((handling) =>
                                            <tr key={handling.transactionId}>
                                                <td>{new Date(handling.handletidspunkt).toISOString().split('T')[0]}</td>
                                                <td>{handling.belop}</td>
                                                <td>{handling.butikk}</td>
                                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    <button onClick={onNextPageClicked}>Neste</button>
                </div>
            </div>
        </div>
    );
}

function finnButikkFraNavn(e, butikker) {
    const butikknavn = e.target.value;
    return butikker.find(b => b.butikknavn === butikknavn);
}
