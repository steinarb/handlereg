import React from 'react';
import { Container } from './bootstrap/Container';
import { StyledLinkLeft } from './bootstrap/StyledLinkLeft';
import { StyledLinkRight } from './bootstrap/StyledLinkRight';

function Favoritter() {
    return (
        <div>
            <nav>
                <StyledLinkLeft to="/leggetilendreslette">Legge til/Endre/Slette</StyledLinkLeft>
                <h1>Favoritter</h1>
                <div>&nbsp;</div>
            </nav>
            <Container>
                <StyledLinkRight to="/favoritter/leggtil">Legg til favoritt</StyledLinkRight>
                <StyledLinkRight to="/favoritter/slett">Slett favoritt</StyledLinkRight>
                <StyledLinkRight to="/favoritter/sorter">Endre rekkefølge på favoritter</StyledLinkRight>
            </Container>
        </div>
    );
}

export default Favoritter;
