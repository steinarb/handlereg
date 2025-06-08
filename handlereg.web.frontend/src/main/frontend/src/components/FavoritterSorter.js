import React from 'react';
import {
    useGetOversiktQuery,
    useGetFavoritterQuery,
    usePostFavorittByttMutation,
} from '../api';
import { Container } from './bootstrap/Container';
import { StyledLinkLeft } from './bootstrap/StyledLinkLeft';
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

    return (
        <div>
            <nav>
                <StyledLinkLeft to="/favoritter">Tilbake</StyledLinkLeft>
                <h1>Sorter favoritter</h1>
                <div>&nbsp;</div>
            </nav>
            <Container>
                {
                    favoritter.map((f, indeks, array) => {
                        const forrige = array[indeks-1];
                        const neste = array[indeks+1];
                        return (
                            <div key={'favoritt_' + f.favouriteid.toString()}>
                                <button disabled={!forrige} onClick={() => onFavorittBytt(f, forrige)}>
                                    <ChevronTop/>
                                </button>
                                <div>{f.store.butikknavn}</div>
                                <button disabled={!neste} onClick={() => onFavorittBytt(f, neste)}>
                                    <ChevronBottom/>
                                </button>
                            </div>);
                    })
                }
            </Container>
        </div>
    );
}
