import React from 'react';
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
    HOME_BUTIKKNAVN_ENDRE,
    DATO_ENDRE,
} from '../actiontypes';
import { Container } from './bootstrap/Container';
import { StyledLinkRight } from './bootstrap/StyledLinkRight';
import Kvittering from './Kvittering';


export default function Home() {
    const { data: oversikt = {}, isSuccess: oversiktIsSuccess } = useGetOversiktQuery();
    const { data: handlinger, isSuccess: handlingerIsSuccess, fetchNextPage } = useGetHandlingerInfiniteQuery(oversikt.accountid, { skip: !oversiktIsSuccess });
    const username = oversikt.brukernavn;
    const { data: butikker = [] } = useGetButikkerQuery();
    const [ postNyhandling ] = usePostNyhandlingMutation();
    const storeId = useSelector(state => state.storeId);
    const butikknavn = useSelector(state => state.butikknavn);
    const handletidspunkt = useSelector(state => state.handletidspunkt);
    const handledato = handletidspunkt.split('T')[0];
    const belop = useSelector(state => state.belop).toString();
    const dispatch = useDispatch();
    const onNextPageClicked = async () => fetchNextPage();
    const onRegistrerHandlingClicked = async () => {
        await postNyhandling({ storeId, belop, handletidspunkt, username })
    }
    const swipeHandlers = useSwipeable({
        onSwipedUp: async () => fetchNextPage(),
    });

    return (
        <div {...swipeHandlers}>
            <nav>
                <a href="../.."><span title="chevron left" aria-hidden="true"></span>&nbsp;Gå hjem!</a>
                <h1>Matregnskap</h1>
                <StyledLinkRight to="/hurtigregistrering">Hurtig</StyledLinkRight>
            </nav>
            <Container>
                <StyledLinkRight to="/statistikk">Statistikk</StyledLinkRight>
                <StyledLinkRight to="/leggetilendreslette">Legge til/Endre/Slette</StyledLinkRight>
            </Container>
            <Container>
                <form onSubmit={ e => { e.preventDefault(); }}>
                    <div>
                        <label htmlFor="amount">Nytt beløp</label>
                        <input id="amount" type="number" pattern="\d+" value={belop} onChange={e => dispatch(BELOP_ENDRE(e.target.value))} />
                    </div>
                    <div>
                        <label htmlFor="jobtype">Velg butikk</label>
                        <div>
                            <input
                                list="butikker"
                                id="valgt-butikk"
                                name="valgt-butikk"
                                value={butikknavn}
                                onChange={e => dispatch(HOME_BUTIKKNAVN_ENDRE({ navn: e.target.value, butikker }))}/>
                            <datalist id="butikker">
                                <option key="-1" value="" />
                                {butikker.map(butikk => <option key={butikk.storeId} value={butikk.butikknavn}/>)}
                            </datalist>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="date">Dato</label>
                        <div>
                            <input
                                id="date"
                                type="date"
                                value={handledato}
                                onChange={e => dispatch(DATO_ENDRE(e.target.value))}
                            />
                        </div>
                    </div>
                    <div>
                        <div>&nbsp;</div>
                        <button disabled={belop <= 0} onClick={onRegistrerHandlingClicked}>Registrer handling</button>
                    </div>
                </form>
                <Kvittering/>
                <p>Dine siste innkjøp, er:</p>
                <div>
                    <table>
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
            </Container>
        </div>
    );
}
