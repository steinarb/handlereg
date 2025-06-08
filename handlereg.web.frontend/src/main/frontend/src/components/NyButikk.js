import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { usePostNybutikkMutation } from '../api';
import { Container } from './bootstrap/Container';
import { StyledLinkLeft } from './bootstrap/StyledLinkLeft';
import { BUTIKKNAVN_ENDRE } from '../actiontypes';

export default function NyButikk() {
    const butikknavn = useSelector(state => state.butikknavn);
    const [ postNybutikk ] = usePostNybutikkMutation();
    const dispatch = useDispatch();

    const onLeggTilButikkClicked = async () => {
        await postNybutikk({ butikknavn, gruppe: 2 });
    }

    return (
        <div>
            <nav>
                <StyledLinkLeft to="/leggetilendreslette">Legge til/Endre/Slette</StyledLinkLeft>
                <h1>Ny butikk</h1>
                <div>&nbsp;</div>
            </nav>
            <Container>
                <form onSubmit={ e => { e.preventDefault(); }}>
                    <div>
                        <label htmlFor="amount">Ny butikk</label>
                        <input id="amount" type="text" value={butikknavn} onChange={e => dispatch(BUTIKKNAVN_ENDRE(e.target.value))} />
                    </div>
                    <div>
                        <div>&nbsp;</div>
                        <button onClick={onLeggTilButikkClicked}>Legg til butikk</button>
                    </div>
                </form>
            </Container>
        </div>
    );
}
