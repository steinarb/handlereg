import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    useGetOversiktQuery,
    useGetButikkerQuery,
    useGetFavoritterQuery,
    usePostFavorittLeggtilMutation,
} from '../api';
import { Container } from './bootstrap/Container';
import { StyledLinkLeft } from './bootstrap/StyledLinkLeft';
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

    return (
        <div>
            <nav>
                <StyledLinkLeft to="/favoritter">Tilbake</StyledLinkLeft>
                <h1>Legg til favoritt-butikk</h1>
                <div>&nbsp;</div>
            </nav>
            <Container>
                <div>
                    { favoritter.map(f => <div key={'favoritt_' + f.favouriteid}>{f.store.butikknavn}</div>) }
                </div>
                <form onSubmit={ e => { e.preventDefault(); }}>
                    <select value={favorittbutikk} onChange={e => dispatch(VELG_FAVORITTBUTIKK(parseInt(e.target.value)))}>
                        <option key="butikk_-1" value="-1" />
                        { ledigeButikker.map(b => <option key={'butikk_' + b.storeId.toString()} value={b.storeId}>{b.butikknavn}</option>) }
                    </select>
                    <div>
                        <button disabled={ingenButikkValgt} onClick={onLeggTilFavorittClicked}>Legg til favoritt</button>
                    </div>
                </form>
            </Container>
        </div>
    );
}
