import React from 'react';
import { Container } from './bootstrap/Container';
import { StyledLinkLeft } from './bootstrap/StyledLinkLeft';
import { StyledLinkRight } from './bootstrap/StyledLinkRight';

function Statistikk() {
    return (
        <div>
            <nav>
                <StyledLinkLeft to="/handlereg">Opp til matregnskap</StyledLinkLeft>
                <h1>Favoritter</h1>
                <div></div>
            </nav>
            <Container>
                <StyledLinkRight to="/handlereg/favoritter/leggtil">Legg til favoritt</StyledLinkRight>
                <StyledLinkRight to="/handlereg/favoritter/slett">Slett favoritt</StyledLinkRight>
                <StyledLinkRight to="/handlereg/favoritter/sorter">Endre rekkefølge på favoritter</StyledLinkRight>
            </Container>
        </div>
    );
}

export default Statistikk;
