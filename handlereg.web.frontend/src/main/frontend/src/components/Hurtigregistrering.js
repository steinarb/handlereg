import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    useGetOversiktQuery,
    useGetFavoritterQuery,
    usePostNyhandlingMutation,
} from '../api';
import { Container } from './bootstrap/Container';
import { StyledLinkLeft } from './bootstrap/StyledLinkLeft';
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

    return (
        <div>
            <nav>
                <StyledLinkLeft to="/">Opp til matregnskap</StyledLinkLeft>
                <h1>Hurtigregistrering</h1>
                <div>&nbsp;</div>
            </nav>
            <Container>
                <form onSubmit={ e => { e.preventDefault(); }}>
                    <div>
                        <label htmlFor="amount">Nytt beløp</label>
                        <input id="amount" type="number" pattern="\d+" value={belop} onChange={e => dispatch(BELOP_ENDRE(e.target.value))} />
                    </div>
                    <Kvittering/>
                    { favoritter.map(f => <button key={'favoritt_' + f.favouriteid.toString()} disabled={belop <= 0} onClick={() => onStoreClicked(f.store.storeId)}>{f.store.butikknavn}</button>) }
                </form>
            </Container>
        </div>
    );
}
