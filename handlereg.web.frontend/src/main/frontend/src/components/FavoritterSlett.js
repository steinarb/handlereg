import React from 'react';
import { useDispatch } from 'react-redux';
import {
    useGetOversiktQuery,
    useGetFavoritterQuery,
    usePostFavorittSlettMutation,
} from '../api';
import { Container } from './bootstrap/Container';
import { StyledLinkLeft } from './bootstrap/StyledLinkLeft';

export default function FavoritterSlett() {
    const { data: oversikt = {}, isSuccess: oversiktIsSuccess } = useGetOversiktQuery();
    const { brukernavn } = oversikt;
    const { data: favoritter = [] } = useGetFavoritterQuery(brukernavn, { skip: !oversiktIsSuccess });
    const [ postFavorittSlett ] = usePostFavorittSlettMutation();
    const dispatch = useDispatch();

    const onFavorittClicked = async (favoritt) => {
        await postFavorittSlett(favoritt);
    }

    return (
        <div>
            <nav>
                <StyledLinkLeft to="/favoritter">Tilbake</StyledLinkLeft>
                <h1>Slett butikk(er) fra favoritt-lista</h1>
                <div>&nbsp;</div>
            </nav>
            <Container>
                { favoritter.map(f => <button key={'favoritt_' + f.favouriteid} onClick={() => onFavorittClicked({...f, brukernavn})}>{f.store.butikknavn}</button>) }
            </Container>
        </div>
    );
}
