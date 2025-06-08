import React from 'react';
import { Container } from './bootstrap/Container';
import { StyledLinkLeft } from './bootstrap/StyledLinkLeft';
import { StyledLinkRight } from './bootstrap/StyledLinkRight';


export default function LeggtilEndreSlette() {

    return (
        <div>
            <nav>
                <StyledLinkLeft to="/">Opp til matregnskap</StyledLinkLeft>
                <h1>Lagre/Endre/Slette</h1>
            </nav>
            <Container>
                <StyledLinkRight to="/favoritter">Favoritter</StyledLinkRight>
                <StyledLinkRight to="/nybutikk">Ny butikk</StyledLinkRight>
                <StyledLinkRight to="/endrebutikk">Endre butikk</StyledLinkRight>
            </Container>
        </div>
    );
}
